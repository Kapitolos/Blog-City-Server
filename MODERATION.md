# Content moderation

## Blocklist (posts and comments)

- **File:** `src/moderation/blocklist.js`
- Add banned words or phrases to the `BLOCKLIST` array (lowercase recommended; matching is case-insensitive).
- Any post title, post body, or comment that contains a blocklisted term is rejected with: *"Your content does not meet our community guidelines. Please revise and try again."*
- Keep the list server-side only; do not expose it to the client.

## Rate limiting

- **General:** 300 requests per 15 minutes per IP.
- **Create post:** 20 per 15 minutes per IP.
- **Create comment:** 60 per 15 minutes per IP.
- **Upload (image/avatar):** 30 per 15 minutes per IP.

Configured in `src/server.js` with `express-rate-limit`.

## Reports

- **Table:** `reports` (run `database-reports-migration.sql` or use `node scripts/run-schema-remote.js`).
- **POST /report** – Body: `blog_id` or `comment_id`, `reporter_id`, `reason` (`spam` | `harassment` | `inappropriate` | `other`), optional `details`.
- **GET /reports** – Returns recent reports (for admin review). Optional query: `?limit=50` (max 100).

No auth is applied to these endpoints; add authentication/authorization if you restrict access.

## Optional next steps

- **Perspective API (Google):** Call from the server to score text for toxicity; reject or flag if above a threshold. Set `PERSPECTIVE_API_KEY` and add a small integration in the moderation layer.
- **Image moderation:** Use an image-moderation API (e.g. Google Cloud Vision Safe Search, AWS Rekognition) on upload and reject or flag unsafe images.
- **Admin UI:** Use GET /reports and add an admin page to review and hide/delete reported content.
