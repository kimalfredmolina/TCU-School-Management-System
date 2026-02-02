import React, { useState, useEffect } from 'react';
import AddDepartmentModal from '../components/AddDepartmentModal';

const API_URL = 'http://localhost:5000/api/departments';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ 
    name: '', 
    code: '', 
    description: '', 
    head_name: '',
    head_email: '',
    head_contact: ''
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!formData.name || !formData.code) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editId) {
        // Update existing department
        const response = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          await fetchDepartments();
          alert('Department updated successfully!');
        } else {
          alert('Failed to update department');
        }
      } else {
        // Create new department
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          await fetchDepartments();
          alert('Department added successfully!');
        } else {
          alert('Failed to add department');
        }
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving department:', error);
      alert('Failed to save department');
    }
  };

  const handleEdit = (dept) => {
    setFormData(dept);
    setEditId(dept._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchDepartments();
        alert('Department deleted successfully!');
      } else {
        alert('Failed to delete department');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Failed to delete department');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', description: '', head_name: '', head_email: '', head_contact: '' });
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading departments...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-blue-950 text-4xl font-bold">Department List</h1>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          + Add Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by department name, code, or head name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Departments Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        {filteredDepartments.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 border-b-2 border-blue-300">
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-950">Department Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-950">Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-950">Head</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-950">Email</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-blue-950">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept) => (
                <tr key={dept._id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                  <td className="px-6 py-4 text-gray-800">{dept.name}</td>
                  <td className="px-6 py-4 text-gray-600">{dept.code}</td>
                  <td className="px-6 py-4 text-gray-600">{dept.head_name || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600">{dept.head_email || 'N/A'}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="text-blue-600 hover:text-blue-800 font-semibold mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id)}
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
            {searchTerm ? 'No departments found matching your search.' : 'No departments available. Click "Add Department" to create one.'}
          </div>
        )}
      </div>

      {/* Add/Edit Department Modal */}
      <AddDepartmentModal
        isOpen={isModalOpen}
        formData={formData}
        setFormData={setFormData}
        editId={editId}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />
    </div>
  );
};

export default DepartmentList;
