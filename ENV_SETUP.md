# Environment Variables Setup

## Important: Create .env file

The `.env` file must be named exactly `.env` (with a dot at the beginning) and placed in the `my-server` directory.

## Steps to Create .env File

1. Navigate to the `my-server` directory
2. Create a new file named `.env` (not `server.env` or `env.txt`)
3. Copy the contents from `ENV_TEMPLATE.txt` into your `.env` file
4. Update the values with your actual database credentials

## .env File Template

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_USER=postgres
DB_PASSWORD=Redwings!
DB_NAME=Blog
DB_PORT=3002

# Server Configuration
PORT=3001

# API Configuration
API_URL=http://localhost:3001
```

## Notes

- The `.env` file is already in `.gitignore` so it won't be committed to version control
- Never commit your actual `.env` file with real passwords
- The server will use these environment variables automatically when you start it
- If `.env` doesn't exist, the server will use default values (which may not work)

## Verification

After creating the `.env` file, restart your server. The server should connect to your database using the credentials from the `.env` file.



