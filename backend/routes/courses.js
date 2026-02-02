const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Department = require('../models/Department');

// @route   GET /api/courses
// @desc    Get all courses with department info
// @access  Public
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('department', 'name code')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('department', 'name code');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
});

// @route   GET /api/courses/department/:departmentId
// @desc    Get all courses by department
// @access  Public
router.get('/department/:departmentId', async (req, res) => {
  try {
    const courses = await Course.find({ department: req.params.departmentId })
      .populate('department', 'name code')
      .sort({ year_level: 1, semester: 1 });
    
    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses by department:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
});

// @route   POST /api/courses
// @desc    Create new course
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { 
      course_code, 
      course_name, 
      description, 
      department, 
      credits,
      semester,
      year_level,
      prerequisites 
    } = req.body;

    // Validation
    if (!course_code || !course_name || !department) {
      return res.status(400).json({
        success: false,
        message: 'Course code, course name, and department are required'
      });
    }

    // Check if department exists
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if course code already exists
    const existingCourse = await Course.findOne({ course_code: course_code.toUpperCase() });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: 'Course with this code already exists'
      });
    }

    const course = await Course.create({
      course_code: course_code.toUpperCase(),
      course_name,
      description,
      department,
      credits,
      semester,
      year_level,
      prerequisites
    });

    // Populate department info before sending response
    await course.populate('department', 'name code');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { 
      course_code, 
      course_name, 
      description, 
      department, 
      credits,
      semester,
      year_level,
      prerequisites,
      status 
    } = req.body;

    // Check if course exists
    let course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // If department is being updated, check if it exists
    if (department && department !== course.department.toString()) {
      const departmentExists = await Department.findById(department);
      if (!departmentExists) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }
    }

    // Check if updating to an existing course code (excluding current course)
    if (course_code && course_code.toUpperCase() !== course.course_code) {
      const existingCourse = await Course.findOne({
        _id: { $ne: req.params.id },
        course_code: course_code.toUpperCase()
      });

      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: 'Course with this code already exists'
        });
      }
    }

    // Update fields
    const updateData = {
      ...(course_code && { course_code: course_code.toUpperCase() }),
      ...(course_name && { course_name }),
      ...(description !== undefined && { description }),
      ...(department && { department }),
      ...(credits !== undefined && { credits }),
      ...(semester && { semester }),
      ...(year_level && { year_level }),
      ...(prerequisites !== undefined && { prerequisites }),
      ...(status && { status })
    };

    course = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('department', 'name code');

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Error updating course:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
});

// @route   GET /api/courses/search/:query
// @desc    Search courses by code or name
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const courses = await Course.find({
      $or: [
        { course_code: { $regex: query, $options: 'i' } },
        { course_name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('department', 'name code')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching courses',
      error: error.message
    });
  }
});

module.exports = router;