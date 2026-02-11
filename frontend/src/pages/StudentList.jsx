import React, { useState, useEffect } from 'react';
import AddStudentModal from '../components/AddStudentModal';

const API_URL = 'http://localhost:5001/api/students';
const DEPT_API_URL = 'http://localhost:5001/api/departments';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ 
    name: '', 
    stud_id: '', 
    email: '', 
    course: '', 
    year_level: '',
    section: '',
    enrollment_status: 'Regular',
    date_of_birth: '',
    gender: '',
    contact_number: '',
    address: {
      street: '',
      city: '',
      province: '',
      postal_code: '',
      country: 'Philippines'
    },
    guardian_name: '',
    guardian_contact: '',
    guardian_relationship: '',
    date_enrolled: '',
    expected_graduation: ''
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(DEPT_API_URL);
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const departmentById = departments.reduce((acc, dept) => {
    acc[dept._id] = dept;
    return acc;
  }, {});

  const getDepartmentLabel = (departmentValue) => {
    if (!departmentValue) return '';
    const dept = departmentById[departmentValue];
    if (dept) return `${dept.code} - ${dept.name}`;
    return departmentValue;
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.stud_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDepartmentLabel(student.course).toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.year_level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.course) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editId) {
        // Update existing student
        const response = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          await fetchStudents();
          alert('Student updated successfully!');
        }
      } else {
        // Create new student
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          await fetchStudents();
          alert('Student added successfully!');
        }
      }
      
      setFormData({ name: '', stud_id: '', email: '', course: '', year_level: '' });
      setEditId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student');
    }
  };

  const handleEdit = (student) => {
    const matchedDepartment = departments.find(
      (dept) => dept._id === student.course || dept.name === student.course || dept.code === student.course
    );
    setFormData({ 
      name: student.name, 
      stud_id: student.stud_id,
      email: student.email, 
      course: matchedDepartment ? matchedDepartment._id : student.course, 
      year_level: student.year_level,
      section: student.section || '',
      enrollment_status: student.enrollment_status || 'Regular',
      date_of_birth: student.date_of_birth ? student.date_of_birth.split('T')[0] : '',
      gender: student.gender || '',
      contact_number: student.contact_number || '',
      address: student.address || { street: '', city: '', province: '', postal_code: '', country: 'Philippines' },
      guardian_name: student.guardian_name || '',
      guardian_contact: student.guardian_contact || '',
      guardian_relationship: student.guardian_relationship || '',
      date_enrolled: student.date_enrolled ? student.date_enrolled.split('T')[0] : '',
      expected_graduation: student.expected_graduation ? student.expected_graduation.split('T')[0] : '',
      scholarship: student.scholarship || ''
    });
  setEditId(student._id);
  setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchStudents();
        alert('Student deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', stud_id: '', email: '', course: '', year_level: ''});
    setEditId(null);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setFormData({ name: '', stud_id: '', email: '', course: '', year_level: '' });
    setEditId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Student Management System</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add New Student
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.stud_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getDepartmentLabel(student.course)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.year_level}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No matching students found.
              </div>
            )}
          </div>
        )}
      </div>
      
      <AddStudentModal
        isOpen={isModalOpen}
        formData={formData}
        setFormData={setFormData}
        departments={departments}
        editId={editId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default StudentList;
