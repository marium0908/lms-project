const Course = require('../models/Course');
const Lecture = require('../models/Lecture');

// @desc    Get all courses
// @route   GET /api/courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching courses' });
  }
};

// @desc    Get single course along with its lectures
// @route   GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const lectures = await Lecture.find({ courseId: course._id }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: { course, lectures } });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(500).json({ success: false, message: 'Server error fetching course details' });
  }
};

// @desc    Create a new course (Admin)
// @route   POST /api/courses
const createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnailUrl } = req.body;

    if (!title || !description || price === undefined || !thumbnailUrl) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newCourse = await Course.create({ title, description, price, thumbnailUrl });
    res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a course (Admin)
// @route   PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a course & its lectures (Admin)
// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await Lecture.deleteMany({ courseId: course._id });
    await course.deleteOne();

    res.status(200).json({ success: true, message: 'Course and associated lectures deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting course' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
