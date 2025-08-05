# Testing Guide - User Authentication System

## Overview

This guide provides step-by-step instructions for testing the User Authentication System in the Student Manager application. Follow these tests to verify that all authentication features work correctly.

## Prerequisites

1. **MongoDB Running**: Ensure MongoDB is running on your system
2. **Server Running**: Start the server with `npm run server` from the root directory
3. **Client Running**: Start the client with `npm run client` from the root directory
4. **Browser**: Use Chrome, Firefox, or Edge for testing

## Test Environment Setup

1. **Start the Application**:
   ```bash
   # Terminal 1 - Start server
   cd server
   npm start
   
   # Terminal 2 - Start client
   cd client
   npm start
   ```

2. **Access URLs**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

3. **Database Access**:
   ```bash
   mongo
   use studentDB
   ```

## Authentication Tests

### Test 1: User Registration

**Objective**: Verify new users can register successfully

**Steps**:
1. Navigate to http://localhost:3000
2. You should be redirected to the login page
3. Click "Sign up here" link
4. Fill in the registration form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Role: `User`
5. Click "Create Account"

**Expected Results**:
- ✅ Form validation works (try invalid emails, short passwords)
- ✅ Successful registration redirects to dashboard
- ✅ Welcome message shows username
- ✅ User appears in MongoDB users collection
- ✅ Password is hashed in database (not plain text)

**Database Verification**:
```javascript
db.users.find({email: "test@example.com"}).pretty()
```

### Test 2: User Login

**Objective**: Verify registered users can login successfully

**Steps**:
1. If logged in, logout by clicking username → Sign Out
2. Navigate to http://localhost:3000/login
3. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Sign In"

**Expected Results**:
- ✅ Successful login redirects to dashboard
- ✅ Welcome message displays correct username
- ✅ JWT token stored in localStorage
- ✅ User role displayed in navbar
- ✅ Last login time updated in database

**Browser Console Check**:
```javascript
// Check token in localStorage
localStorage.getItem('token')
```

### Test 3: Invalid Login Attempts

**Objective**: Verify system handles invalid credentials properly

**Test Cases**:

**3a. Wrong Password**:
1. Go to login page
2. Enter: `test@example.com` / `wrongpassword`
3. Click "Sign In"

**Expected**: Error message "Invalid email or password"

**3b. Non-existent Email**:
1. Enter: `nonexistent@example.com` / `password123`
2. Click "Sign In"

**Expected**: Error message "Invalid email or password"

**3c. Empty Fields**:
1. Leave email or password empty
2. Click "Sign In"

**Expected**: Validation errors for required fields

### Test 4: Protected Routes

**Objective**: Verify routes are protected and require authentication

**Steps**:
1. Logout if logged in
2. Try to access these URLs directly:
   - http://localhost:3000/dashboard
   - http://localhost:3000/profile

**Expected Results**:
- ✅ Redirected to login page
- ✅ After login, redirected to originally requested page
- ✅ Cannot access protected content without authentication

### Test 5: Token Persistence

**Objective**: Verify user stays logged in across browser sessions

**Steps**:
1. Login successfully
2. Close browser completely
3. Reopen browser and navigate to http://localhost:3000

**Expected Results**:
- ✅ User remains logged in
- ✅ Redirected to dashboard
- ✅ User information displayed correctly

### Test 6: Profile Management

**Objective**: Verify users can view and update their profiles

**Steps**:
1. Login and go to dashboard
2. Click username in navbar → Profile
3. Verify profile information is displayed
4. Update username to `testuser_updated`
5. Update email to `test.updated@example.com`
6. Click "Update Profile"

**Expected Results**:
- ✅ Profile information loads correctly
- ✅ Updates save successfully
- ✅ Success message displayed
- ✅ Navbar shows updated username
- ✅ Database reflects changes

### Test 7: Password Change

**Objective**: Verify users can change their passwords

**Steps**:
1. Go to Profile page
2. Click "Change Password" tab
3. Fill in form:
   - Current Password: `password123`
   - New Password: `newpassword456`
   - Confirm New Password: `newpassword456`
4. Click "Change Password"
5. Logout and login with new password

**Expected Results**:
- ✅ Password change succeeds with correct current password
- ✅ Password change fails with wrong current password
- ✅ New password validation works
- ✅ Can login with new password
- ✅ Cannot login with old password

### Test 8: Admin Role Testing

**Objective**: Verify admin role functionality

**Steps**:
1. Register a new user with Admin role:
   - Username: `admin`
   - Email: `admin@example.com`
   - Password: `admin123`
   - Role: `Admin`
2. Login with admin account

**Expected Results**:
- ✅ Admin badge appears in navbar
- ✅ Admin role displayed in profile
- ✅ Same access to student management (for now)

## Student Management Tests (Protected Features)

### Test 9: Student CRUD Operations

**Objective**: Verify student management requires authentication

**Prerequisites**: Must be logged in

**9a. Create Student**:
1. Go to dashboard
2. Fill in student form:
   - Name: `John Doe`
   - Age: `20`
   - Email: `john.doe@university.edu`
3. Click "Add Student"

**Expected Results**:
- ✅ Student added successfully
- ✅ Appears in student list
- ✅ Stored in database with authentication

**9b. View Students**:
1. Refresh page
2. Check student list

**Expected Results**:
- ✅ Students load correctly
- ✅ Only accessible when authenticated

**9c. Edit Student**:
1. Click edit button on a student
2. Modify information
3. Click "Update Student"

**Expected Results**:
- ✅ Student updates successfully
- ✅ Changes reflected immediately

**9d. Delete Student**:
1. Click delete button on a student
2. Confirm deletion

**Expected Results**:
- ✅ Student deleted successfully
- ✅ Removed from list

### Test 10: API Authentication

**Objective**: Verify API endpoints require authentication

**Using Browser Developer Tools or Postman**:

**10a. Unauthenticated Request**:
```javascript
fetch('http://localhost:5000/api/students')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Expected**: 401 Unauthorized error

**10b. Authenticated Request**:
```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/students', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => console.log(data));
```

**Expected**: Successful response with student data

## Error Handling Tests

### Test 11: Network Error Handling

**Objective**: Verify application handles network errors gracefully

**Steps**:
1. Stop the server (Ctrl+C in server terminal)
2. Try to login or perform any API operation
3. Restart server

**Expected Results**:
- ✅ Appropriate error messages displayed
- ✅ Application doesn't crash
- ✅ Functionality resumes when server restarts

### Test 12: Token Expiration

**Objective**: Verify token expiration handling

**Steps**:
1. Login successfully
2. In browser console, modify token expiration:
   ```javascript
   // Set a very short expiration time in .env
   JWT_EXPIRES_IN=1s
   ```
3. Wait for token to expire
4. Try to access protected route

**Expected Results**:
- ✅ Redirected to login page
- ✅ Token removed from localStorage
- ✅ Appropriate error message

## Database Verification

### Test 13: Database Integrity

**Objective**: Verify data integrity in MongoDB

**MongoDB Commands**:
```javascript
// Check users collection
db.users.find().pretty()

// Verify password hashing
db.users.findOne({email: "test@example.com"}).password
// Should be hashed, not plain text

// Check students collection
db.students.find().pretty()

// Verify indexes
db.users.getIndexes()
```

**Expected Results**:
- ✅ Users have hashed passwords
- ✅ Email and username are unique
- ✅ Proper indexes exist
- ✅ Data relationships are correct

## Performance Tests

### Test 14: Load Testing

**Objective**: Basic performance verification

**Steps**:
1. Create multiple user accounts (5-10)
2. Add multiple students (20-50)
3. Test login/logout multiple times
4. Check response times

**Expected Results**:
- ✅ Reasonable response times (<2 seconds)
- ✅ No memory leaks
- ✅ Stable performance

## Security Tests

### Test 15: Security Verification

**Objective**: Verify security measures are working

**15a. SQL Injection Attempts**:
- Try entering SQL injection strings in login fields
- Expected: No database errors, proper sanitization

**15b. XSS Attempts**:
- Try entering script tags in form fields
- Expected: Scripts don't execute, proper escaping

**15c. Password Security**:
- Verify passwords are hashed in database
- Check password requirements are enforced

## Test Results Documentation

### Test Report Template

```
Test Date: [Date]
Tester: [Name]
Environment: [Development/Production]

Test Results:
✅ User Registration - PASS
✅ User Login - PASS
✅ Protected Routes - PASS
✅ Token Persistence - PASS
✅ Profile Management - PASS
✅ Password Change - PASS
✅ Student CRUD - PASS
✅ API Authentication - PASS
✅ Error Handling - PASS
✅ Database Integrity - PASS

Issues Found:
- [List any issues discovered]

Recommendations:
- [Any improvements suggested]
```

## Troubleshooting Common Issues

### Issue 1: "Cannot connect to server"
**Solution**: Ensure server is running on port 5000

### Issue 2: "Database connection failed"
**Solution**: Start MongoDB service

### Issue 3: "Token invalid" errors
**Solution**: Clear localStorage and login again

### Issue 4: CORS errors
**Solution**: Check server CORS configuration

### Issue 5: Registration fails
**Solution**: Check for duplicate email/username in database

## Automated Testing Setup (Optional)

For automated testing, consider implementing:

1. **Jest** for unit tests
2. **Cypress** for end-to-end tests
3. **Supertest** for API testing

Example test structure:
```javascript
// Example Jest test
describe('Authentication', () => {
  test('should register new user', async () => {
    // Test implementation
  });
  
  test('should login existing user', async () => {
    // Test implementation
  });
});
```

This comprehensive testing guide ensures your User Authentication System is working correctly and securely.