# Environment Variables Setup

## Server (Blog-City-Server)

### DB password: use a system environment variable (recommended)

**Do not put your database password in any text file** (including `.env`) that might be committed or shared. Set it as a **system environment variable** on your PC instead. The server and `populate-sample-data.js` read `process.env.DB_PASSWORD`, so they will use your system variable when you run them.

- **Windows:** System Properties → Environment Variables → New (e.g. name `DB_PASSWORD`, value your PostgreSQL password). Restart the terminal/IDE after setting.
- **macOS/Linux:** Add `export DB_PASSWORD='your_password'` to `~/.bashrc` or `~/.zshrc`, or set it in your shell before running the app.

### Optional .env for other settings

You can use a `.env` file in **Blog-City-Server** only for non-secret values (DB_HOST, DB_USER, DB_NAME, DB_PORT, PORT). Copy `ENV_TEMPLATE.txt` to `.env` and adjust if needed. **Do not add DB_PASSWORD to `.env`**—keep using the system env var.

### Variables

| Variable      | Description                    | Where to set        | Default (if any) |
|---------------|--------------------------------|---------------------|------------------|
| **DB_PASSWORD** | PostgreSQL password           | **System env var** | *required*      |
| DB_HOST       | Database host                  | .env or system     | 127.0.0.1        |
| DB_USER       | Database user                  | .env or system     | postgres         |
| DB_NAME       | Database name                  | .env or system     | Blog             |
| DB_PORT       | Database port                  | .env or system     | 3002             |
| PORT          | Server listen port             | .env or system     | 3001              |

### Notes

- The server and `populate-sample-data.js` read from `process.env` (system env and, if present, `.env` via dotenv). System variables are not overridden by `.env` by default.
- Keep `.env` in `.gitignore` and never commit real secrets.

---

## Client (Blog-City-Client)

### Optional: API base URL

For local development the client uses `http://localhost:3001` by default. For production (or a different backend URL), set:

| Variable             | Description              | Default              |
|----------------------|--------------------------|----------------------|
| **REACT_APP_API_URL** | Backend API base URL     | http://localhost:3001 |

Create a `.env` (or `.env.production`) in **Blog-City-Client** with:

```env
REACT_APP_API_URL=https://your-api.example.com
```

Then run `npm run build` so the value is baked into the build. Do not commit `.env` if it contains secrets (this one is usually not secret).
