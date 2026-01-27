const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create student
router.post('/', async (req, res) => {
  try {
    const studentData = {
      name: req.body.name,
      stud_id: req.body.stud_id,
      email: req.body.email,
      course: req.body.course,
      year_level: req.body.year_level,
    };

    // Academic fields
    if (req.body.section) studentData.section = req.body.section;
    if (req.body.enrollment_status) studentData.enrollment_status = req.body.enrollment_status;

    // Optional personal fields
    if (req.body.date_of_birth) studentData.date_of_birth = req.body.date_of_birth;
    if (req.body.gender) studentData.gender = req.body.gender;
    if (req.body.contact_number) studentData.contact_number = req.body.contact_number;

    // Address
    if (req.body.address && (req.body.address.street || req.body.address.city || 
        req.body.address.province || req.body.address.postal_code)) {
      studentData.address = {
        street: req.body.address.street || '',
        city: req.body.address.city || '',
        province: req.body.address.province || '',
        postal_code: req.body.address.postal_code || '',
        country: req.body.address.country || 'Philippines'
      };
    }

    // Guardian fields
    if (req.body.guardian_name) studentData.guardian_name = req.body.guardian_name;
    if (req.body.guardian_contact) studentData.guardian_contact = req.body.guardian_contact;
    if (req.body.guardian_relationship) studentData.guardian_relationship = req.body.guardian_relationship;

    // Enrollment fields
    if (req.body.date_enrolled) studentData.date_enrolled = req.body.date_enrolled;
    if (req.body.expected_graduation) studentData.expected_graduation = req.body.expected_graduation;

    const student = new Student(studentData);
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ message: `A student with this ${field} already exists` });
    } else if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// PUT update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Basic Information
    if (req.body.name) student.name = req.body.name;
    if (req.body.stud_id) student.stud_id = req.body.stud_id;
    if (req.body.email) student.email = req.body.email;
    
    // Academic Information
    if (req.body.course) student.course = req.body.course;
    if (req.body.year_level) student.year_level = req.body.year_level;
    if (req.body.section !== undefined) student.section = req.body.section;
    if (req.body.enrollment_status) student.enrollment_status = req.body.enrollment_status;
    
    // Personal Information
    if (req.body.date_of_birth !== undefined) student.date_of_birth = req.body.date_of_birth || undefined;
    if (req.body.gender !== undefined) student.gender = req.body.gender;
    if (req.body.contact_number !== undefined) student.contact_number = req.body.contact_number;
    
    // Address
    if (req.body.address) {
      if (!student.address) student.address = {};
      student.address = {
        street: req.body.address.street || '',
        city: req.body.address.city || '',
        province: req.body.address.province || '',
        postal_code: req.body.address.postal_code || '',
        country: req.body.address.country || 'Philippines'
      };
    }
    
    // Guardian Information
    if (req.body.guardian_name !== undefined) student.guardian_name = req.body.guardian_name;
    if (req.body.guardian_contact !== undefined) student.guardian_contact = req.body.guardian_contact;
    if (req.body.guardian_relationship !== undefined) student.guardian_relationship = req.body.guardian_relationship;
    
    // Enrollment Information
    if (req.body.date_enrolled !== undefined) student.date_enrolled = req.body.date_enrolled || undefined;
    if (req.body.expected_graduation !== undefined) student.expected_graduation = req.body.expected_graduation || undefined;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ message: `A student with this ${field} already exists` });
    } else if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.deleteOne();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;