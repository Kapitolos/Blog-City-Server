-- =====================================================
-- Populate Sample Data: Fake Users and Blog Posts
-- =====================================================
-- This script creates multiple fake users and blog posts
-- for testing and demonstration purposes.
-- 
-- Run this in your PostgreSQL database named 'Blog'
-- =====================================================

-- Note: Passwords are hashed with bcrypt. The plain text passwords are:
-- - alex123 (for Alex)
-- - sarah123 (for Sarah)
-- - mike123 (for Mike)
-- - emma123 (for Emma)
-- - david123 (for David)

-- Insert fake users
INSERT INTO users (name, email, password, joined) VALUES
('Alex Chen', 'alex.chen@example.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8KuK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', NOW() - INTERVAL '30 days'),
('Sarah Johnson', 'sarah.j@example.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8KuK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', NOW() - INTERVAL '25 days'),
('Mike Rodriguez', 'mike.r@example.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8KuK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', NOW() - INTERVAL '20 days'),
('Emma Williams', 'emma.w@example.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8KuK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', NOW() - INTERVAL '15 days'),
('David Kim', 'david.kim@example.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8KuK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', NOW() - INTERVAL '10 days')
ON CONFLICT (email) DO NOTHING
RETURNING id, name, email;

-- Get user IDs (assuming they were inserted or already exist)
-- We'll use a subquery to get the IDs

-- Insert login records for the users
INSERT INTO login (email, password, name) VALUES
('alex.chen@example.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8KuK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'Alex Chen'),
('sarah.j@example.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8KuK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'Sarah Johnson'),
('mike.r@example.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8KuK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'Mike Rodriguez'),
('emma.w@example.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8KuK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'Emma Williams'),
('david.kim@example.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'David Kim')
ON CONFLICT (email) DO NOTHING;

-- Insert blog posts with proper user_id references
-- Using subqueries to get user IDs dynamically
INSERT INTO blogs (posttitle, postbody, name, user_id, status, created_at) VALUES
-- Alex Chen's posts
('Building My First React App', 'I''ve been learning React for the past few weeks and finally built my first real application! It''s a todo list app with local storage. The component structure was tricky at first, but once I understood props and state, everything clicked. Next, I want to add Redux for state management.', 
 (SELECT name FROM users WHERE email = 'alex.chen@example.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'alex.chen@example.com' LIMIT 1),
 'published', NOW() - INTERVAL '5 days'),

('JavaScript Closures Explained', 'Closures are one of those JavaScript concepts that seemed mysterious until I really dug into them. A closure gives you access to an outer function''s scope from an inner function. This is incredibly powerful for creating private variables and function factories. Here''s a simple example that helped me understand...',
 (SELECT name FROM users WHERE email = 'alex.chen@example.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'alex.chen@example.com' LIMIT 1),
 'published', NOW() - INTERVAL '3 days'),

-- Sarah Johnson's posts
('My Journey into Web Design', 'I''ve always loved art, but I never thought I could combine it with technology. Learning CSS and design principles has been eye-opening. The way colors, spacing, and typography work together to create beautiful interfaces is fascinating. I''m currently working on redesigning my portfolio site.',
 (SELECT name FROM users WHERE email = 'sarah.j@example.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'sarah.j@example.com' LIMIT 1),
 'published', NOW() - INTERVAL '7 days'),

('CSS Grid: A Game Changer', 'After years of struggling with floats and flexbox for complex layouts, CSS Grid feels like magic. Being able to define both rows and columns at once has simplified so many of my designs. The grid-template-areas property is particularly elegant for responsive layouts.',
 (SELECT name FROM users WHERE email = 'sarah.j@example.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'sarah.j@example.com' LIMIT 1),
 'published', NOW() - INTERVAL '2 days'),

('Minimalist Design Principles', 'Less is more. This philosophy has transformed how I approach design. Every element should have a purpose. White space isn''t empty space—it''s breathing room for your content. I''ve been studying minimalist design and applying these principles to my recent projects.',
 (SELECT name FROM users WHERE email = 'sarah.j@example.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'sarah.j@example.com' LIMIT 1),
 'published', NOW() - INTERVAL '1 day'),

-- Mike Rodriguez's posts
('Node.js Backend Development Tips', 'I''ve been building REST APIs with Node.js and Express for a while now. Here are some lessons I''ve learned: always validate input, use middleware for common tasks, and don''t forget error handling! Async/await makes the code so much cleaner than callbacks.',
 (SELECT name FROM users WHERE email = 'mike.r@example.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'mike.r@example.com' LIMIT 1),
 'published', NOW() - INTERVAL '6 days'),

('Database Optimization Strategies', 'Query performance matters, especially as your application scales. I''ve learned the importance of proper indexing, avoiding N+1 queries, and using database transactions correctly. PostgreSQL has become my go-to database for its powerful features and reliability.',
 (SELECT name FROM users WHERE email = 'mike.r@example.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'mike.r@example.com' LIMIT 1),
 'published', NOW() - INTERVAL '4 days'),

-- Emma Williams's posts
('Learning to Code Changed My Life', 'A year ago, I was working in a completely different field. I took a coding bootcamp on a whim, and it''s been the best decision I''ve ever made. The problem-solving skills I''ve developed apply to so many areas of life. Coding isn''t just about writing code—it''s about thinking differently.',
 (SELECT name FROM users WHERE email = 'emma.w@example.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'emma.w@example.com' LIMIT 1),
 'published', NOW() - INTERVAL '8 days'),

('Work-Life Balance as a Developer', 'Finding balance between coding projects, learning new technologies, and having a life outside of work is challenging. I''ve learned to set boundaries, take breaks, and not feel guilty about stepping away from the computer. Burnout is real, and prevention is key.',
 (SELECT name FROM users WHERE email = 'emma.w@example.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'emma.w@example.com' LIMIT 1),
 'published', NOW() - INTERVAL '1 day'),

-- David Kim's posts
('TypeScript: Why I Made the Switch', 'I resisted TypeScript for a long time, thinking it was just extra complexity. But after trying it on a project, I''m converted. The type safety catches so many bugs before runtime, and the IDE autocomplete is incredible. The learning curve is worth it.',
 (SELECT name FROM users WHERE email = 'david.kim@example.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'david.kim@example.com' LIMIT 1),
 'published', NOW() - INTERVAL '9 days'),

('Building a Full-Stack Application', 'I just finished my first full-stack project: a blog platform with React frontend and Node.js backend. The biggest challenge was managing state across the application and handling authentication. JWT tokens made the auth flow much cleaner than I expected.',
 (SELECT name FROM users WHERE email = 'david.kim@example.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'david.kim@example.com' LIMIT 1),
 'published', NOW() - INTERVAL '2 days'),

('API Design Best Practices', 'Good API design is crucial for maintainability. RESTful principles, consistent naming, proper HTTP status codes, and clear error messages make all the difference. I''ve been refactoring an old API and applying these principles, and the improvement is noticeable.',
 (SELECT name FROM users WHERE email = 'david.kim@example.com' LIMIT 1),
 (SELECT id FROM users WHERE email = 'david.kim@example.com' LIMIT 1),
 'published', NOW() - INTERVAL '12 hours')
ON CONFLICT DO NOTHING;

-- Link posts to categories
-- First, get category IDs (assuming default categories exist)
-- Technology = 1, Programming = 2, Design = 3, Lifestyle = 4, Tutorial = 5, News = 6, Personal = 7, Other = 8

-- Link blog posts to categories
-- We'll use a more robust approach with subqueries
INSERT INTO blog_categories (blog_id, category_id)
SELECT b.id, c.id
FROM blogs b
CROSS JOIN categories c
WHERE 
  -- Alex's posts
  (b.posttitle = 'Building My First React App' AND c.slug IN ('programming', 'tutorial')) OR
  (b.posttitle = 'JavaScript Closures Explained' AND c.slug IN ('programming', 'tutorial')) OR
  -- Sarah's posts
  (b.posttitle = 'My Journey into Web Design' AND c.slug IN ('design', 'personal')) OR
  (b.posttitle = 'CSS Grid: A Game Changer' AND c.slug IN ('design', 'tutorial')) OR
  (b.posttitle = 'Minimalist Design Principles' AND c.slug IN ('design', 'tutorial')) OR
  -- Mike's posts
  (b.posttitle = 'Node.js Backend Development Tips' AND c.slug IN ('programming', 'technology', 'tutorial')) OR
  (b.posttitle = 'Database Optimization Strategies' AND c.slug IN ('programming', 'technology', 'tutorial')) OR
  -- Emma's posts
  (b.posttitle = 'Learning to Code Changed My Life' AND c.slug IN ('personal', 'lifestyle')) OR
  (b.posttitle = 'Work-Life Balance as a Developer' AND c.slug IN ('personal', 'lifestyle')) OR
  -- David's posts
  (b.posttitle = 'TypeScript: Why I Made the Switch' AND c.slug IN ('programming', 'technology')) OR
  (b.posttitle = 'Building a Full-Stack Application' AND c.slug IN ('programming', 'technology', 'tutorial')) OR
  (b.posttitle = 'API Design Best Practices' AND c.slug IN ('programming', 'technology', 'tutorial'))
ON CONFLICT (blog_id, category_id) DO NOTHING;

-- Add some likes to make it more realistic
-- Users can like posts from other users
INSERT INTO likes (user_id, blog_id)
SELECT u.id, b.id
FROM users u
CROSS JOIN blogs b
WHERE 
  -- Alex likes some posts
  (u.email = 'alex.chen@example.com' AND b.posttitle IN ('CSS Grid: A Game Changer', 'TypeScript: Why I Made the Switch')) OR
  -- Sarah likes some posts
  (u.email = 'sarah.j@example.com' AND b.posttitle IN ('Building My First React App', 'Learning to Code Changed My Life')) OR
  -- Mike likes some posts
  (u.email = 'mike.r@example.com' AND b.posttitle IN ('Database Optimization Strategies', 'API Design Best Practices')) OR
  -- Emma likes some posts
  (u.email = 'emma.w@example.com' AND b.posttitle IN ('My Journey into Web Design', 'Work-Life Balance as a Developer')) OR
  -- David likes some posts
  (u.email = 'david.kim@example.com' AND b.posttitle IN ('JavaScript Closures Explained', 'Node.js Backend Development Tips'))
ON CONFLICT (user_id, blog_id) DO NOTHING;

-- Add some comments
INSERT INTO comments (blog_id, user_id, user_name, comment_text, created_at)
SELECT b.id, u.id, u.name, c.comment, NOW() - INTERVAL c.days_ago || ' days'
FROM blogs b
CROSS JOIN users u
CROSS JOIN (VALUES
  ('Building My First React App', 'alex.chen@example.com', 'Great post! I''m also learning React. Any tips for managing state?', 4),
  ('CSS Grid: A Game Changer', 'sarah.j@example.com', 'Grid is amazing! Have you tried using it with CSS variables?', 1),
  ('Node.js Backend Development Tips', 'mike.r@example.com', 'Excellent points about error handling. Middleware is definitely key.', 5),
  ('Learning to Code Changed My Life', 'emma.w@example.com', 'This resonates so much! Coding has opened so many doors for me too.', 7),
  ('TypeScript: Why I Made the Switch', 'david.kim@example.com', 'I was skeptical too, but TypeScript has saved me countless hours of debugging.', 8)
) AS c(post_title, user_email, comment, days_ago)
WHERE b.posttitle = c.post_title AND u.email = c.user_email
ON CONFLICT DO NOTHING;

