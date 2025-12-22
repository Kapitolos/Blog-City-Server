-- Migration: Add support for multiple category preferences
-- Run this in your PostgreSQL database

-- Add preferred_category_ids_json column to store array of category IDs as JSON
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS preferred_category_ids_json TEXT;

-- Create index for faster lookups (though JSON queries are limited)
-- Note: PostgreSQL JSONB would be better, but TEXT is simpler for now

