# Blog Application Setup Guide

## Prerequisites
- Node.js installed
- PostgreSQL installed and running
- Git (optional)

## Database Setup
1. Create a PostgreSQL database named 'Blog'
2. Run the SQL commands from `database-schema.sql` in your PostgreSQL client
3. Update the database connection in `src/server.js` if needed:
   ```javascript
   const db = knex({
       client: 'pg',
       connection: {
           host: '127.0.0.1',
           user: 'postgres',
           password: 'YOUR_PASSWORD',
           database: 'Blog'
       }
   })
   ```

## Backend Setup (Port 3001)
1. Navigate to the `my-server` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. The server will run on http://localhost:3001

## Frontend Setup (Port 3000)
1. Navigate to the `my-blog` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```
4. The app will run on http://localhost:3000

## Test User
- Email: test@example.com
- Password: test123

## Features
- User registration and login
- Create and view blog posts
- View old posts
- Search functionality

## Troubleshooting
- Ensure PostgreSQL is running
- Check that ports 3000 and 3001 are available
- Verify database connection credentials
- Check browser console for any errors

