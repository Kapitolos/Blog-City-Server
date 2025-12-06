# PostgreSQL Database Setup Guide

This guide will help you set up your PostgreSQL database for the Blog application.

## Prerequisites

- ✅ PostgreSQL installed and running
- ✅ pgAdmin installed (you mentioned you have this)
- ✅ Database "Blog" created (you mentioned you've done this)

## Step 1: Run the Database Setup Script

1. **Open pgAdmin**
2. **Connect to your PostgreSQL server** (usually "PostgreSQL" or your server name)
3. **Navigate to your "Blog" database:**
   - Expand "Servers" → Your server → "Databases" → "Blog"
4. **Open the Query Tool:**
   - Right-click on "Blog" database
   - Select "Query Tool"
5. **Load and run the setup script:**
   - Click the folder icon (Open File) in the Query Tool
   - Navigate to: `Blog-City-Server/database-setup-complete.sql`
   - Click "Open"
   - Click the Execute button (▶) or press F5
   - Wait for the script to complete (you should see "Query returned successfully")

## Step 2: Verify the Setup

After running the script, verify that all tables were created:

1. In pgAdmin, expand: `Blog` → `Schemas` → `public` → `Tables`
2. You should see the following tables:
   - ✅ `users`
   - ✅ `login`
   - ✅ `blogs`
   - ✅ `likes`
   - ✅ `comments`
   - ✅ `categories`
   - ✅ `blog_categories`

## Step 3: Configure Environment Variables (Optional but Recommended)

The server can work with default values, but it's better to create a `.env` file for configuration.

1. **Create a `.env` file** in the `Blog-City-Server` directory
2. **Copy the template** from `ENV_TEMPLATE.txt` or use this:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_NAME=Blog
DB_PORT=3002

# Server Configuration
PORT=3001

# API Configuration
API_URL=http://localhost:3001
```

**Important Notes:**
- Replace `YOUR_POSTGRES_PASSWORD` with your actual PostgreSQL password
- Update `DB_PORT` to match your PostgreSQL port (your installation uses 3002).
- If you're not sure what port PostgreSQL is using, check in pgAdmin: Right-click your server → Properties → Connection tab

## Step 4: Test the Connection

1. **Start the server:**
   ```bash
   cd Blog-City-Server
   npm install  # If you haven't already
   npm start
   ```

2. **Check for connection errors:**
   - If you see "app is running on port 3001", the database connection is working!
   - If you see connection errors, check:
     - PostgreSQL is running
     - Database name is exactly "Blog" (case-sensitive)
     - Port number matches your PostgreSQL port
     - Password is correct

## Test User Credentials

After setup, you can test with:
- **Email:** test@example.com
- **Password:** test123

## Troubleshooting

### Error: "relation does not exist"
- Make sure you ran the complete setup script
- Verify you're connected to the "Blog" database (not "postgres" or another database)

### Error: "password authentication failed"
- Check your PostgreSQL password in the `.env` file or server.js
- The default password in the code is "Redwings!" - update it if needed

### Error: "connection refused" or "could not connect"
- Make sure PostgreSQL service is running
- Check the port number (your installation uses 3002)
- Verify the host is correct (usually 127.0.0.1 or localhost)

### Error: "port" connection issues
- Verify the port number matches your PostgreSQL installation
- Check in pgAdmin: Right-click your server → Properties → Connection tab
- Update `DB_PORT` in your `.env` file to match

## What the Setup Script Does

The `database-setup-complete.sql` script:
1. Creates all required tables (users, blogs, comments, likes, categories, etc.)
2. Sets up foreign key relationships
3. Creates performance indexes
4. Adds draft/published status support
5. Adds avatar URL support
6. Inserts default categories
7. Creates a test user and sample blog posts

## Next Steps

Once the database is set up:
1. Start the backend server: `cd Blog-City-Server && npm start`
2. Start the frontend: `cd Blog-City-Client && npm start`
3. Open http://localhost:3000 in your browser

Good luck! 🚀

