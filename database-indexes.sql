-- Database indexes for Blog application
-- Run this after creating the database schema to improve query performance
-- These indexes are on frequently queried fields

-- Index on blogs table for user_id (frequently used in WHERE clauses)
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON blogs(user_id);

-- Index on blogs table for created_at (used for sorting and filtering)
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);

-- Index on blogs table for posttitle (used in search queries)
CREATE INDEX IF NOT EXISTS idx_blogs_posttitle ON blogs USING gin(to_tsvector('english', posttitle));

-- Index on blogs table for postbody (used in search queries)
CREATE INDEX IF NOT EXISTS idx_blogs_postbody ON blogs USING gin(to_tsvector('english', postbody));

-- Composite index for user_id and created_at (common query pattern)
CREATE INDEX IF NOT EXISTS idx_blogs_user_created ON blogs(user_id, created_at DESC);

-- Index on likes table for blog_id (to count likes quickly)
CREATE INDEX IF NOT EXISTS idx_likes_blog_id ON likes(blog_id);

-- Index on likes table for user_id (to find user's liked posts)
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- Composite index for likes (user_id, blog_id) - already unique, but index helps lookups
-- Note: The UNIQUE constraint already creates an index, but we can add this for explicit documentation

-- Index on comments table for blog_id (to fetch comments for a post)
CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON comments(blog_id);

-- Index on comments table for user_id (to find user's comments)
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- Index on comments table for created_at (for sorting comments)
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Index on blog_categories table for blog_id (to fetch categories for a blog)
CREATE INDEX IF NOT EXISTS idx_blog_categories_blog_id ON blog_categories(blog_id);

-- Index on blog_categories table for category_id (to filter by category)
CREATE INDEX IF NOT EXISTS idx_blog_categories_category_id ON blog_categories(category_id);

-- Index on users table for email (used in authentication, already unique but explicit)
-- Note: UNIQUE constraint already creates an index

-- Index on login table for email (used in authentication)
-- Note: UNIQUE constraint already creates an index

-- Full text search index (if using PostgreSQL full-text search)
-- This is already created above with GIN indexes on posttitle and postbody



