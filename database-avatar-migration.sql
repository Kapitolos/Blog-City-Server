-- Migration: Add avatar_url field to users table
-- Run this in your PostgreSQL database

-- Add avatar_url column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255);

-- Create index on avatar_url for faster lookups (optional)
CREATE INDEX IF NOT EXISTS idx_users_avatar_url ON users(avatar_url) WHERE avatar_url IS NOT NULL;



