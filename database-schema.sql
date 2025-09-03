-- Database schema for Blog application
-- Run this in your PostgreSQL database named 'Blog'

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

