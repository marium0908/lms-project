require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Lecture = require('./models/Lecture');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Course.deleteMany();
    await Lecture.deleteMany();

    const course1 = await Course.create({
      title: 'Full-Stack MERN Development Bootcamp',
      description: 'Learn MongoDB, Express, React, and Node.js from scratch with real-world industrial projects.',
      price: 4500,
      thumbnailUrl: 'https://unsplash.com',
    });

    const course2 = await Course.create({
      title: 'REST API & Backend Architecture Masterclass',
      description: 'Master MVC architecture, JWT authentication, database modeling, and error handling.',
      price: 3000,
      thumbnailUrl: 'https://unsplash.com',
    });

    await Lecture.insertMany([
      {
        courseId: course1._id,
        title: '1. Introduction to MERN Stack & Setup',
        description: 'Setting up Node.js, VS Code, and understanding client-server architecture.',
        videoUrl: 'https://youtube.com',
      },
      {
        courseId: course1._id,
        title: '2. Building REST APIs with Express.js',
        description: 'Creating routes, controllers, and handling HTTP status codes properly.',
        videoUrl: 'https://youtube.com',
      },
      {
        courseId: course2._id,
        title: '1. Understanding MVC Design Pattern',
        description: 'How to separate Models, Views, and Controllers for clean scalable code.',
        videoUrl: 'https://youtube.com',
      },
    ]);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
