# LMS - Simplified Learning Management System

A full-stack Learning Management System built with the MERN Stack (MongoDB, Express.js, React with TypeScript, Node.js) and Tailwind CSS.

<img width="1920" height="933" alt="screencapture-lms-project-foma-vercel-app-2026-11-14-11_45_27" src="https://github.com/user-attachments/assets/52654c79-c144-4b2a-8a4d-fa282204ce2a" />

## Live Demo

- **Frontend Live URL:** https://lms-project-foma.vercel.app/
- **Backend API URL:** https://lms-project-bice-seven.vercel.app

## Features

### Student Panel
- Browse all available courses fetched dynamically from MongoDB with thumbnail, title, description, and price.
- View detailed course information and associated lectures on the course details page.
- Watch lecture videos using an embedded YouTube player.
- Responsive interface with loading, empty, and 404 error states.

### Admin Dashboard
- Admin login using JWT authentication.
- Protected management routes for courses and lectures.
- Create, view, edit, and delete courses.
- Add, view, edit, and delete lectures under any selected course.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js (MVC Architecture)
- **Database:** MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT)

## Project Structure

```text
lms-project/
├── backend/
│   ├── config/          # Database connection (db.js)
│   ├── controllers/     # Route logic (auth, course, lecture)
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # Mongoose models (Course, Lecture)
│   ├── routes/          # API routes
│   ├── seed.js          # Initial seed data script
│   ├── .env.example     # Environment variables template
│   └── server.js        # Entry point
└── frontend/
    ├── src/
    │   ├── components/  # Navbar
    │   ├── pages/       # HomePage, CourseDetailsPage, AdminLoginPage, AdminDashboardPage
    │   ├── services/    # Axios setup with JWT interceptor
    │   ├── types/       # TypeScript interfaces
    │   └── utils/       # YouTube URL to embed URL helper
```

## Local Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/marium0908/lms-project.git
cd lms-project
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder (you can copy `.env.example`) and add the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@datapollex.com
ADMIN_PASSWORD=admin123
```

Seed the database with initial courses and lectures:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the `frontend` folder, and run:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## Admin Test Credentials

- **Email:** `admin@datapollex.com`
- **Password:** `admin123`
