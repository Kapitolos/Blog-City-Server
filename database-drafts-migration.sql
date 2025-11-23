-- Migration: Add status field to blogs table for draft/published functionality
-- Run this in your PostgreSQL database

-- Add status column to blogs table (default to 'published' for existing posts)
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published'));

-- Update existing posts to be published
UPDATE blogs SET status = 'published' WHERE status IS NULL;

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);

-- Create composite index for user_id and status (common query pattern)
CREATE INDEX IF NOT EXISTS idx_blogs_user_status ON blogs(user_id, status);



