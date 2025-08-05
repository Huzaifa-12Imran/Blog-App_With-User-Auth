# User Authentication System - Implementation Guide

## Overview

This document provides a comprehensive guide to the User Authentication System implemented in the Student Manager application. The system provides secure user registration, login, and session management using JWT tokens.

## Architecture

### Backend Authentication Flow

```
User Registration/Login Request
         ↓
Input Validation & Sanitization
         ↓
Password Hashing (bcryptjs)
         ↓
Database Operation (MongoDB)
         ↓
JWT Token Generation
         ↓
Response with Token & User Data
```

### Frontend Authentication Flow

```
User Input (Login/Register Form)
         ↓
Form Validation
         ↓
API Request to Backend
         ↓
Token Storage (localStorage)
         ↓
Context State Update
         ↓
Route Protection & Navigation
```

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  username: String (required, unique, 3-30 chars),
  email: String (required, unique, valid email),
  password: String (required, hashed, min 6 chars),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Student Collection (Protected)

```javascript
{
  _id: ObjectId,
  name: String (required),
  age: Number (required),
  email: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints Documentation

### Authentication Endpoints

#### POST /api/auth/register
**Description**: Register a new user account

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "user" // optional, defaults to "user"
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "lastLogin": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "message": "User with this email or username already exists"
}
```

#### POST /api/auth/login
**Description**: Authenticate user and return JWT token

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "lastLogin": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (401)**:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### GET /api/auth/profile
**Description**: Get current user profile (Protected)

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-10T08:00:00.000Z"
    }
  }
}
```

#### PUT /api/auth/profile
**Description**: Update user profile (Protected)

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**:
```json
{
  "username": "john_doe_updated",
  "email": "john.updated@example.com"
}
```

#### POST /api/auth/change-password
**Description**: Change user password (Protected)

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

### Protected Student Endpoints

All student endpoints require authentication via JWT token in the Authorization header.

#### GET /api/students
**Description**: Get all students (Protected)

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Alice Johnson",
      "age": 20,
      "email": "alice@university.edu",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T09:00:00.000Z"
    }
  ]
}
```

## Security Implementation

### Password Security

1. **Hashing Algorithm**: bcryptjs with salt rounds = 12
2. **Password Requirements**: Minimum 6 characters
3. **Storage**: Only hashed passwords stored in database

```javascript
// Password hashing middleware in User model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  next();
});
```

### JWT Token Security

1. **Secret Key**: Stored in environment variables
2. **Expiration**: 24 hours (configurable)
3. **Algorithm**: HS256
4. **Storage**: Client-side localStorage (consider httpOnly cookies for production)

```javascript
// Token generation
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};
```

### Route Protection

1. **Middleware**: Custom authentication middleware
2. **Token Validation**: Verify JWT signature and expiration
3. **User Verification**: Check if user exists and is active

```javascript
// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token is required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};
```

## Frontend Implementation

### Authentication Context

The React Context API manages authentication state across the application:

```javascript
// AuthContext provides:
- user: Current user object
- token: JWT token
- loading: Authentication loading state
- login(email, password): Login function
- register(username, email, password, role): Registration function
- logout(): Logout function
- updateProfile(username, email): Profile update function
- changePassword(currentPassword, newPassword): Password change function
- isAuthenticated: Boolean authentication status
- isAdmin: Boolean admin status
```

### Protected Routes

```javascript
// ProtectedRoute component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" />;
  
  return children;
};
```

### Form Validation

Client-side validation includes:
- Email format validation
- Password length requirements
- Username length constraints
- Confirm password matching
- Real-time error display

## Testing the Authentication System

### Manual Testing Steps

1. **Registration Test**:
   ```
   1. Navigate to http://localhost:3000/register
   2. Fill in valid user details
   3. Submit form
   4. Verify redirect to dashboard
   5. Check user appears in MongoDB
   ```

2. **Login Test**:
   ```
   1. Navigate to http://localhost:3000/login
   2. Enter registered credentials
   3. Submit form
   4. Verify redirect to dashboard
   5. Check token in localStorage
   ```

3. **Protected Route Test**:
   ```
   1. Clear localStorage (logout)
   2. Try to access http://localhost:3000/dashboard
   3. Verify redirect to login page
   4. Login and verify access granted
   ```

4. **Token Expiration Test**:
   ```
   1. Login successfully
   2. Manually expire token or wait 24 hours
   3. Try to access protected route
   4. Verify redirect to login
   ```

### Database Verification

Check MongoDB collections:

```javascript
// Users collection
db.users.find().pretty()

// Students collection (should be empty without authentication)
db.students.find().pretty()
```

## Environment Configuration

### Server Environment Variables (.env)

```env
# Database
MONGO_URI=mongodb://localhost:27017/studentDB

# Server
PORT=5000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=24h

# Environment
NODE_ENV=development
```

### Production Considerations

1. **JWT Secret**: Use a strong, randomly generated secret
2. **HTTPS**: Always use HTTPS in production
3. **Token Storage**: Consider httpOnly cookies instead of localStorage
4. **Rate Limiting**: Implement rate limiting for auth endpoints
5. **Input Sanitization**: Add additional input validation and sanitization
6. **Logging**: Implement proper logging for security events

## Troubleshooting

### Common Issues

1. **"Invalid token" errors**:
   - Check if JWT_SECRET matches between requests
   - Verify token format in Authorization header
   - Check token expiration

2. **CORS errors**:
   - Ensure CORS is properly configured in server
   - Check if client proxy is set correctly

3. **Database connection issues**:
   - Verify MongoDB is running
   - Check MONGO_URI in .env file
   - Ensure database permissions

4. **Registration/Login failures**:
   - Check password hashing implementation
   - Verify email uniqueness constraints
   - Check validation error messages

### Debug Commands

```bash
# Check server logs
npm run server

# Check client console
# Open browser developer tools

# Check MongoDB data
mongo
use studentDB
db.users.find()
db.students.find()
```

## Security Best Practices Implemented

1. ✅ Password hashing with bcryptjs
2. ✅ JWT token authentication
3. ✅ Input validation and sanitization
4. ✅ Protected routes with middleware
5. ✅ Environment variable configuration
6. ✅ CORS configuration
7. ✅ Error handling without information leakage
8. ✅ User session management
9. ✅ Role-based access control
10. ✅ Token expiration handling

This authentication system provides a solid foundation for secure user management in the Student Manager application.