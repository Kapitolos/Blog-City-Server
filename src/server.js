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
    const { postbody, name, posttitle, id } = req.body;
    
    console.log('=== BLOG POST CREATION ATTEMPT ===');
    console.log('Request body:', { postbody: postbody?.substring(0, 50) + '...', name, posttitle, id });
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
        console.log('✅ Blog post created successfully:', result[0]);
        res.json(result[0]);
      })
      .then(trx.commit)
      .catch(err => {
        console.log('❌ Transaction error:', err);
        trx.rollback();
        throw err;
      })
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

    app.post('/allblogs', (req,res) => {
      db.transaction(trx => {
        return trx.returning('*').from('blogs')
        .then(user => {
          res.json(user)
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
        .catch(err => res.status(400).json('unable to get allblogs'))
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

app.listen(3001, ()=> {
    console.log('app is running on port 3001')
})