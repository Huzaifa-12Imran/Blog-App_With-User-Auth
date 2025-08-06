# BlogSpace - Personal Blogging Platform

A full-stack web application for creating and managing blog posts with secure user authentication built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🔐 Authentication Features

- **User Registration** - Create new accounts with username, email, and password
- **User Login** - Secure login with JWT token authentication
- **Password Hashing** - Passwords encrypted using bcryptjs
- **Protected Routes** - Dashboard and student management require authentication
- **User Profiles** - View and update user information
- **Password Change** - Secure password update functionality
- **Role-based Access** - Admin and User roles with different permissions
- **Auto-logout** - Token expiration handling
- **Persistent Sessions** - Stay logged in across browser sessions

## 📝 Blog Management Features

- **Create Blog Posts** - Write and publish your thoughts
- **Rich Content Editor** - Full-featured blog post creation
- **Draft System** - Save drafts and publish when ready
- **Categories & Tags** - Organize your content effectively
- **Public Blog Feed** - Browse all published posts
- **Like & Comment System** - Engage with other writers
- **Search & Filter** - Find content easily
- **Responsive Design** - Works on all devices
- **Featured Images** - Add visual appeal to your posts

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

**Frontend:**
- React.js
- Tailwind CSS
- Axios for API calls

## Project Structure

```
blogspace/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Blog.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── blogs.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── db.js
│   └── server.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── BlogForm.js
│   │   │   ├── BlogCard.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   └── PublicBlogs.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── .env
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB installed and running locally (or MongoDB Atlas account)

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the server directory:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blogDB
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=24h
```

3. Start the backend server:
```bash
npm run dev
```

4. (Optional) Seed the database with sample blog posts:
```bash
npm run seed
```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## API Endpoints

### Authentication Routes
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update user profile |
| POST | `/api/auth/change-password` | Change password |
| POST | `/api/auth/logout` | Logout user |

### Blog Routes
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/blogs/public` | Get all published blogs (public) |
| GET | `/api/blogs/public/:id` | Get single blog by ID (public) |
| GET | `/api/blogs/` | Get user's blogs (authenticated) |
| POST | `/api/blogs/` | Create a new blog |
| PUT | `/api/blogs/:id` | Update a blog |
| DELETE | `/api/blogs/:id` | Delete a blog |
| POST | `/api/blogs/:id/like` | Like/Unlike a blog |
| POST | `/api/blogs/:id/comments` | Add comment to blog |
| DELETE | `/api/blogs/:id/comments/:commentId` | Delete comment |

## Blog Schema

```javascript
{
  title: String (required),
  content: String (required),
  excerpt: String,
  author: ObjectId (ref: User),
  tags: [String],
  category: String,
  status: String (draft/published/archived),
  featuredImage: String,
  readTime: Number,
  views: Number,
  likes: [{ user: ObjectId, likedAt: Date }],
  comments: [{ user: ObjectId, content: String, createdAt: Date }],
  publishedAt: Date,
  timestamps: true
}
```

## Usage

1. **Start MongoDB service** (make sure MongoDB is running locally)

2. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```
   The backend will run on http://localhost:5000

3. **Start the frontend (in a new terminal):**
   ```bash
   cd client
   npm start
   ```
   The frontend will run on http://localhost:3000

4. **Open your browser** and navigate to http://localhost:3000

5. **Use the application:**
   - **Public Access:** Browse published blog posts on the home page
   - **Register/Login:** Create an account or sign in to manage your blogs
   - **Dashboard:** Create, edit, and manage your blog posts
   - **Profile:** Update your user information and change password
   - **Blog Features:** Write posts, add categories/tags, upload featured images
   - **Engagement:** Like and comment on blog posts

## Testing API with Postman

You can test the API endpoints using Postman:

**Register User:**
- Method: POST
- URL: http://localhost:5000/api/auth/register
- Body (JSON):
```json
{
  "username": "liameee",
  "email": "liam@example.com",
  "password": "password123"
}
```

**Login User:**
- Method: POST
- URL: http://localhost:5000/api/auth/login
- Body (JSON):
```json
{
  "email": "liam@example.com",
  "password": "password123"
}
```

**Create Blog Post:**
- Method: POST
- URL: http://localhost:5000/api/blogs
- Headers: Authorization: Bearer {your_jwt_token}
- Body (JSON):
```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "excerpt": "A brief description",
  "category": "Technology",
  "tags": "javascript, web development",
  "status": "published"
}
```

**Get Public Blogs:**
- Method: GET
- URL: http://localhost:5000/api/blogs/public

**Get User's Blogs:**
- Method: GET
- URL: http://localhost:5000/api/blogs
- Headers: Authorization: Bearer {your_jwt_token}

## Current Status 

Your BlogSpace application is now **fully functional** with complete blog management capabilities!

- Backend API running on http://localhost:5000
- Frontend React app running on http://localhost:3000
- MongoDB connected and working
- User authentication system implemented
- Full blog CRUD operations
- Public blog browsing
- Like and comment system
- Tailwind CSS styling applied
- Full-stack integration complete

## Features Working:
- **User Authentication:** Register, login, profile management, password change
- **Blog Management:** Create, read, update, delete blog posts
- **Public Blog Feed:** Browse all published posts without authentication
- **Rich Content:** Categories, tags, featured images, excerpts
- **Engagement:** Like posts and add comments
- **Search & Filter:** Find blogs by content, category, or tags
- **Draft System:** Save drafts and publish when ready
- **Responsive Design:** Works perfectly on all devices

## API Testing Results:
- POST /api/auth/register - User registration 
- POST /api/auth/login - User login 
- GET /api/blogs/public - Public blog feed 
- POST /api/blogs/ - Create blog post 
- GET /api/blogs/ - Get user's blogs 
- PUT /api/blogs/:id - Update blog post 
- DELETE /api/blogs/:id - Delete blog post 
- POST /api/blogs/:id/like - Like/unlike blog 
- POST /api/blogs/:id/comments - Add comment 

## Key Features:
- **Secure Authentication** with JWT tokens
- **Rich Blog Editor** with categories and tags
- **Public Blog Feed** for discovering content
- **Social Features** - likes and comments
- **Search & Filter** functionality
- **Responsive Design** for all devices
- **Modern UI** with Tailwind CSS
- **Real-time Updates** between frontend and backend