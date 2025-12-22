-- =====================================================
-- Complete Database Setup Script for Blog Application
-- =====================================================
-- This script combines all database setup files in the correct order:
-- 1. Main schema (tables)
-- 2. Indexes (for performance)
-- 3. Drafts migration (status column)
-- 4. Avatar migration (avatar_url column)
--
-- Run this script in your PostgreSQL database named 'Blog'
-- =====================================================

-- =====================================================
-- PART 1: MAIN SCHEMA - Create all tables
-- =====================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create login table (for authentication)
CREATE TABLE IF NOT EXISTS login (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    posttitle VARCHAR(255) NOT NULL,
    postbody TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, blog_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#6a6a6a',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blog_categories junction table (many-to-many)
CREATE TABLE IF NOT EXISTS blog_categories (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(blog_id, category_id)
);

-- =====================================================
-- PART 2: INSERT DEFAULT DATA
-- =====================================================

-- Insert default categories
INSERT INTO categories (name, slug, color) VALUES
('Technology', 'technology', '#3b82f6'),
('Programming', 'programming', '#8b5cf6'),
('Design', 'design', '#ec4899'),
('Lifestyle', 'lifestyle', '#10b981'),
('Tutorial', 'tutorial', '#f59e0b'),
('News', 'news', '#ef4444'),
('Personal', 'personal', '#6366f1'),
('Other', 'other', '#6a6a6a')
ON CONFLICT (slug) DO NOTHING;

-- Insert a test user (password: test123)
INSERT INTO users (name, email, password) VALUES 
('Test User', 'test@example.com', 'test123')
ON CONFLICT (email) DO NOTHING;

-- Insert corresponding login record
INSERT INTO login (email, password, name) VALUES 
('test@example.com', 'test123', 'Test User')
ON CONFLICT (email) DO NOTHING;

-- Insert sample blog posts for testing search functionality
INSERT INTO blogs (posttitle, postbody, name, user_id) VALUES 
('Getting Started with React', 'React is a powerful JavaScript library for building user interfaces. In this post, we will explore the basics of React components, state management, and how to create interactive web applications.', 'Test User', 1),
('JavaScript Best Practices', 'Learn about modern JavaScript development practices including ES6+ features, async/await, and clean code principles that will make your code more maintainable and efficient.', 'Test User', 1),
('Database Design Fundamentals', 'Understanding database design is crucial for building scalable applications. This post covers normalization, indexing, and query optimization techniques.', 'Test User', 1),
('CSS Grid vs Flexbox', 'A comprehensive comparison between CSS Grid and Flexbox, when to use each layout method, and how they can work together to create responsive designs.', 'Test User', 1),
('Node.js Backend Development', 'Building robust backend services with Node.js, Express, and PostgreSQL. Learn about RESTful APIs, middleware, and database integration.', 'Test User', 1)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PART 3: PERFORMANCE INDEXES
-- =====================================================

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

-- =====================================================
-- PART 4: MIGRATIONS - Add additional features
-- =====================================================

-- Migration: Add status field to blogs table for draft/published functionality
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published'));

-- Update existing posts to be published
UPDATE blogs SET status = 'published' WHERE status IS NULL;

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);

-- Create composite index for user_id and status (common query pattern)
CREATE INDEX IF NOT EXISTS idx_blogs_user_status ON blogs(user_id, status);

-- Migration: Add avatar_url field to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255);

-- Create index on avatar_url for faster lookups (optional)
CREATE INDEX IF NOT EXISTS idx_users_avatar_url ON users(avatar_url) WHERE avatar_url IS NOT NULL;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your database is now ready to use.
-- 
-- Test credentials:
-- Email: test@example.com
-- Password: test123
-- =====================================================




