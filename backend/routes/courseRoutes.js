const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { addLecture } = require('../controllers/lectureController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected Admin Routes
router.post('/', protectAdmin, createCourse);
router.put('/:id', protectAdmin, updateCourse);
router.delete('/:id', protectAdmin, deleteCourse);

// Add lecture to a specific course
router.post('/:courseId/lectures', protectAdmin, addLecture);

module.exports = router;
