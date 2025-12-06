-- Migration: Add user preferences and custom categories support
-- Run this in your PostgreSQL database

-- Add preferred_category_id to users table for saving filter preferences
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS preferred_category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

-- Add user_id to categories table for custom user-created categories
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

-- Add is_public flag to categories (default categories are public, custom ones can be private)
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Update existing categories to be public
UPDATE categories SET is_public = true WHERE is_public IS NULL;

-- Create index on user_id in categories for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

-- Create index on preferred_category_id in users for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_preferred_category_id ON users(preferred_category_id);


