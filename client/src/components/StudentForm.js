import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentForm({ fetchStudents, editingStudent, setEditingStudent }) {
  const [formData, setFormData] = useState({ name: '', age: '', email: '' });

  useEffect(() => {
    if (editingStudent) setFormData(editingStudent);
  }, [editingStudent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent?._id) {
        const res = await axios.put(`/api/students/${editingStudent._id}`, formData);
        if (res.data.success) {
          setEditingStudent(null);
        }
      } else {
        const res = await axios.post('/api/students', formData);
        if (res.data.success) {
          // Success handled below
        }
      }
      setFormData({ name: '', age: '', email: '' });
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'An error occurred while saving the student');
    }
  };

  return (
    <div className="card shadow-strong p-8 mb-8">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-medium ${
            editingStudent ? 'bg-gradient-to-r from-orange-500 to-amber-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'
          }`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {editingStudent ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              )}
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold gradient-text">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            <p className="text-gray-600">
              {editingStudent ? 'Update student information below' : 'Fill in the details to add a new student'}
            </p>
          </div>
        </div>
      </div>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="e.g., John Doe"
              className="input-field" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Age</label>
            <input 
              name="age" 
              value={formData.age} 
              onChange={handleChange} 
              placeholder="e.g., 20"
              type="number"
              min="16"
              max="100"
              className="input-field" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <input 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="e.g., student@university.edu"
              type="email"
              className="input-field" 
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          {editingStudent && (
            <button 
              type="button"
              onClick={() => setEditingStudent(null)}
              className="btn-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          )}
          <button 
            type="submit"
            className={editingStudent ? "btn-primary bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700" : "btn-success"}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {editingStudent ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              )}
            </svg>
            {editingStudent ? 'Update' : 'Add'} Student
          </button>
        </div>
      </form>
    </div>
  );
}