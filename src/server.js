require('dotenv').config();
const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');
const sanitize = require('./utils/sanitize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'Redwings!',
        database: process.env.DB_NAME || 'Blog',
        port: process.env.DB_PORT || 3002
    }
})




const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const imagesDir = path.join(uploadsDir, 'images');
const avatarsDir = path.join(uploadsDir, 'avatars');

[uploadsDir, imagesDir, avatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const imageFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit for avatars
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));


app.get('/', (req, res)=> {
    res.send(db.users);
})


app.post('/signin', (req, res) => {
  let { email, password } = req.body;
  
  // Sanitize input
  email = sanitize.sanitizeInput(email);
  
  console.log('Signin attempt for email:', email);
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  db.select('*').from('users')
    .where('email', '=', email)
    .then(users => {
      if (users.length === 0) {
        console.log('Signin failed: user not found');
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      const user = users[0];
      
      // Check password (handle both hashed and plain text for existing users)
      if (user.password === password || bcrypt.compareSync(password, user.password)) {
        console.log('User found and authenticated');
        res.json(user);
      } else {
        console.log('Signin failed: invalid password');
        res.status(400).json({ error: 'Invalid credentials' });
      }
    })
    .catch(err => {
      console.error('Database error during signin:', err);
      res.status(500).json({ error: 'Database error occurred' });
    });
});

app.post('/register', (req, res) => {
  let { email, name, password } = req.body;
  
  // Sanitize input (don't sanitize password as it will be hashed)
  email = sanitize.sanitizeInput(email);
  name = sanitize.sanitizeInput(name);
  
  console.log('Registration attempt:', { email, name, passwordLength: password ? password.length : 0 });
  
  // Validate input
  if (!email || !name || !password) {
    console.log('Validation failed: missing fields');
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (password.length < 6) {
    console.log('Validation failed: password too short');
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  if (!email.includes('@')) {
    console.log('Validation failed: invalid email');
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  
  // Check if email already exists
  db.select('*').from('users').where('email', '=', email)
    .then(existingUsers => {
      if (existingUsers.length > 0) {
        console.log('Registration failed: email already exists');
        return res.status(400).json({ error: 'Email already registered. Please use a different email or sign in.' });
      }
      
      console.log('Creating new user...');
      
      // Hash password and create user
      bcrypt.hash(password, 10, (err, hashPassword) => {
        if (err) {
          console.error('Password hashing error:', err);
          return res.status(500).json({ error: 'Password hashing failed' });
        }

        db.transaction(trx => {
          return trx.insert({
            password: hashPassword,
            email: email,
            name: name
          })
          .into('login')
          .returning('email')
          .then(loginEmail => {
            return trx('users')
              .returning('*')
              .insert({
                email: loginEmail[0],
                name: name,
                password: hashPassword,
                joined: new Date()
              })
              .then(user => {
                console.log('User created successfully:', user[0]);
                res.json(user[0]);
              });
          })
          .then(trx.commit)
          .catch(trx.rollback);
        })
        .catch(err => {
          console.error('Database transaction error:', err);
          res.status(400).json({ error: 'Unable to register' });
        });
      });
    })
    .catch(err => {
      console.error('Database error checking existing user:', err);
      res.status(500).json({ error: 'Database error occurred' });
    });
});
  
  app.post('/blogpost', (req, res) => {
    let { postbody, name, posttitle, id, category_ids, status = 'published' } = req.body;
    
    // Sanitize input
    name = sanitize.sanitizeInput(name);
    // Don't escape HTML entities in title - it's displayed as plain text, not HTML
    // Just trim and validate, but don't escape since React will handle it safely
    posttitle = posttitle ? posttitle.trim() : '';
    postbody = sanitize.sanitizeText(postbody); // Use sanitizeText for blog content
    status = status === 'draft' ? 'draft' : 'published'; // Ensure valid status
    
    console.log('=== BLOG POST CREATION ATTEMPT ===');
    console.log('Request body:', { postbody: postbody?.substring(0, 50) + '...', name, posttitle, id, category_ids, status });
    console.log('User ID type:', typeof id, 'Value:', id);
    
    // Validate required fields
    // For drafts, only title is required. For published, both title and body are required.
    if (!posttitle || !name || !id) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: { postbody: !!postbody, posttitle: !!posttitle, name: !!name, id: !!id }
      });
    }
    
    // For published posts, body is required
    if (status === 'published' && !postbody) {
      console.log('❌ Published posts require content');
      return res.status(400).json({ 
        error: 'Published posts require content', 
        details: 'Please add content to your post before publishing'
      });
    }
    
    db.transaction(trx => {
      return trx('blogs')
      .returning('*')
      .insert({
        postbody: postbody,
        posttitle: posttitle,
        name: name,
        user_id: id,
        status: status
      })
      .then(result => {
        const blogPost = result[0];
        console.log('✅ Blog post created successfully:', blogPost);
        
        // If categories are provided, link them to the blog post
        if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
          const categoryLinks = category_ids.map(catId => ({
            blog_id: blogPost.id,
            category_id: catId
          }));
          
          return trx('blog_categories')
            .insert(categoryLinks)
            .then(() => blogPost);
        }
        
        return blogPost;
      });
      // Knex will automatically commit on success or rollback on error
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log('❌ Database error details:', {
        code: err.code,
        detail: err.detail,
        message: err.message,
        constraint: err.constraint
      });
      res.status(400).json({ 
        error: 'Unable to create blog post', 
        details: err.message,
        code: err.code
      });
    })
  })

  // Update (edit) a blog post
  app.put('/blogpost/:id', (req, res) => {
    const { id } = req.params;
    let { postbody, posttitle, user_id, status } = req.body;
    
    // Sanitize input
    // Don't escape HTML entities in title - it's displayed as plain text
    posttitle = posttitle ? posttitle.trim() : '';
    postbody = sanitize.sanitizeText(postbody); // Use sanitizeText for blog content
    if (status) {
      status = status === 'draft' ? 'draft' : 'published'; // Ensure valid status
    }
    
    console.log('=== BLOG POST UPDATE ATTEMPT ===');
    console.log('Post ID:', id);
    console.log('Request body:', { postbody: postbody?.substring(0, 50) + '...', posttitle, user_id, status });
    
    // Validate required fields
    if (!postbody || !posttitle || !user_id) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: { postbody: !!postbody, posttitle: !!posttitle, user_id: !!user_id }
      });
    }
    
    db.transaction(trx => {
      // First, verify the post exists and belongs to the user
      return trx('blogs')
        .where({ id: id, user_id: user_id })
        .first()
        .then(post => {
          if (!post) {
            throw new Error('Post not found or you do not have permission to edit it');
          }
          
          // Build update object
          const updateData = {
            postbody: postbody.trim(),
            posttitle: posttitle.trim()
          };
          
          // Add status if provided
          if (status) {
            updateData.status = status;
          }
          
          // Update the post
          return trx('blogs')
            .where({ id: id, user_id: user_id })
            .update(updateData)
            .returning('*')
            .then(result => {
              if (result.length === 0) {
                throw new Error('Failed to update post');
              }
              console.log('✅ Blog post updated successfully:', result[0]);
              return result[0];
            });
        });
      // Knex will automatically commit on success or rollback on error
    })
    .then(updatedPost => {
      res.json(updatedPost);
    })
    .catch(err => {
      console.log('❌ Database error details:', {
        message: err.message
      });
      res.status(400).json({ 
        error: err.message || 'Unable to update blog post', 
        details: err.message
      });
    });
  });

  // Delete a blog post
  app.delete('/blogpost/:id', (req, res) => {
    const { id } = req.params;
    const { user_id } = req.query; // Get user_id from query string
    
    console.log('=== BLOG POST DELETE ATTEMPT ===');
    console.log('Post ID:', id);
    console.log('User ID:', user_id);
    
    if (!user_id) {
      return res.status(400).json({ 
        error: 'User ID is required' 
      });
    }
    
    db.transaction(trx => {
      // First, verify the post exists and belongs to the user
      return trx('blogs')
        .where({ id: id, user_id: user_id })
        .first()
        .then(post => {
          if (!post) {
            throw new Error('Post not found or you do not have permission to delete it');
          }
          
          // Delete the post
          return trx('blogs')
            .where({ id: id, user_id: user_id })
            .del()
            .then(deletedCount => {
              if (deletedCount === 0) {
                throw new Error('Failed to delete post');
              }
              console.log('✅ Blog post deleted successfully');
              return { success: true, id: id };
            });
        });
      // Knex will automatically commit on success or rollback on error
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log('❌ Database error details:', {
        message: err.message
      });
      res.status(400).json({ 
        error: err.message || 'Unable to delete blog post', 
        details: err.message
      });
    });
  });

    app.post('/oldblogpost', (req, res) => {
    const { name, posttitle, id } = req.body;
    console.log(posttitle.replace(/['"]+/g, ''));
    console.log(id);
      db.transaction(trx => {
        return trx.returning('postbody').from('blogs').where("posttitle", posttitle.replace(/['"]+/g, ''))
        .then(user => {
          res.json(user);
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('unable to get old blog post'))
  })

    app.post('/allblogs', (req, res) => {
      const { page = 1, limit = 10, category_id } = req.body;
      const offset = (page - 1) * limit;
      
      console.log('=== ALLBLOGS REQUEST ===');
      console.log('Request body:', { page, limit, category_id, offset });
      
      // Build query with optional category filter
      // Try to filter by status (published posts), fall back if column doesn't exist
      let blogsQuery = db('blogs');
      let countQuery = db('blogs');
      
      // Add status filter (will fail gracefully if column doesn't exist)
      blogsQuery = blogsQuery.where(function() {
        this.where('status', 'published').orWhereNull('status');
      });
      countQuery = countQuery.where(function() {
        this.where('status', 'published').orWhereNull('status');
      });
      
      if (category_id) {
        blogsQuery = blogsQuery
          .join('blog_categories', 'blogs.id', 'blog_categories.blog_id')
          .where('blog_categories.category_id', category_id)
          .select('blogs.*')
          .distinct();
        countQuery = countQuery
          .join('blog_categories', 'blogs.id', 'blog_categories.blog_id')
          .where('blog_categories.category_id', category_id)
          .where(function() {
            this.where('blogs.status', 'published').orWhereNull('blogs.status');
          });
      }
      
      // Get total count and paginated results
      // If status column doesn't exist, catch will handle fallback
      Promise.all([
        countQuery.count('* as total').first(),
        blogsQuery
          .orderBy('blogs.created_at', 'desc')
          .limit(limit)
          .offset(offset)
      ])
        .catch(err => {
          // If query failed (possibly due to missing status column), try without status filter
          console.log('Query failed, trying without status filter:', err.message);
          let fallbackQuery = db('blogs');
          let fallbackCount = db('blogs');
          
          if (category_id) {
            fallbackQuery = fallbackQuery
              .join('blog_categories', 'blogs.id', 'blog_categories.blog_id')
              .where('blog_categories.category_id', category_id)
              .select('blogs.*')
              .distinct();
            fallbackCount = fallbackCount
              .join('blog_categories', 'blogs.id', 'blog_categories.blog_id')
              .where('blog_categories.category_id', category_id);
          }
          
          return Promise.all([
            fallbackCount.count('* as total').first(),
            fallbackQuery
              .orderBy('blogs.created_at', 'desc')
              .limit(limit)
              .offset(offset)
          ]);
        })
        .then(async ([countResult, blogs]) => {
          const total = parseInt(countResult.total) || 0;
          const totalPages = Math.ceil(total / limit);
          
          // Fetch categories for each blog
          const blogsWithCategories = await Promise.all(
            blogs.map(async (blog) => {
              try {
                const categories = await db('blog_categories')
                  .join('categories', 'blog_categories.category_id', 'categories.id')
                  .where('blog_categories.blog_id', blog.id)
                  .select('categories.*');
                
                return {
                  ...blog,
                  categories: categories || []
                };
              } catch (err) {
                console.error('Error fetching categories for blog:', blog.id, err);
                return {
                  ...blog,
                  categories: []
                };
              }
            })
          );
          
          res.json({
            blogs: blogsWithCategories,
            pagination: {
              currentPage: page,
              totalPages: totalPages,
              totalPosts: total,
              limit: limit,
              hasNextPage: page < totalPages,
              hasPrevPage: page > 1
            }
          });
        })
        .catch(err => {
          console.error('Error fetching all blogs:', err);
          console.error('Error details:', {
            message: err.message,
            code: err.code,
            detail: err.detail
          });
          res.status(500).json({ 
            error: 'Unable to get all blogs',
            details: err.message 
          });
        });
    })


app.post('/getposts', (req,res) => {
  const { name, id } = req.body;
  console.log('=== GETPOSTS REQUEST ===');
  console.log('Request body:', { name, id });
  
  db.transaction(trx => {
    // Get all posts (including drafts) for the user
    return trx.select('*').from('blogs').where('user_id', id).orderBy('created_at', 'desc')
      .then(posts => {
        console.log('✅ User posts fetched:', posts.length, 'posts');
        res.json(posts);
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
  .catch(err => {
    console.log('❌ Error fetching user posts:', err);
    res.status(400).json('unable to show old blog')
  })
})

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
           return  res.json(user);
        } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

// Get all posts by a specific user
app.get('/user-posts/:userId', (req, res) => {
  const { userId } = req.params;
  
  db.select('*')
    .from('blogs')
    .where('user_id', userId)
    .orderBy('created_at', 'desc')
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      console.error('Error fetching user posts:', err);
      res.status(500).json({ error: 'Failed to fetch user posts' });
    });
})

app.get("/search", (req, res) => {
  let searchTerm = req.query.q;
  
  // Sanitize search term
  searchTerm = sanitize.sanitizeInput(searchTerm);
  
  console.log('Searching for:', searchTerm);
  
  if (!searchTerm || searchTerm.trim() === '') {
    return res.status(400).json({ error: "Search term is required" });
  }
  
  // Search through blog posts for keywords in title and body
  // Only search published posts
  db.select("*")
    .from("blogs")
    .where("status", "published")
    .where(function() {
      this.where("posttitle", "ilike", `%${searchTerm}%`)
          .orWhere("postbody", "ilike", `%${searchTerm}%`)
          .orWhere("name", "ilike", `%${searchTerm}%`);
    })
    .orderBy("created_at", "desc")
    .then(results => {
      console.log(`Found ${results.length} blog posts matching "${searchTerm}"`);
      res.json(results);
    })
    .catch(err => {
      console.error('Search error:', err);
      res.status(500).json({ error: "Search failed" });
    });
});

app.get("/blogs", (req, res) => {
const { id } = req.query;
console.log(id);
db
.select("*")
.from("blogs")
.where({ id })
.then((rows) => {
console.log(rows[0].posttitle);
res.json(rows);
})
.catch((err) => {
console.error(err);
res.status(500).json({ error: "Failed to fetch blog posts" });
});
});

// Toggle like on a post (like if not liked, unlike if already liked)
app.post('/like/:postId', (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.body;
  
  console.log('=== LIKE TOGGLE ATTEMPT ===');
  console.log('Post ID:', postId);
  console.log('User ID:', user_id);
  
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  // Check if user has already liked this post
  db('likes')
    .where({ user_id: user_id, blog_id: postId })
    .first()
    .then(existingLike => {
      if (existingLike) {
        // Unlike: delete the like
        return db('likes')
          .where({ user_id: user_id, blog_id: postId })
          .del()
          .then(() => {
            console.log('✅ Post unliked');
            return { liked: false, action: 'unliked' };
          });
      } else {
        // Like: insert new like
        return db('likes')
          .insert({
            user_id: user_id,
            blog_id: postId
          })
          .then(() => {
            console.log('✅ Post liked');
            return { liked: true, action: 'liked' };
          });
      }
    })
    .then(result => {
      // Get updated like count
      return db('likes')
        .where({ blog_id: postId })
        .count('* as count')
        .first()
        .then(countResult => {
          res.json({
            ...result,
            likeCount: parseInt(countResult.count)
          });
        });
    })
    .catch(err => {
      console.error('Error toggling like:', err);
      res.status(400).json({ 
        error: 'Unable to toggle like', 
        details: err.message 
      });
    });
});

// Get like count and whether current user has liked a post
app.get('/likes/:postId', (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.query;
  
  Promise.all([
    // Get total like count
    db('likes')
      .where({ blog_id: postId })
      .count('* as count')
      .first(),
    // Check if current user has liked (if user_id provided)
    user_id ? db('likes')
      .where({ blog_id: postId, user_id: user_id })
      .first() : Promise.resolve(null)
  ])
    .then(([countResult, userLike]) => {
      res.json({
        likeCount: parseInt(countResult.count),
        isLiked: !!userLike
      });
    })
    .catch(err => {
      console.error('Error fetching likes:', err);
      res.status(500).json({ error: 'Failed to fetch likes' });
    });
});

// Get all posts liked by a user
app.get('/user-likes/:userId', (req, res) => {
  const { userId } = req.params;
  
  db('likes')
    .join('blogs', 'likes.blog_id', 'blogs.id')
    .where('likes.user_id', userId)
    .select('blogs.*')
    .orderBy('likes.created_at', 'desc')
    .then(likedPosts => {
      res.json(likedPosts);
    })
    .catch(err => {
      console.error('Error fetching user likes:', err);
      res.status(500).json({ error: 'Failed to fetch liked posts' });
    });
});

// Create a new comment
app.post('/comment', (req, res) => {
  let { blog_id, user_id, user_name, comment_text } = req.body;
  
  // Sanitize input
  user_name = sanitize.sanitizeInput(user_name);
  comment_text = sanitize.sanitizeText(comment_text); // Use sanitizeText for comments
  
  console.log('=== COMMENT CREATION ATTEMPT ===');
  console.log('Blog ID:', blog_id, 'User ID:', user_id);
  
  // Validate required fields
  if (!blog_id || !user_id || !user_name || !comment_text || !comment_text.trim()) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: { blog_id: !!blog_id, user_id: !!user_id, user_name: !!user_name, comment_text: !!comment_text }
    });
  }
  
  if (comment_text.trim().length < 1) {
    return res.status(400).json({ error: 'Comment cannot be empty' });
  }
  
  if (comment_text.trim().length > 1000) {
    return res.status(400).json({ error: 'Comment cannot exceed 1000 characters' });
  }
  
  db('comments')
    .insert({
      blog_id: blog_id,
      user_id: user_id,
      user_name: user_name,
      comment_text: comment_text.trim()
    })
    .returning('*')
    .then(result => {
      console.log('✅ Comment created successfully:', result[0]);
      res.json(result[0]);
    })
    .catch(err => {
      console.error('Error creating comment:', err);
      res.status(400).json({ 
        error: 'Unable to create comment', 
        details: err.message 
      });
    });
});

// Get all comments for a post
app.get('/comments/:postId', (req, res) => {
  const { postId } = req.params;
  
  db('comments')
    .where({ blog_id: postId })
    .orderBy('created_at', 'asc')
    .then(comments => {
      res.json(comments);
    })
    .catch(err => {
      console.error('Error fetching comments:', err);
      res.status(500).json({ error: 'Failed to fetch comments' });
    });
});

// Delete a comment
app.delete('/comment/:id', (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;
  
  console.log('=== COMMENT DELETE ATTEMPT ===');
  console.log('Comment ID:', id, 'User ID:', user_id);
  
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  // First verify the comment exists and belongs to the user
  db('comments')
    .where({ id: id, user_id: user_id })
    .first()
    .then(comment => {
      if (!comment) {
        throw new Error('Comment not found or you do not have permission to delete it');
      }
      
      // Delete the comment
      return db('comments')
        .where({ id: id, user_id: user_id })
        .del()
        .then(deletedCount => {
          if (deletedCount === 0) {
            throw new Error('Failed to delete comment');
          }
          console.log('✅ Comment deleted successfully');
          return { success: true, id: id };
        });
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error('Error deleting comment:', err);
      res.status(400).json({ 
        error: err.message || 'Unable to delete comment', 
        details: err.message 
      });
    });
});

// Get comment count for a post
app.get('/comments/:postId/count', (req, res) => {
  const { postId } = req.params;
  
  db('comments')
    .where({ blog_id: postId })
    .count('* as count')
    .first()
    .then(result => {
      res.json({ commentCount: parseInt(result.count) });
    })
    .catch(err => {
      console.error('Error fetching comment count:', err);
      res.status(500).json({ error: 'Failed to fetch comment count' });
    });
});

// Get all categories (all public categories are visible to everyone)
app.get('/categories', (req, res) => {
  // Show all public categories to everyone (custom categories are public by default)
  db('categories')
    .where('is_public', true)
    .select('*')
    .orderBy('name', 'asc')
    .then(categories => {
      res.json(categories || []);
    })
    .catch(err => {
      console.error('Error fetching categories:', err);
      // Return empty array instead of error if table doesn't exist
      if (err.message && err.message.includes('does not exist')) {
        res.json([]);
      } else {
        res.status(500).json({ error: 'Failed to fetch categories' });
      }
    });
});

// Create a custom category (public by default so all users can see it)
app.post('/categories', (req, res) => {
  const { name, color, user_id, is_public = true } = req.body;
  
  // Validate input
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  // Generate slug from name
  const slug = name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Check if category with same name already exists (globally, since they're public)
  db('categories')
    .where({ name: name.trim() })
    .first()
    .then(existing => {
      if (existing) {
        return res.status(400).json({ error: 'A category with this name already exists' });
      }
      
      // Check if slug already exists (must be unique)
      return db('categories')
        .where({ slug: slug })
        .first()
        .then(slugExisting => {
          if (slugExisting) {
            return res.status(400).json({ error: 'A category with a similar name already exists' });
          }
          
          // Create the category (public so all users can see and use it)
          return db('categories')
            .insert({
              name: name.trim(),
              slug: slug,
              color: color || '#6a6a6a',
              user_id: user_id,
              is_public: true // Always public so community can use it
            })
            .returning('*')
            .then(result => {
              res.json(result[0]);
            });
        });
    })
    .catch(err => {
      console.error('Error creating category:', err);
      res.status(500).json({ error: 'Failed to create category' });
    });
});

// Get categories for a specific blog post
app.get('/blogs/:postId/categories', (req, res) => {
  const { postId } = req.params;
  
  db('blog_categories')
    .join('categories', 'blog_categories.category_id', 'categories.id')
    .where('blog_categories.blog_id', postId)
    .select('categories.*')
    .then(categories => {
      res.json(categories);
    })
    .catch(err => {
      console.error('Error fetching blog categories:', err);
      res.status(500).json({ error: 'Failed to fetch blog categories' });
    });
});

// Get user's category preference
app.get('/user-preference/:userId', (req, res) => {
  const { userId } = req.params;
  
  db('users')
    .where({ id: userId })
    .select('preferred_category_id')
    .first()
    .then(user => {
      if (user) {
        res.json({ preferred_category_id: user.preferred_category_id });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(err => {
      console.error('Error fetching user preference:', err);
      res.status(500).json({ error: 'Failed to fetch user preference' });
    });
});

// Update user's category preference
app.put('/user-preference/:userId', (req, res) => {
  const { userId } = req.params;
  const { preferred_category_id } = req.body;
  
  // Validate userId exists
  db('users')
    .where({ id: userId })
    .first()
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // If category_id provided, validate it exists
      if (preferred_category_id !== null && preferred_category_id !== undefined) {
        return db('categories')
          .where({ id: preferred_category_id })
          .first()
          .then(category => {
            if (!category) {
              return res.status(400).json({ error: 'Category not found' });
            }
            
            // Update user preference
            return db('users')
              .where({ id: userId })
              .update({ preferred_category_id: preferred_category_id })
              .then(() => {
                res.json({ 
                  success: true, 
                  preferred_category_id: preferred_category_id 
                });
              });
          });
      } else {
        // Clear preference (set to null)
        return db('users')
          .where({ id: userId })
          .update({ preferred_category_id: null })
          .then(() => {
            res.json({ 
              success: true, 
              preferred_category_id: null 
            });
          });
      }
    })
    .catch(err => {
      console.error('Error updating user preference:', err);
      res.status(500).json({ error: 'Failed to update user preference' });
    });
});

// Image upload endpoint for blog posts
app.post('/upload-image', uploadImage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  
  // Return the URL to access the uploaded image
  const imageUrl = `/uploads/images/${req.file.filename}`;
  res.json({
    success: true,
    url: imageUrl,
    filename: req.file.filename
  });
});

// Avatar upload endpoint
app.post('/upload-avatar', uploadAvatar.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No avatar file provided' });
  }
  
  const { user_id } = req.body;
  
  if (!user_id) {
    // Delete the uploaded file if no user_id
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  
  // Update user's avatar in database
  db('users')
    .where({ id: user_id })
    .update({ avatar_url: avatarUrl })
    .then(() => {
      res.json({
        success: true,
        url: avatarUrl,
        filename: req.file.filename
      });
    })
    .catch(err => {
      console.error('Error updating avatar:', err);
      // Delete the uploaded file on error
      fs.unlinkSync(req.file.path);
      res.status(500).json({ error: 'Failed to update avatar' });
    });
});

// Get user avatar
app.get('/avatar/:userId', (req, res) => {
  const { userId } = req.params;
  
  db('users')
    .where({ id: userId })
    .select('*')
    .first()
    .then(user => {
      if (user) {
        // Check if avatar_url column exists, if not return null
        const avatarUrl = user.avatar_url || null;
        res.json({ avatar_url: avatarUrl });
      } else {
        res.json({ avatar_url: null });
      }
    })
    .catch(err => {
      console.error('Error fetching avatar:', err);
      // If column doesn't exist, just return null instead of error
      if (err.message && err.message.includes('column') && err.message.includes('does not exist')) {
        res.json({ avatar_url: null });
      } else {
        res.status(500).json({ error: 'Failed to fetch avatar' });
      }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> {
    console.log(`app is running on port ${PORT}`)
})