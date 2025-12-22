// =====================================================
// Populate Sample Data: Fake Users and Blog Posts
// =====================================================
// This script creates multiple fake users and blog posts
// for testing and demonstration purposes.
//
// Run with: node populate-sample-data.js
// =====================================================

require('dotenv').config();
const bcrypt = require('bcrypt');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Redwings!',
    database: process.env.DB_NAME || 'Blog',
    port: process.env.DB_PORT || 3002
  }
});

const users = [
  { name: 'Alex Chen', email: 'alex.chen@example.com', password: 'alex123' },
  { name: 'Sarah Johnson', email: 'sarah.j@example.com', password: 'sarah123' },
  { name: 'Mike Rodriguez', email: 'mike.r@example.com', password: 'mike123' },
  { name: 'Emma Williams', email: 'emma.w@example.com', password: 'emma123' },
  { name: 'David Kim', email: 'david.kim@example.com', password: 'david123' }
];

const posts = [
  {
    title: "Building My First React App",
    body: "I've been learning React for the past few weeks and finally built my first real application! It's a todo list app with local storage. The component structure was tricky at first, but once I understood props and state, everything clicked. Next, I want to add Redux for state management.",
    userEmail: 'alex.chen@example.com',
    categories: ['programming', 'tutorial'],
    daysAgo: 5
  },
  {
    title: "JavaScript Closures Explained",
    body: "Closures are one of those JavaScript concepts that seemed mysterious until I really dug into them. A closure gives you access to an outer function's scope from an inner function. This is incredibly powerful for creating private variables and function factories. Here's a simple example that helped me understand: when you return a function from another function, the inner function remembers the variables from the outer function's scope, even after the outer function has finished executing.",
    userEmail: 'alex.chen@example.com',
    categories: ['programming', 'tutorial'],
    daysAgo: 3
  },
  {
    title: "My Journey into Web Design",
    body: "I've always loved art, but I never thought I could combine it with technology. Learning CSS and design principles has been eye-opening. The way colors, spacing, and typography work together to create beautiful interfaces is fascinating. I'm currently working on redesigning my portfolio site using modern CSS techniques like Grid and custom properties.",
    userEmail: 'sarah.j@example.com',
    categories: ['design', 'personal'],
    daysAgo: 7
  },
  {
    title: "CSS Grid: A Game Changer",
    body: "After years of struggling with floats and flexbox for complex layouts, CSS Grid feels like magic. Being able to define both rows and columns at once has simplified so many of my designs. The grid-template-areas property is particularly elegant for responsive layouts. I can't believe I waited so long to really dive into it!",
    userEmail: 'sarah.j@example.com',
    categories: ['design', 'tutorial'],
    daysAgo: 2
  },
  {
    title: "Minimalist Design Principles",
    body: "Less is more. This philosophy has transformed how I approach design. Every element should have a purpose. White space isn't empty space—it's breathing room for your content. I've been studying minimalist design and applying these principles to my recent projects. The results speak for themselves.",
    userEmail: 'sarah.j@example.com',
    categories: ['design', 'tutorial'],
    daysAgo: 1
  },
  {
    title: "Node.js Backend Development Tips",
    body: "I've been building REST APIs with Node.js and Express for a while now. Here are some lessons I've learned: always validate input, use middleware for common tasks, and don't forget error handling! Async/await makes the code so much cleaner than callbacks. Also, don't underestimate the importance of proper logging and monitoring.",
    userEmail: 'mike.r@example.com',
    categories: ['programming', 'technology', 'tutorial'],
    daysAgo: 6
  },
  {
    title: "Database Optimization Strategies",
    body: "Query performance matters, especially as your application scales. I've learned the importance of proper indexing, avoiding N+1 queries, and using database transactions correctly. PostgreSQL has become my go-to database for its powerful features and reliability. Understanding EXPLAIN ANALYZE has been a game-changer for debugging slow queries.",
    userEmail: 'mike.r@example.com',
    categories: ['programming', 'technology', 'tutorial'],
    daysAgo: 4
  },
  {
    title: "Learning to Code Changed My Life",
    body: "A year ago, I was working in a completely different field. I took a coding bootcamp on a whim, and it's been the best decision I've ever made. The problem-solving skills I've developed apply to so many areas of life. Coding isn't just about writing code—it's about thinking differently, breaking down complex problems, and building something from nothing.",
    userEmail: 'emma.w@example.com',
    categories: ['personal', 'lifestyle'],
    daysAgo: 8
  },
  {
    title: "Work-Life Balance as a Developer",
    body: "Finding balance between coding projects, learning new technologies, and having a life outside of work is challenging. I've learned to set boundaries, take breaks, and not feel guilty about stepping away from the computer. Burnout is real, and prevention is key. Remember: you're more productive when you're well-rested.",
    userEmail: 'emma.w@example.com',
    categories: ['personal', 'lifestyle'],
    daysAgo: 1
  },
  {
    title: "TypeScript: Why I Made the Switch",
    body: "I resisted TypeScript for a long time, thinking it was just extra complexity. But after trying it on a project, I'm converted. The type safety catches so many bugs before runtime, and the IDE autocomplete is incredible. The learning curve is worth it. Plus, refactoring is so much safer with types.",
    userEmail: 'david.kim@example.com',
    categories: ['programming', 'technology'],
    daysAgo: 9
  },
  {
    title: "Building a Full-Stack Application",
    body: "I just finished my first full-stack project: a blog platform with React frontend and Node.js backend. The biggest challenge was managing state across the application and handling authentication. JWT tokens made the auth flow much cleaner than I expected. Deploying to production was another learning experience entirely!",
    userEmail: 'david.kim@example.com',
    categories: ['programming', 'technology', 'tutorial'],
    daysAgo: 2
  },
  {
    title: "API Design Best Practices",
    body: "Good API design is crucial for maintainability. RESTful principles, consistent naming, proper HTTP status codes, and clear error messages make all the difference. I've been refactoring an old API and applying these principles, and the improvement is noticeable. Documentation is just as important as the code itself.",
    userEmail: 'david.kim@example.com',
    categories: ['programming', 'technology', 'tutorial'],
    daysAgo: 0.5
  }
];

const comments = [
  { postTitle: "Building My First React App", userEmail: 'sarah.j@example.com', text: "Great post! I'm also learning React. Any tips for managing state?", daysAgo: 4 },
  { postTitle: "CSS Grid: A Game Changer", userEmail: 'alex.chen@example.com', text: "Grid is amazing! Have you tried using it with CSS variables?", daysAgo: 1 },
  { postTitle: "Node.js Backend Development Tips", userEmail: 'david.kim@example.com', text: "Excellent points about error handling. Middleware is definitely key.", daysAgo: 5 },
  { postTitle: "Learning to Code Changed My Life", userEmail: 'mike.r@example.com', text: "This resonates so much! Coding has opened so many doors for me too.", daysAgo: 7 },
  { postTitle: "TypeScript: Why I Made the Switch", userEmail: 'emma.w@example.com', text: "I was skeptical too, but TypeScript has saved me countless hours of debugging.", daysAgo: 8 }
];

const likes = [
  { userEmail: 'alex.chen@example.com', postTitles: ['CSS Grid: A Game Changer', 'TypeScript: Why I Made the Switch'] },
  { userEmail: 'sarah.j@example.com', postTitles: ['Building My First React App', 'Learning to Code Changed My Life'] },
  { userEmail: 'mike.r@example.com', postTitles: ['Database Optimization Strategies', 'API Design Best Practices'] },
  { userEmail: 'emma.w@example.com', postTitles: ['My Journey into Web Design', 'Work-Life Balance as a Developer'] },
  { userEmail: 'david.kim@example.com', postTitles: ['JavaScript Closures Explained', 'Node.js Backend Development Tips'] }
];

async function populateData() {
  try {
    console.log('🚀 Starting data population...\n');

    // Create users
    console.log('Creating users...');
    const userIds = {};
    for (const user of users) {
      // Check if user exists
      const existing = await db('users').where('email', user.email).first();
      
      if (existing) {
        console.log(`  ✓ User ${user.name} already exists`);
        userIds[user.email] = existing.id;
      } else {
        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        // Insert into users
        const userRecords = await db('users')
          .insert({
            name: user.name,
            email: user.email,
            password: hashedPassword,
            joined: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
          })
          .returning('id');
        
        const userId = userRecords[0].id;
        userIds[user.email] = userId;
        
        // Insert into login
        await db('login')
          .insert({
            email: user.email,
            password: hashedPassword,
            name: user.name
          })
          .onConflict('email')
          .ignore();
        
        console.log(`  ✓ Created user: ${user.name} (${user.email}) - ID: ${userId}`);
      }
    }
    
    console.log(`\n  User IDs mapping:`, userIds);

    // Get category IDs
    console.log('\nFetching categories...');
    const categories = await db('categories').select('id', 'slug');
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });
    console.log(`  ✓ Found ${categories.length} categories`);

    // Create blog posts
    console.log('\nCreating blog posts...');
    const postIds = {};
    for (const post of posts) {
      const userId = userIds[post.userEmail];
      if (!userId) {
        console.log(`  ✗ Skipping post "${post.title}" - user not found`);
        continue;
      }

      // Check if post exists
      const existing = await db('blogs')
        .where('posttitle', post.title)
        .where('user_id', userId)
        .first();

      if (existing) {
        console.log(`  ✓ Post "${post.title}" already exists`);
        postIds[post.title] = existing.id;
        // Ensure categories are linked even if post exists
        const blogId = existing.id;
        let categoryCount = 0;
        for (const categorySlug of post.categories) {
          const categoryId = categoryMap[categorySlug];
          if (categoryId && blogId) {
            await db('blog_categories')
              .insert({
                blog_id: blogId,
                category_id: categoryId
              })
              .onConflict(['blog_id', 'category_id'])
              .ignore();
            categoryCount++;
          }
        }
        if (categoryCount > 0) {
          console.log(`    → Linked ${categoryCount} categories`);
        }
      } else {
        const createdDate = new Date(Date.now() - post.daysAgo * 24 * 60 * 60 * 1000);
        
        const blogRecords = await db('blogs')
          .insert({
            posttitle: post.title,
            postbody: post.body,
            name: users.find(u => u.email === post.userEmail).name,
            user_id: userId,
            status: 'published',
            created_at: createdDate
          })
          .returning('id');
        
        const blogId = Array.isArray(blogRecords) ? blogRecords[0].id : blogRecords.id;
        postIds[post.title] = blogId;
        console.log(`  ✓ Created post: "${post.title}" (ID: ${blogId})`);

        // Link to categories
        let categoryCount = 0;
        for (const categorySlug of post.categories) {
          const categoryId = categoryMap[categorySlug];
          if (categoryId && blogId) {
            await db('blog_categories')
              .insert({
                blog_id: blogId,
                category_id: categoryId
              })
              .onConflict(['blog_id', 'category_id'])
              .ignore();
            categoryCount++;
          }
        }
        if (categoryCount > 0) {
          console.log(`    → Linked ${categoryCount} categories`);
        }
      }
    }

    // Add likes
    console.log('\nAdding likes...');
    let likeCount = 0;
    for (const like of likes) {
      const userId = userIds[like.userEmail];
      if (!userId) continue;

      for (const postTitle of like.postTitles) {
        const postId = postIds[postTitle];
        if (postId) {
          await db('likes')
            .insert({
              user_id: userId,
              blog_id: postId
            })
            .onConflict(['user_id', 'blog_id'])
            .ignore();
          likeCount++;
        }
      }
    }
    console.log(`  ✓ Added ${likeCount} likes`);

    // Add comments
    console.log('\nAdding comments...');
    let commentCount = 0;
    for (const comment of comments) {
      const userId = userIds[comment.userEmail];
      const postId = postIds[comment.postTitle];
      
      if (userId && postId) {
        const user = users.find(u => u.email === comment.userEmail);
        const commentDate = new Date(Date.now() - comment.daysAgo * 24 * 60 * 60 * 1000);
        
        await db('comments')
          .insert({
            blog_id: postId,
            user_id: userId,
            user_name: user.name,
            comment_text: comment.text,
            created_at: commentDate
          })
          .onConflict()
          .ignore();
        commentCount++;
      }
    }
    console.log(`  ✓ Added ${commentCount} comments`);

    console.log('\n✅ Data population complete!');
    console.log('\nYou can now sign in with any of these accounts:');
    users.forEach(user => {
      console.log(`  - ${user.email} / ${user.password}`);
    });

  } catch (error) {
    console.error('❌ Error populating data:', error);
  } finally {
    await db.destroy();
  }
}

populateData();

