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
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'Blog',
    port: process.env.DB_PORT || 3002
  }
});

const users = [
  { name: 'Alex Chen', email: 'alex.chen@example.com', password: 'alex123' },
  { name: 'Sarah Johnson', email: 'sarah.j@example.com', password: 'sarah123' },
  { name: 'Mike Rodriguez', email: 'mike.r@example.com', password: 'mike123' },
  { name: 'Emma Williams', email: 'emma.w@example.com', password: 'emma123' },
  { name: 'David Kim', email: 'david.kim@example.com', password: 'david123' },
  { name: 'Jordan Taylor', email: 'jordan.t@example.com', password: 'jordan123' },
  { name: 'Maya Patel', email: 'maya.p@example.com', password: 'maya123' },
  { name: 'Chris Anderson', email: 'chris.a@example.com', password: 'chris123' },
  { name: 'Riley Martinez', email: 'riley.m@example.com', password: 'riley123' },
  { name: 'Sam Thompson', email: 'sam.t@example.com', password: 'sam123' },
  { name: 'Taylor Brown', email: 'taylor.b@example.com', password: 'taylor123' },
  { name: 'Casey Lee', email: 'casey.l@example.com', password: 'casey123' },
  { name: 'Morgan White', email: 'morgan.w@example.com', password: 'morgan123' },
  { name: 'Jamie Garcia', email: 'jamie.g@example.com', password: 'jamie123' },
  { name: 'Quinn Davis', email: 'quinn.d@example.com', password: 'quinn123' },
  { name: 'Avery Wilson', email: 'avery.w@example.com', password: 'avery123' },
  { name: 'Blake Moore', email: 'blake.m@example.com', password: 'blake123' },
  { name: 'Cameron Jackson', email: 'cameron.j@example.com', password: 'cameron123' },
  { name: 'Dakota Harris', email: 'dakota.h@example.com', password: 'dakota123' },
  { name: 'Skylar Clark', email: 'skylar.c@example.com', password: 'skylar123' }
];

const posts = [
  // Original posts
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
  },
  // Technology & AI Posts
  {
    title: "The Future of AI in Software Development",
    body: "AI coding assistants are becoming increasingly sophisticated. I've been using GitHub Copilot and ChatGPT for code generation, and while they're not perfect, they've significantly sped up my development process. The key is knowing when to trust the AI and when to review carefully. It's like having a junior developer who never gets tired, but you still need to review their work.",
    userEmail: 'jordan.t@example.com',
    categories: ['technology', 'news'],
    daysAgo: 12
  },
  {
    title: "Understanding Machine Learning Basics",
    body: "I've been diving into machine learning recently, starting with supervised learning. The concept of training a model on data to make predictions is fascinating. I started with linear regression and worked my way up to neural networks. The math can be intimidating, but there are great libraries like TensorFlow and scikit-learn that abstract away the complexity. It's amazing what you can build with just a few lines of Python.",
    userEmail: 'maya.p@example.com',
    categories: ['technology', 'tutorial'],
    daysAgo: 15
  },
  {
    title: "Cloud Computing: AWS vs Azure vs GCP",
    body: "Choosing a cloud provider is a big decision. I've worked with all three major platforms, and each has its strengths. AWS has the most services and market share. Azure integrates well with Microsoft ecosystems. GCP has excellent machine learning tools. For most projects, you can't go wrong with any of them, but understanding their differences helps you make informed decisions.",
    userEmail: 'chris.a@example.com',
    categories: ['technology', 'tutorial'],
    daysAgo: 10
  },
  {
    title: "Cybersecurity Best Practices for Developers",
    body: "Security should be built into your development process from day one. Always hash passwords, use HTTPS, validate and sanitize input, and keep dependencies updated. I've seen too many projects compromised because of simple oversights. OWASP Top 10 is a great resource for understanding common vulnerabilities. Remember: security isn't a feature you add at the end—it's a mindset.",
    userEmail: 'riley.m@example.com',
    categories: ['technology', 'tutorial'],
    daysAgo: 8
  },
  {
    title: "The Rise of Quantum Computing",
    body: "Quantum computing is moving from theory to reality. While we're still years away from quantum computers replacing classical ones, the progress is exciting. Companies like IBM and Google are making quantum computing accessible through cloud platforms. I've been experimenting with Qiskit, and while the concepts are mind-bending, the potential applications in cryptography, drug discovery, and optimization are incredible.",
    userEmail: 'sam.t@example.com',
    categories: ['technology', 'news'],
    daysAgo: 20
  },
  // Programming Languages & Frameworks
  {
    title: "Python vs JavaScript: Which Should You Learn?",
    body: "Both Python and JavaScript are excellent first languages, but they serve different purposes. Python is fantastic for data science, automation, and backend development. JavaScript is essential for web development and has become powerful with Node.js. My advice? Learn both! They complement each other well, and understanding multiple languages makes you a better programmer overall.",
    userEmail: 'taylor.b@example.com',
    categories: ['programming', 'tutorial'],
    daysAgo: 11
  },
  {
    title: "Getting Started with Rust",
    body: "Rust has been gaining popularity for its memory safety and performance. I've been learning it for the past month, and while the learning curve is steep, the compiler's error messages are incredibly helpful. The ownership system is unique and prevents entire classes of bugs. If you're interested in systems programming or want to write high-performance code, Rust is worth the investment.",
    userEmail: 'casey.l@example.com',
    categories: ['programming', 'tutorial'],
    daysAgo: 13
  },
  {
    title: "Vue.js vs React: My Experience",
    body: "I've built projects in both Vue and React, and they're both excellent frameworks. React has a larger ecosystem and more job opportunities. Vue has a gentler learning curve and feels more intuitive. React's JSX is powerful, but Vue's template syntax is easier for designers to understand. For new projects, I'd choose based on your team's experience and the project requirements.",
    userEmail: 'morgan.w@example.com',
    categories: ['programming', 'technology'],
    daysAgo: 7
  },
  {
    title: "Go: The Language for Modern Backends",
    body: "Go (Golang) has become my go-to language for backend services. It's simple, fast, and has excellent concurrency support with goroutines. The standard library is comprehensive, and the tooling is great. I've rewritten several Node.js services in Go, and the performance improvement is significant. If you're building microservices or APIs that need to handle high concurrency, give Go a try.",
    userEmail: 'jamie.g@example.com',
    categories: ['programming', 'technology', 'tutorial'],
    daysAgo: 9
  },
  {
    title: "Docker and Containerization Explained",
    body: "Docker has revolutionized how we deploy applications. Containers package your app with all its dependencies, making it run consistently across different environments. I use Docker for local development, CI/CD pipelines, and production deployments. Docker Compose makes it easy to orchestrate multiple containers. Once you understand containers, you'll wonder how you ever developed without them.",
    userEmail: 'quinn.d@example.com',
    categories: ['programming', 'technology', 'tutorial'],
    daysAgo: 6
  },
  {
    title: "GraphQL: A Better Alternative to REST?",
    body: "GraphQL solves many problems with REST APIs. Clients can request exactly the data they need, reducing over-fetching and under-fetching. The single endpoint simplifies API design. However, it's not always the right choice—REST is still simpler for many use cases. I've been using GraphQL with Apollo Server, and the developer experience is excellent. Consider GraphQL for complex applications with diverse client needs.",
    userEmail: 'avery.w@example.com',
    categories: ['programming', 'technology', 'tutorial'],
    daysAgo: 14
  },
  {
    title: "Microservices Architecture: Pros and Cons",
    body: "Microservices can improve scalability and team autonomy, but they add complexity. You need service discovery, API gateways, distributed tracing, and more. I've seen projects over-engineer with microservices when a monolith would suffice. Start with a monolith, and extract services when you have clear boundaries. Don't let architecture astronauts convince you to overcomplicate things.",
    userEmail: 'blake.m@example.com',
    categories: ['programming', 'technology'],
    daysAgo: 16
  },
  // Design Posts
  {
    title: "Color Theory for Web Designers",
    body: "Understanding color theory transforms your designs. Complementary colors create contrast, analogous colors create harmony. I use tools like Coolors and Adobe Color to generate palettes. Accessibility is crucial—ensure sufficient contrast ratios for text. Don't forget that color perception varies, so always test with colorblind simulators. A well-chosen color palette can make or break a design.",
    userEmail: 'cameron.j@example.com',
    categories: ['design', 'tutorial'],
    daysAgo: 4
  },
  {
    title: "Typography: The Foundation of Good Design",
    body: "Typography is often overlooked, but it's fundamental to good design. Font choice, size, line height, and letter spacing all affect readability and aesthetics. I stick to 2-3 font families max per project. System fonts load instantly, while web fonts add personality. Pair a serif with a sans-serif for contrast. Remember: typography should be invisible—if users notice the font, something's wrong.",
    userEmail: 'dakota.h@example.com',
    categories: ['design', 'tutorial'],
    daysAgo: 5
  },
  {
    title: "Mobile-First Design Approach",
    body: "Designing mobile-first forces you to prioritize what matters. Start with the smallest screen, then enhance for larger devices. This approach results in faster, more focused designs. Touch targets should be at least 44x44 pixels. Navigation patterns differ on mobile—hamburger menus, bottom navigation, and swipe gestures are common. Test on real devices, not just browser dev tools.",
    userEmail: 'skylar.c@example.com',
    categories: ['design', 'tutorial'],
    daysAgo: 3
  },
  {
    title: "Accessibility in Web Design",
    body: "Accessible design benefits everyone. Use semantic HTML, provide alt text for images, ensure keyboard navigation works, and maintain proper heading hierarchy. ARIA labels help screen readers. Color shouldn't be the only way to convey information. Test with screen readers and keyboard-only navigation. Following WCAG guidelines isn't just the right thing to do—it's often required by law.",
    userEmail: 'sarah.j@example.com',
    categories: ['design', 'tutorial'],
    daysAgo: 18
  },
  {
    title: "Dark Mode: Design Considerations",
    body: "Dark mode is more than just inverting colors. You need to adjust contrast, saturation, and brightness. Pure black backgrounds can cause eye strain—use dark grays instead. Accent colors need to work in both light and dark themes. I use CSS custom properties to make theme switching easy. Always provide a toggle—don't force users into one mode.",
    userEmail: 'jordan.t@example.com',
    categories: ['design', 'technology'],
    daysAgo: 2
  },
  // Lifestyle & Personal Posts
  {
    title: "My Morning Routine for Productivity",
    body: "I've refined my morning routine over the past year, and it's transformed my productivity. I wake up at 6 AM, meditate for 10 minutes, exercise for 30 minutes, then have a healthy breakfast. No phone until after breakfast—this prevents me from getting sucked into social media. I tackle my most important work in the morning when my energy is highest. Small changes, big impact.",
    userEmail: 'emma.w@example.com',
    categories: ['lifestyle', 'personal'],
    daysAgo: 19
  },
  {
    title: "Remote Work: Tips for Staying Focused",
    body: "Working from home has its challenges. I've learned to create a dedicated workspace, set boundaries with family, and maintain a routine. Taking breaks is crucial—I use the Pomodoro Technique. Video calls can be draining, so I batch them. Exercise and fresh air help maintain energy. Most importantly, I log off at the end of the day. Work-life balance is harder when your office is in your home.",
    userEmail: 'maya.p@example.com',
    categories: ['lifestyle', 'personal'],
    daysAgo: 17
  },
  {
    title: "Learning a New Language While Coding",
    body: "I've been learning Spanish using Duolingo and language exchange apps. It's similar to learning programming—consistency matters more than intensity. I practice for 20 minutes daily rather than cramming on weekends. The key is making it a habit. I've found that learning languages improves my problem-solving skills and helps me think differently. Plus, it's opened up new opportunities for remote work.",
    userEmail: 'chris.a@example.com',
    categories: ['lifestyle', 'personal'],
    daysAgo: 21
  },
  {
    title: "My Experience with Digital Minimalism",
    body: "I read 'Digital Minimalism' by Cal Newport and decided to audit my technology use. I deleted social media apps from my phone, unsubscribed from unnecessary newsletters, and set app time limits. The result? I'm more focused, less anxious, and have more time for meaningful activities. I still use technology, but intentionally. It's about being in control of your tools, not letting them control you.",
    userEmail: 'riley.m@example.com',
    categories: ['lifestyle', 'personal'],
    daysAgo: 22
  },
  {
    title: "Cooking as a Form of Meditation",
    body: "Cooking has become my way to unwind after coding. There's something meditative about following a recipe, chopping vegetables, and creating something from scratch. I've been learning to cook different cuisines, and it's expanded my palate and my worldview. Plus, meal prepping saves time during the week. Cooking is like programming—you follow instructions, but creativity comes in the details.",
    userEmail: 'sam.t@example.com',
    categories: ['lifestyle', 'personal'],
    daysAgo: 23
  },
  {
    title: "Building a Home Gym on a Budget",
    body: "I've been working out at home for the past year, and you don't need expensive equipment. Resistance bands, a pull-up bar, and a yoga mat are enough for a great workout. Bodyweight exercises are incredibly effective. I follow YouTube workout videos and track my progress in a simple app. The convenience means I actually stick to my routine. No commute, no waiting for equipment, no excuses.",
    userEmail: 'taylor.b@example.com',
    categories: ['lifestyle', 'personal'],
    daysAgo: 24
  },
  // Tutorial & How-To Posts
  {
    title: "How to Set Up a CI/CD Pipeline",
    body: "Continuous Integration and Continuous Deployment automate testing and deployment. I use GitHub Actions for my projects—it's free for public repos and integrates seamlessly. The workflow: push code, run tests automatically, build the application, and deploy if tests pass. This catches bugs early and makes deployments less stressful. Start simple with just running tests, then add deployment steps gradually.",
    userEmail: 'casey.l@example.com',
    categories: ['tutorial', 'technology'],
    daysAgo: 25
  },
  {
    title: "Building Your First REST API",
    body: "Creating a REST API is a fundamental skill. I'll walk you through building one with Express.js. Start by defining your routes, then add middleware for parsing JSON and handling errors. Use environment variables for configuration. Implement proper HTTP status codes. Add validation to prevent bad data. Finally, document your API with Swagger or Postman. Test with tools like Postman or curl.",
    userEmail: 'morgan.w@example.com',
    categories: ['tutorial', 'programming'],
    daysAgo: 26
  },
  {
    title: "Git Workflow for Teams",
    body: "Good Git practices make collaboration smooth. Use feature branches, write clear commit messages, and keep commits focused. I follow the conventional commits format: 'feat:', 'fix:', 'docs:', etc. Before merging, rebase your branch to keep history clean. Code reviews are essential—they catch bugs and share knowledge. Use .gitignore properly. And please, don't commit secrets or node_modules!",
    userEmail: 'jamie.g@example.com',
    categories: ['tutorial', 'programming'],
    daysAgo: 27
  },
  {
    title: "Setting Up a Development Environment",
    body: "A good dev environment boosts productivity. I use VS Code with extensions like Prettier, ESLint, and GitLens. I configure my terminal with Oh My Zsh and use tmux for session management. Docker Compose sets up my local database and services. I use nvm for Node version management. Dotfiles in a Git repo let me set up new machines quickly. Invest time in your tools—they're your daily companions.",
    userEmail: 'quinn.d@example.com',
    categories: ['tutorial', 'programming'],
    daysAgo: 28
  },
  {
    title: "Testing Your Code: A Beginner's Guide",
    body: "Writing tests feels like extra work, but it saves time in the long run. Start with unit tests for individual functions. Use test-driven development (TDD) for new features. Integration tests verify components work together. I use Jest for JavaScript testing. Aim for good coverage, but don't obsess over 100%—focus on critical paths. Tests are documentation that never gets out of date.",
    userEmail: 'avery.w@example.com',
    categories: ['tutorial', 'programming'],
    daysAgo: 29
  },
  // News & Industry Posts
  {
    title: "Latest JavaScript Features in ES2024",
    body: "JavaScript continues to evolve. The latest features include better async iteration, improved error handling, and new array methods. Optional chaining and nullish coalescing have been game-changers. I'm excited about the pipeline operator proposal. Staying current with language features helps you write cleaner, more maintainable code. Follow TC39 proposals to see what's coming next.",
    userEmail: 'blake.m@example.com',
    categories: ['news', 'programming'],
    daysAgo: 30
  },
  {
    title: "The State of Web Development in 2024",
    body: "Web development is moving fast. React, Vue, and Svelte are all thriving. Server components are changing how we think about rendering. TypeScript adoption continues to grow. WebAssembly is enabling new possibilities. The tooling keeps getting better—Vite, Turborepo, and other tools make development faster. It's an exciting time to be a web developer, but also overwhelming. Focus on fundamentals, not every new framework.",
    userEmail: 'cameron.j@example.com',
    categories: ['news', 'technology'],
    daysAgo: 31
  },
  {
    title: "Open Source Contributions: Getting Started",
    body: "Contributing to open source is rewarding and educational. Start by finding projects you use regularly. Look for 'good first issue' labels. Read the contribution guidelines carefully. Make small, focused contributions. Write clear commit messages and pull request descriptions. Don't be discouraged by feedback—it's how you learn. Open source has given me so much, and contributing back feels great.",
    userEmail: 'dakota.h@example.com',
    categories: ['news', 'programming', 'personal'],
    daysAgo: 32
  },
  // More Diverse Topics
  {
    title: "Building a Personal Brand as a Developer",
    body: "Your online presence matters in tech. I maintain a blog, contribute to open source, and share knowledge on social media. Consistency is key—post regularly, even if it's just small tips. Help others in forums and communities. Speak at meetups or conferences if possible. Your personal brand is what people say about you when you're not in the room. Build it intentionally.",
    userEmail: 'skylar.c@example.com',
    categories: ['personal', 'lifestyle'],
    daysAgo: 33
  },
  {
    title: "The Psychology of Code Reviews",
    body: "Code reviews are about code, but they involve people. Be kind and constructive in feedback. Explain the 'why' behind suggestions. Ask questions rather than making demands. Receiving feedback is hard—separate your code from your identity. Remember, everyone makes mistakes. Good code reviews improve code quality and share knowledge. They're a learning opportunity, not a judgment.",
    userEmail: 'alex.chen@example.com',
    categories: ['programming', 'personal'],
    daysAgo: 34
  },
  {
    title: "Functional Programming Concepts",
    body: "Functional programming emphasizes immutability, pure functions, and avoiding side effects. While you don't need to write everything functionally, these concepts improve code quality. Map, filter, and reduce are powerful array methods. Pure functions are easier to test and reason about. I've been learning more functional patterns, and they've made my code more maintainable.",
    userEmail: 'david.kim@example.com',
    categories: ['programming', 'tutorial'],
    daysAgo: 35
  },
  {
    title: "The Art of Debugging",
    body: "Debugging is a skill that improves with practice. Start by reproducing the bug consistently. Use console.log strategically, or better yet, use a debugger. Read error messages carefully—they usually tell you what's wrong. Check your assumptions. Sometimes the bug is in code you didn't write (dependencies). Rubber duck debugging works—explaining the problem often reveals the solution.",
    userEmail: 'mike.r@example.com',
    categories: ['programming', 'tutorial'],
    daysAgo: 36
  },
  {
    title: "Building Accessible Forms",
    body: "Forms are everywhere, but many are poorly designed. Use proper labels, not placeholders. Group related fields with fieldset and legend. Provide clear error messages. Support keyboard navigation. Use appropriate input types (email, tel, etc.). Validate on both client and server. Test with screen readers. Accessible forms are better for everyone, not just users with disabilities.",
    userEmail: 'sarah.j@example.com',
    categories: ['design', 'tutorial'],
    daysAgo: 37
  },
  {
    title: "Performance Optimization Techniques",
    body: "Fast websites provide better user experiences. Optimize images—use modern formats like WebP, lazy load, and serve appropriate sizes. Minimize and bundle JavaScript. Use code splitting. Leverage browser caching. Consider a CDN for static assets. Monitor performance with tools like Lighthouse. Small optimizations add up. Remember: premature optimization is the root of all evil—measure first.",
    userEmail: 'jordan.t@example.com',
    categories: ['technology', 'tutorial'],
    daysAgo: 38
  },
  {
    title: "The Importance of Documentation",
    body: "Good documentation is as important as good code. Write README files that explain what your project does and how to get started. Document your API endpoints. Add comments for complex logic, but let code be self-documenting when possible. Keep documentation up to date—outdated docs are worse than no docs. Documentation is a gift to your future self and your team.",
    userEmail: 'maya.p@example.com',
    categories: ['programming', 'tutorial'],
    daysAgo: 39
  },
  {
    title: "Managing Technical Debt",
    body: "Technical debt is inevitable, but it needs management. Some debt is intentional—shipping fast to validate an idea. Other debt accumulates from shortcuts and quick fixes. Regularly refactor code. Allocate time for maintenance. Don't let debt compound—pay it down incrementally. Balance new features with code quality. A codebase with too much debt becomes unmaintainable.",
    userEmail: 'chris.a@example.com',
    categories: ['programming', 'personal'],
    daysAgo: 40
  },
  {
    title: "The Power of Side Projects",
    body: "Side projects are where I learn the most. They're low-stakes environments to experiment. I've built things I thought were impossible. Some projects became portfolio pieces. Others taught me what not to do. The key is finishing projects, even if they're small. A completed project teaches more than a dozen half-finished ones. Plus, side projects can become real products.",
    userEmail: 'riley.m@example.com',
    categories: ['personal', 'programming'],
    daysAgo: 41
  },
  {
    title: "Understanding Web Performance Metrics",
    body: "Core Web Vitals measure real user experience. Largest Contentful Paint (LCP) should be under 2.5 seconds. First Input Delay (FID) measures interactivity. Cumulative Layout Shift (CLS) measures visual stability. These metrics affect SEO and user experience. I use tools like PageSpeed Insights and WebPageTest to measure and improve. Performance is a feature.",
    userEmail: 'sam.t@example.com',
    categories: ['technology', 'tutorial'],
    daysAgo: 42
  },
  {
    title: "Building a Design System",
    body: "Design systems create consistency and speed up development. Start with colors, typography, and spacing. Create reusable components. Document usage and variations. Use tools like Storybook to showcase components. A design system is a living document—it evolves with your product. Even small projects benefit from basic design tokens. Consistency improves user experience and developer velocity.",
    userEmail: 'taylor.b@example.com',
    categories: ['design', 'tutorial'],
    daysAgo: 43
  },
  {
    title: "The Future of Web3 and Blockchain",
    body: "Web3 is controversial, but blockchain technology has interesting applications beyond cryptocurrency. Smart contracts enable decentralized applications. NFTs have use cases in digital ownership. However, there's also a lot of hype and scams. I'm skeptical but curious. The technology is fascinating, but many projects solve problems that don't exist. Time will tell what's truly valuable.",
    userEmail: 'casey.l@example.com',
    categories: ['technology', 'news'],
    daysAgo: 44
  },
  {
    title: "Learning Path for Full-Stack Developers",
    body: "Becoming full-stack takes time. Start with HTML, CSS, and JavaScript fundamentals. Learn a frontend framework (React, Vue, or Angular). Understand HTTP and REST APIs. Learn a backend language (Node.js, Python, or Go). Get comfortable with databases (SQL and NoSQL). Learn Git and deployment. Build projects to apply knowledge. There's no shortcut—consistent practice is key.",
    userEmail: 'morgan.w@example.com',
    categories: ['tutorial', 'programming'],
    daysAgo: 45
  },
  {
    title: "The Benefits of Pair Programming",
    body: "Pair programming improves code quality and knowledge sharing. Two sets of eyes catch more bugs. It's a great way to onboard new team members. The driver writes code while the navigator thinks about the bigger picture. Switch roles regularly. It can feel slower, but the code quality improvement is worth it. Plus, it's more fun than coding alone.",
    userEmail: 'jamie.g@example.com',
    categories: ['programming', 'personal'],
    daysAgo: 46
  },
  {
    title: "Building Responsive Images",
    body: "Images are often the largest assets on a page. Use the picture element with srcset for responsive images. Serve modern formats like WebP or AVIF with fallbacks. Lazy load images below the fold. Use appropriate sizes—don't serve 2000px images for thumbnails. Consider using a CDN or image optimization service. Proper image optimization significantly improves page load times.",
    userEmail: 'quinn.d@example.com',
    categories: ['design', 'tutorial'],
    daysAgo: 47
  },
  {
    title: "The Evolution of CSS",
    body: "CSS has come a long way. We've moved from floats to Flexbox to Grid. Custom properties (CSS variables) enable theming. Container queries are the next big thing. CSS is becoming more powerful and developer-friendly. I'm excited about native nesting and better color functions. The future of CSS looks bright, and it's becoming a more capable language for styling.",
    userEmail: 'avery.w@example.com',
    categories: ['design', 'technology', 'news'],
    daysAgo: 48
  },
  {
    title: "Mental Health in Tech",
    body: "Tech culture can be toxic—long hours, imposter syndrome, constant learning pressure. It's okay to not know everything. It's okay to take breaks. It's okay to ask for help. Burnout is real and serious. Set boundaries. Find work-life balance. Talk about mental health—it's not weakness. Your health is more important than any job or project. Take care of yourself.",
    userEmail: 'blake.m@example.com',
    categories: ['personal', 'lifestyle'],
    daysAgo: 49
  },
  {
    title: "The Art of Code Comments",
    body: "Good comments explain 'why', not 'what'. Code should be self-documenting through clear naming. Comments that restate code are worse than no comments. However, comments are valuable for explaining business logic, complex algorithms, or non-obvious decisions. Keep comments up to date—outdated comments mislead. When in doubt, improve the code rather than adding a comment.",
    userEmail: 'cameron.j@example.com',
    categories: ['programming', 'tutorial'],
    daysAgo: 50
  },
  {
    title: "Building Progressive Web Apps",
    body: "PWAs combine the best of web and native apps. They work offline, can be installed, and feel native. Service workers enable offline functionality and background sync. Web app manifests make apps installable. PWAs are particularly valuable for users in areas with poor connectivity. They're easier to maintain than separate native apps. The web platform is powerful enough for many use cases.",
    userEmail: 'dakota.h@example.com',
    categories: ['technology', 'tutorial'],
    daysAgo: 51
  },
  {
    title: "The Importance of User Research",
    body: "Building without user research is like driving blindfolded. Talk to users. Understand their problems. Watch them use your product. User research prevents building features nobody wants. It's not expensive—even informal interviews help. Don't assume you know what users need. Validate assumptions early. User research should inform every design and development decision.",
    userEmail: 'skylar.c@example.com',
    categories: ['design', 'personal'],
    daysAgo: 52
  },
  {
    title: "Building with Web Components",
    body: "Web Components enable reusable custom elements. They work with any framework or no framework. The standard includes Custom Elements, Shadow DOM, and HTML Templates. Browser support is good now. Web Components are framework-agnostic, making them great for design systems. They're not a replacement for frameworks, but they're useful for creating reusable UI components.",
    userEmail: 'alex.chen@example.com',
    categories: ['programming', 'technology'],
    daysAgo: 53
  },
  {
    title: "The Philosophy of Clean Code",
    body: "Clean code is readable, maintainable, and testable. It follows conventions and patterns. Functions do one thing well. Names are descriptive. Code is organized logically. Clean code is easier to debug and extend. It's not about being clever—it's about being clear. Writing clean code is a skill that improves with practice. Read 'Clean Code' by Robert Martin—it's a classic for a reason.",
    userEmail: 'david.kim@example.com',
    categories: ['programming', 'personal'],
    daysAgo: 54
  },
  {
    title: "Building a Portfolio Website",
    body: "Your portfolio is your digital business card. Keep it simple and focused. Show your best work, not everything. Include case studies that explain your process. Make it easy to contact you. Ensure it's fast and works on mobile. Your portfolio doesn't need to be fancy—clarity trumps creativity. Update it regularly. A good portfolio opens doors.",
    userEmail: 'emma.w@example.com',
    categories: ['design', 'personal'],
    daysAgo: 55
  },
  {
    title: "The Rise of No-Code Tools",
    body: "No-code tools are getting more powerful. They enable non-developers to build applications. However, they're not replacements for code—they're tools for different use cases. No-code is great for prototypes, MVPs, and simple applications. Complex applications still need code. As a developer, don't fear no-code—embrace it as another tool. The best solution depends on the problem.",
    userEmail: 'mike.r@example.com',
    categories: ['technology', 'news'],
    daysAgo: 56
  },
  {
    title: "Building Accessible Navigation",
    body: "Navigation is critical for accessibility. Use semantic HTML like nav and proper heading hierarchy. Ensure keyboard navigation works—users should be able to tab through all links. Skip links help keyboard users. Mobile navigation needs special consideration. Test with screen readers. Good navigation is invisible when it works well. Bad navigation frustrates everyone, not just users with disabilities.",
    userEmail: 'sarah.j@example.com',
    categories: ['design', 'tutorial'],
    daysAgo: 57
  },
  {
    title: "The Joy of Teaching Others",
    body: "Teaching is the best way to learn. Explaining concepts forces you to understand them deeply. I started a YouTube channel to teach web development, and it's improved my own skills. Teaching also builds your reputation and network. You don't need to be an expert—teach what you know. Even beginners can help other beginners. The tech community thrives on knowledge sharing.",
    userEmail: 'jordan.t@example.com',
    categories: ['personal', 'lifestyle'],
    daysAgo: 58
  },
  {
    title: "Building with WebAssembly",
    body: "WebAssembly brings near-native performance to the web. It's great for computationally intensive tasks like image processing, games, or scientific computing. You can write WebAssembly in languages like Rust, C++, or AssemblyScript. It's not a replacement for JavaScript—they work together. WebAssembly opens new possibilities for web applications. The performance gains are significant for the right use cases.",
    userEmail: 'maya.p@example.com',
    categories: ['technology', 'programming'],
    daysAgo: 59
  },
  {
    title: "The Art of Estimation",
    body: "Estimating software projects is notoriously difficult. Everything takes longer than expected. Break work into small tasks for better estimates. Use story points rather than hours. Include time for testing, code review, and deployment. Add buffer for unexpected issues. Track actual vs estimated time to improve. Remember: estimates are guesses, not promises. Communicate uncertainty.",
    userEmail: 'chris.a@example.com',
    categories: ['programming', 'personal'],
    daysAgo: 60
  }
];

const comments = [
  { postTitle: "Building My First React App", userEmail: 'sarah.j@example.com', text: "Great post! I'm also learning React. Any tips for managing state?", daysAgo: 4 },
  { postTitle: "CSS Grid: A Game Changer", userEmail: 'alex.chen@example.com', text: "Grid is amazing! Have you tried using it with CSS variables?", daysAgo: 1 },
  { postTitle: "Node.js Backend Development Tips", userEmail: 'david.kim@example.com', text: "Excellent points about error handling. Middleware is definitely key.", daysAgo: 5 },
  { postTitle: "Learning to Code Changed My Life", userEmail: 'mike.r@example.com', text: "This resonates so much! Coding has opened so many doors for me too.", daysAgo: 7 },
  { postTitle: "TypeScript: Why I Made the Switch", userEmail: 'emma.w@example.com', text: "I was skeptical too, but TypeScript has saved me countless hours of debugging.", daysAgo: 8 },
  { postTitle: "The Future of AI in Software Development", userEmail: 'david.kim@example.com', text: "AI assistants are game-changers. I use Copilot daily and it's incredible how much faster I can code.", daysAgo: 10 },
  { postTitle: "Understanding Machine Learning Basics", userEmail: 'alex.chen@example.com', text: "This is a great introduction! I've been wanting to get into ML. Any resources you'd recommend?", daysAgo: 12 },
  { postTitle: "Python vs JavaScript: Which Should You Learn?", userEmail: 'mike.r@example.com', text: "I started with Python and it was perfect for learning programming concepts. JavaScript came easier after that.", daysAgo: 9 },
  { postTitle: "Getting Started with Rust", userEmail: 'emma.w@example.com', text: "Rust's compiler errors are the best! They actually teach you how to fix the problem.", daysAgo: 11 },
  { postTitle: "Color Theory for Web Designers", userEmail: 'sarah.j@example.com', text: "Color accessibility is so important. Great reminder about contrast ratios!", daysAgo: 3 },
  { postTitle: "My Morning Routine for Productivity", userEmail: 'jordan.t@example.com', text: "I've been trying to establish a morning routine. This gives me some great ideas to try!", daysAgo: 17 },
  { postTitle: "Remote Work: Tips for Staying Focused", userEmail: 'maya.p@example.com', text: "The Pomodoro Technique has been a lifesaver for me too. Great tips!", daysAgo: 15 },
  { postTitle: "Docker and Containerization Explained", userEmail: 'chris.a@example.com', text: "Docker changed how I develop. No more 'it works on my machine' issues!", daysAgo: 4 },
  { postTitle: "GraphQL: A Better Alternative to REST?", userEmail: 'riley.m@example.com', text: "GraphQL is powerful but can be overkill for simple APIs. Great analysis!", daysAgo: 12 },
  { postTitle: "Building Your First REST API", userEmail: 'sam.t@example.com', text: "This is exactly what I needed! Clear and practical. Thanks for sharing.", daysAgo: 24 },
  { postTitle: "The State of Web Development in 2024", userEmail: 'taylor.b@example.com', text: "So many new tools, so little time! Focusing on fundamentals is solid advice.", daysAgo: 29 },
  { postTitle: "The Art of Debugging", userEmail: 'casey.l@example.com', text: "Rubber duck debugging is real! I've solved so many problems just by explaining them out loud.", daysAgo: 34 },
  { postTitle: "Performance Optimization Techniques", userEmail: 'morgan.w@example.com', text: "Image optimization is often overlooked but makes such a huge difference. Great post!", daysAgo: 36 },
  { postTitle: "The Power of Side Projects", userEmail: 'jamie.g@example.com', text: "Side projects are where I learn the most too. They're my playground for experimentation.", daysAgo: 39 },
  { postTitle: "Mental Health in Tech", userEmail: 'quinn.d@example.com', text: "Thank you for writing this. Mental health discussions are so important in our industry.", daysAgo: 47 }
];

const likes = [
  { userEmail: 'alex.chen@example.com', postTitles: ['CSS Grid: A Game Changer', 'TypeScript: Why I Made the Switch', 'Getting Started with Rust', 'The Art of Debugging', 'Building with Web Components'] },
  { userEmail: 'sarah.j@example.com', postTitles: ['Building My First React App', 'Learning to Code Changed My Life', 'Color Theory for Web Designers', 'Accessibility in Web Design', 'Building Accessible Forms'] },
  { userEmail: 'mike.r@example.com', postTitles: ['Database Optimization Strategies', 'API Design Best Practices', 'Python vs JavaScript: Which Should You Learn?', 'The Rise of No-Code Tools', 'The Art of Estimation'] },
  { userEmail: 'emma.w@example.com', postTitles: ['My Journey into Web Design', 'Work-Life Balance as a Developer', 'My Morning Routine for Productivity', 'Building a Portfolio Website', 'Mental Health in Tech'] },
  { userEmail: 'david.kim@example.com', postTitles: ['JavaScript Closures Explained', 'Node.js Backend Development Tips', 'Functional Programming Concepts', 'The Philosophy of Clean Code', 'The Future of AI in Software Development'] },
  { userEmail: 'jordan.t@example.com', postTitles: ['The Future of AI in Software Development', 'Dark Mode: Design Considerations', 'Performance Optimization Techniques', 'The Joy of Teaching Others'] },
  { userEmail: 'maya.p@example.com', postTitles: ['Understanding Machine Learning Basics', 'Remote Work: Tips for Staying Focused', 'The Importance of Documentation', 'Building with WebAssembly'] },
  { userEmail: 'chris.a@example.com', postTitles: ['Cloud Computing: AWS vs Azure vs GCP', 'Learning a New Language While Coding', 'Managing Technical Debt', 'The Art of Estimation'] },
  { userEmail: 'riley.m@example.com', postTitles: ['Cybersecurity Best Practices for Developers', 'My Experience with Digital Minimalism', 'The Power of Side Projects'] },
  { userEmail: 'sam.t@example.com', postTitles: ['The Rise of Quantum Computing', 'Cooking as a Form of Meditation', 'Understanding Web Performance Metrics'] },
  { userEmail: 'taylor.b@example.com', postTitles: ['Python vs JavaScript: Which Should You Learn?', 'Building a Home Gym on a Budget', 'Building a Design System'] },
  { userEmail: 'casey.l@example.com', postTitles: ['Getting Started with Rust', 'How to Set Up a CI/CD Pipeline', 'The Future of Web3 and Blockchain'] },
  { userEmail: 'morgan.w@example.com', postTitles: ['Vue.js vs React: My Experience', 'Git Workflow for Teams', 'The Benefits of Pair Programming'] },
  { userEmail: 'jamie.g@example.com', postTitles: ['Go: The Language for Modern Backends', 'Setting Up a Development Environment', 'The Power of Side Projects'] },
  { userEmail: 'quinn.d@example.com', postTitles: ['Docker and Containerization Explained', 'Setting Up a Development Environment', 'Building Responsive Images'] },
  { userEmail: 'avery.w@example.com', postTitles: ['GraphQL: A Better Alternative to REST?', 'Testing Your Code: A Beginner\'s Guide', 'The Evolution of CSS'] },
  { userEmail: 'blake.m@example.com', postTitles: ['Microservices Architecture: Pros and Cons', 'Latest JavaScript Features in ES2024', 'Mental Health in Tech'] },
  { userEmail: 'cameron.j@example.com', postTitles: ['Color Theory for Web Designers', 'The State of Web Development in 2024', 'The Art of Code Comments'] },
  { userEmail: 'dakota.h@example.com', postTitles: ['Typography: The Foundation of Good Design', 'Open Source Contributions: Getting Started', 'Building Progressive Web Apps'] },
  { userEmail: 'skylar.c@example.com', postTitles: ['Mobile-First Design Approach', 'Building a Personal Brand as a Developer', 'The Importance of User Research'] }
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

