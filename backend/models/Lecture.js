const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Lecture title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Lecture description is required'],
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lecture', lectureSchema);
