const Lecture = require('../models/Lecture');
const Course = require('../models/Course');

// @desc    Add a lecture to a course (Admin)
// @route   POST /api/courses/:courseId/lectures
const addLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, videoUrl } = req.body;

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!title || !description || !videoUrl) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const lecture = await Lecture.create({ courseId, title, description, videoUrl });
    res.status(201).json({ success: true, data: lecture });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a lecture (Admin)
// @route   PUT /api/lectures/:id
const updateLecture = async (req, res) => {
  try {
    const updatedLecture = await Lecture.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedLecture) {
      return res.status(404).json({ success: false, message: 'Lecture not found' });
    }

    res.status(200).json({ success: true, data: updatedLecture });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a lecture (Admin)
// @route   DELETE /api/lectures/:id
const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ success: false, message: 'Lecture not found' });
    }

    await lecture.deleteOne();
    res.status(200).json({ success: true, message: 'Lecture deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting lecture' });
  }
};

module.exports = { addLecture, updateLecture, deleteLecture };
