import React from 'react';

const AddStudentModal = ({
  isOpen,
  formData,
  setFormData,
  editId,
  onSubmit,
  onCancel
}) => {
  if (!isOpen) return null;

  const handleAddressChange = (field, value) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [field]: value
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl my-8 mx-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {editId ? 'Edit Student' : 'Add New Student'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto px-2">
          {/* Basic Information Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Basic Information</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Juan Dela Cruz"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="22-00000"
              value={formData.stud_id || ''}
              onChange={(e) => setFormData({ ...formData, stud_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="juan@gmail.com"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              placeholder="+63 912 345 6789"
              value={formData.contact_number || ''}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.date_of_birth || ''}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={formData.gender || ''}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Academic Information Section */}
          <div className="col-span-2 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Academic Information</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="BSCS"
              value={formData.course || ''}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Level <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.year_level || ''}
              onChange={(e) => setFormData({ ...formData, year_level: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Year Level</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="5th Year">5th Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <input
              type="text"
              placeholder="A"
              value={formData.section || ''}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enrollment Status
            </label>
            <select
              value={formData.enrollment_status || 'Regular'}
              onChange={(e) => setFormData({ ...formData, enrollment_status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Regular">Regular</option>
              <option value="Irregular">Irregular</option>
              <option value="LOA">Leave of Absence</option>
              <option value="Graduated">Graduated</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Enrolled
            </label>
            <input
              type="date"
              value={formData.date_enrolled || ''}
              onChange={(e) => setFormData({ ...formData, date_enrolled: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Graduation
            </label>
            <input
              type="date"
              value={formData.expected_graduation || ''}
              onChange={(e) => setFormData({ ...formData, expected_graduation: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Address Section */}
          <div className="col-span-2 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Address</h3>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              placeholder="123 Main Street"
              value={formData.address?.street || ''}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              placeholder="Quezon City"
              value={formData.address?.city || ''}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <input
              type="text"
              placeholder="Metro Manila"
              value={formData.address?.province || ''}
              onChange={(e) => handleAddressChange('province', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              placeholder="1100"
              value={formData.address?.postal_code || ''}
              onChange={(e) => handleAddressChange('postal_code', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Guardian Information Section */}
          <div className="col-span-2 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Guardian Information</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guardian Name
            </label>
            <input
              type="text"
              placeholder="Maria Dela Cruz"
              value={formData.guardian_name || ''}
              onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guardian Contact
            </label>
            <input
              type="text"
              placeholder="+63 912 345 6789"
              value={formData.guardian_contact || ''}
              onChange={(e) => setFormData({ ...formData, guardian_contact: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <input
              type="text"
              placeholder="Mother"
              value={formData.guardian_relationship || ''}
              onChange={(e) => setFormData({ ...formData, guardian_relationship: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onSubmit}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium"
          >
            {editId ? 'Update Student' : 'Add Student'}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;