const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Redwings!',
        database: 'Blog',
        port: 3002
    }
})




const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(cors());


app.get('/', (req, res)=> {
    res.send(db.users);
})


app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  
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
  const { email, name, password } = req.body;
  
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
    const { postbody, name, posttitle, id, category_ids } = req.body;
    
    console.log('=== BLOG POST CREATION ATTEMPT ===');
    console.log('Request body:', { postbody: postbody?.substring(0, 50) + '...', name, posttitle, id, category_ids });
    console.log('User ID type:', typeof id, 'Value:', id);
    
    // Validate required fields
    if (!postbody || !posttitle || !name || !id) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields', 
        details: { postbody: !!postbody, posttitle: !!posttitle, name: !!name, id: !!id }
      });
    }
    
    db.transaction(trx => {
      return trx('blogs')
      .returning('*')
      .insert({
        postbody: postbody,
        posttitle: posttitle,
        name: name,
        user_id: id
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
    const { postbody, posttitle, user_id } = req.body;
    
    console.log('=== BLOG POST UPDATE ATTEMPT ===');
    console.log('Post ID:', id);
    console.log('Request body:', { postbody: postbody?.substring(0, 50) + '...', posttitle, user_id });
    
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
          
          // Update the post
          return trx('blogs')
            .where({ id: id, user_id: user_id })
            .update({
              postbody: postbody.trim(),
              posttitle: posttitle.trim()
            })
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
      
      // Build query with optional category filter
      let blogsQuery = db('blogs');
      let countQuery = db('blogs');
      
      if (category_id) {
        blogsQuery = blogsQuery
          .join('blog_categories', 'blogs.id', 'blog_categories.blog_id')
          .where('blog_categories.category_id', category_id)
          .select('blogs.*')
          .distinct();
        countQuery = countQuery
          .join('blog_categories', 'blogs.id', 'blog_categories.blog_id')
          .where('blog_categories.category_id', category_id);
      }
      
      // Get total count and paginated results
      Promise.all([
        countQuery.count('* as total').first(),
        blogsQuery
          .orderBy('blogs.created_at', 'desc')
          .limit(limit)
          .offset(offset)
      ])
        .then(async ([countResult, blogs]) => {
          const total = parseInt(countResult.total);
          const totalPages = Math.ceil(total / limit);
          
          // Fetch categories for each blog
          const blogsWithCategories = await Promise.all(
            blogs.map(async (blog) => {
              const categories = await db('blog_categories')
                .join('categories', 'blog_categories.category_id', 'categories.id')
                .where('blog_categories.blog_id', blog.id)
                .select('categories.*');
              
              return {
                ...blog,
                categories: categories || []
              };
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
          res.status(400).json({ error: 'Unable to get all blogs' });
        });
    })


app.post('/getposts', (req,res) => {
  const { name, id } = req.body;
  console.log('=== GETPOSTS REQUEST ===');
  console.log('Request body:', { name, id });
  
  db.transaction(trx => {
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
  const searchTerm = req.query.q;
  console.log('Searching for:', searchTerm);
  
  if (!searchTerm || searchTerm.trim() === '') {
    return res.status(400).json({ error: "Search term is required" });
  }
  
  // Search through blog posts for keywords in title and body
  db.select("*")
    .from("blogs")
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
  const { blog_id, user_id, user_name, comment_text } = req.body;
  
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

// Get all categories
app.get('/categories', (req, res) => {
  db('categories')
    .select('*')
    .orderBy('name', 'asc')
    .then(categories => {
      res.json(categories);
    })
    .catch(err => {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Failed to fetch categories' });
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

app.listen(3001, ()=> {
    console.log('app is running on port 3001')
})