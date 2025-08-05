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
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {editingStudent ? '✏️ Edit Student' : '➕ Add New Student'}
        </h2>
        <p className="text-gray-600">
          {editingStudent ? 'Update student information below' : 'Fill in the details to add a new student'}
        </p>
      </div>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="e.g., Reginald Pemberton"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
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
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
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
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          {editingStudent && (
            <button 
              type="button"
              onClick={() => setEditingStudent(null)}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <span>{editingStudent ? '✏️ Update' : '➕ Add'} Student</span>
          </button>
        </div>
      </form>
    </div>
  );
}