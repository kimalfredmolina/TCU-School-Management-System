const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  course_code: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  course_name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  credits: {
    type: Number,
    min: 0,
    default: 3
  },
  semester: {
    type: String,
    enum: ['1st Semester', '2nd Semester', 'Summer'],
    default: '1st Semester'
  },
  year_level: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    default: '1st Year'
  },
  prerequisites: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for faster queries
courseSchema.index({ course_code: 1, department: 1 });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;