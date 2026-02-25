-- Migration: Add follows and hidden_users tables for user following and hiding functionality

-- Create follows table (who follows whom)
CREATE TABLE IF NOT EXISTS follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK(follower_id != following_id) -- Prevent self-following
);

-- Create hidden_users table (users hidden from a user's feed)
CREATE TABLE IF NOT EXISTS hidden_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hidden_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, hidden_user_id),
    CHECK(user_id != hidden_user_id) -- Prevent self-hiding
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_hidden_users_user ON hidden_users(user_id);
CREATE INDEX IF NOT EXISTS idx_hidden_users_hidden ON hidden_users(hidden_user_id);



