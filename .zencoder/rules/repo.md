---
description: Repository Information Overview
alwaysApply: true
---

# Student Manager Information

## Summary
Student Manager is a full-stack web application that allows users to manage student records. It provides CRUD operations (Create, Read, Update, Delete) for student data, with a Node.js/Express backend API connected to MongoDB and a React frontend with Tailwind CSS for styling.

## Structure
- **server/**: Backend server code
- **models/**: MongoDB data models
- **routes/**: API route definitions
- **config/**: Configuration files (database connection)
- **client/**: React frontend application (described in documentation)

## Language & Runtime
**Language**: JavaScript (Node.js)
**Version**: Node.js (version not specified)
**Build System**: npm
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- express ^5.1.0: Web server framework
- mongoose ^8.17.0: MongoDB ODM
- dotenv ^17.2.1: Environment variable management
- cors ^2.8.5: Cross-origin resource sharing middleware

**Frontend Dependencies** (from documentation):
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- tailwindcss: CSS framework

## Build & Installation
**Backend Setup**:
```bash
npm install
```

**Frontend Setup** (from documentation):
```bash
npx create-react-app client
cd client
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Database
**Type**: MongoDB
**Connection**: Local MongoDB instance or MongoDB Atlas
**Configuration**: Environment variables in .env file
**Models**: Student (name, rollNo, course)

## API Endpoints
**Base URL**: /api/students

- **POST /**: Create a new student
- **GET /**: Retrieve all students
- **GET /:id**: Retrieve a specific student
- **PUT /:id**: Update a student
- **DELETE /:id**: Delete a student

## Running the Application
**Start Backend**:
```bash
node server/server.js
```

**Start Frontend** (from documentation):
```bash
cd client
npm start
```