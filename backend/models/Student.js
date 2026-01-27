const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  stud_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  // Academic Information
  course: {
    type: String,
    required: true,
    trim: true
  },
  year_level: {
    type: String,
    required: true,
    trim: true
  },
  section: {
    type: String,
    trim: true
  },
  enrollment_status: {
    type: String,
    enum: ['Regular', 'Irregular', 'LOA', 'Graduated', 'Dropped'],
    default: 'Regular'
  },
  
  // Personal Information
  date_of_birth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  contact_number: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    province: String,
    postal_code: String,
    country: { type: String, default: 'Philippines' }
  },
  
  // Guardian Information
  guardian_name: {
    type: String,
    trim: true
  },
  guardian_contact: {
    type: String,
    trim: true
  },
  guardian_relationship: {
    type: String,
    trim: true
  },
  
  // Enrollment Information
  date_enrolled: {
    type: Date,
    default: Date.now
  },
  expected_graduation: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);