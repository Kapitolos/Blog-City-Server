# Deploying to Render

## 1. Database (PostgreSQL on Render)

You created a database on Render. Use these values **only in environment variables** (never commit the password).

| Variable     | Value (External – from your PC or other hosts) |
|-------------|--------------------------------------------------|
| DB_HOST     | `dpg-d6fju4cr85hc73fi6mig-a.oregon-postgres.render.com` |
| DB_PORT     | `5432` |
| DB_USER     | `blogcity_user` |
| DB_NAME     | `blogcity` |
| DB_PASSWORD | *(copy from Render Dashboard → your PostgreSQL service → Connection string / Environment)* |

- **From your PC:** use the **External** host above and set `DB_PASSWORD` in your system env (or in a local `.env` in Blog-City-Server).
- **From a Render Web Service (backend on Render):** use the **Internal** host: `dpg-d6fju4cr85hc73fi6mig-a` and the same user/password/database. Set all of these in the service’s **Environment** tab.

SSL is enabled by default for the script; if you need to disable it locally, set `DB_SSL=false`.

---

## 2. Run schema and migrations on the Render database

From your machine (with `DB_*` set for the **external** connection):

```bash
cd Blog-City-Server
node scripts/run-schema-remote.js
```

This runs the full schema and migrations. If it succeeds, your Render database is ready.

Optional: seed sample data:

```bash
node populate-sample-data.js
```

(Uses the same `DB_*` env vars; ensure they point at the Render DB.)

---

## 3. Next steps

- Deploy the **backend** (this repo) as a Render Web Service and set the **internal** DB_* env vars there.
- Deploy the **client** (e.g. Vercel/Netlify) with `REACT_APP_API_URL` set to your backend URL.
