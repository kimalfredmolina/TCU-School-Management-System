import React from 'react';

const AddDepartmentModal = ({
  isOpen,
  formData,
  setFormData,
  editId,
  onSubmit,
  onCancel
}) => {
  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl my-8 mx-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {editId ? 'Edit Department' : 'Add New Department'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto px-2">
          {/* Department Information Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Department Information</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Collage of Information Technology"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="CICT"
              value={formData.code || ''}
              onChange={(e) => handleInputChange('code', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Brief description of the department..."
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Department Head Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Department Head</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Head Name
            </label>
            <input
              type="text"
              placeholder="Dr. Juan Dela Cruz"
              value={formData.head_name || ''}
              onChange={(e) => handleInputChange('head_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Head Email
            </label>
            <input
              type="email"
              placeholder="head@tcu.edu.ph"
              value={formData.head_email || ''}
              onChange={(e) => handleInputChange('head_email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Head Contact Number
            </label>
            <input
              type="text"
              placeholder="+63 912 345 6789"
              value={formData.head_contact || ''}
              onChange={(e) => handleInputChange('head_contact', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 mt-6 border-t pt-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {editId ? 'Update Department' : 'Add Department'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
