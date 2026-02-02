import React, { useState, useEffect } from 'react';
import AddCourseModal from '../components/AddCourseModal';

const API_URL = 'http://localhost:5000/api/courses';
const DEPT_API_URL = 'http://localhost:5000/api/departments';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    description: '',
    department: '',
    credits: 3,
    semester: '1st Semester',
    year_level: '1st Year',
    prerequisites: ''
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch courses and departments on mount
  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = filterDepartment === '' || course.department._id === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleSubmit = async () => {
    if (!formData.course_code || !formData.course_name || !formData.department) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editId) {
        // Update existing course
        const response = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
          await fetchCourses();
          alert('Course updated successfully!');
        } else {
          alert(result.message || 'Failed to update course');
        }
      } else {
        // Create new course
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
          await fetchCourses();
          alert('Course added successfully!');
        } else {
          alert(result.message || 'Failed to add course');
        }
      }

      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course: ' + error.message);
    }
  };

  const handleEdit = (course) => {
    setFormData({
      course_code: course.course_code,
      course_name: course.course_name,
      description: course.description,
      department: course.department._id,
      credits: course.credits,
      semester: course.semester,
      year_level: course.year_level,
      prerequisites: course.prerequisites
    });
    setEditId(course._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchCourses();
        alert('Course deleted successfully!');
      } else {
        alert('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const resetForm = () => {
    setFormData({
      course_code: '',
      course_name: '',
      description: '',
      department: '',
      credits: 3,
      semester: '1st Semester',
      year_level: '1st Year',
      prerequisites: ''
    });
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading courses...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-blue-950 text-4xl font-bold">Course List</h1>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          + Add Course
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search by course code, name, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.code} - {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        {filteredCourses.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 border-b-2 border-blue-300">
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-950">Course Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-950">Course Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-950">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-950">Year Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-950">Semester</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-blue-950">Credits</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-blue-950">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course._id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                  <td className="px-6 py-4 text-gray-800 font-semibold">{course.course_code}</td>
                  <td className="px-6 py-4 text-gray-800">{course.course_name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                      {course.department.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{course.year_level}</td>
                  <td className="px-6 py-4 text-gray-600">{course.semester}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{course.credits}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-blue-600 hover:text-blue-800 font-semibold mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">
            {searchTerm || filterDepartment 
              ? 'No courses found matching your filters.' 
              : 'No courses available. Click "Add Course" to create one.'}
          </div>
        )}
      </div>

      {/* Add/Edit Course Modal */}
      <AddCourseModal
        isOpen={isModalOpen}
        formData={formData}
        setFormData={setFormData}
        departments={departments}
        editId={editId}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />
    </div>
  );
};

export default CourseList;