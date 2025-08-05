import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import StudentForm from '../components/StudentForm';
import StudentCard from '../components/StudentCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/api/students');
      if (res.data.success) {
        setStudents(res.data.data);
      } else {
        setError(res.data.message || 'Failed to fetch students');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch students. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const res = await axios.delete(`/api/students/${id}`);
      if (res.data.success) {
        fetchStudents();
      } else {
        setError(res.data.message || 'Failed to delete student');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete student');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Welcome to Student Manager, {user?.username}! 🎓
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your student records efficiently and securely
            </p>
            <div className="flex justify-center items-center space-x-4 mt-4">
              <div className="bg-blue-50 px-4 py-2 rounded-full">
                <span className="text-blue-700 font-medium">Role: {user?.role}</span>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-full">
                <span className="text-green-700 font-medium">Status: Active</span>
              </div>
            </div>
          </div>
        </div>

        <StudentForm 
          fetchStudents={fetchStudents} 
          editingStudent={editingStudent}
          setEditingStudent={setEditingStudent} 
        />
        
        {/* Get All Students Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">📋 All Students</h2>
              <p className="text-gray-600">
                {students.length === 0 ? 'No students registered yet' : `${students.length} student${students.length !== 1 ? 's' : ''} registered`}
              </p>
            </div>
            <button 
              onClick={fetchStudents}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Refresh Students</span>
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <span className="text-2xl">⏳</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Students...</h3>
              <p className="text-gray-500">Please wait while we fetch the student data.</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">❌</span>
              </div>
              <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Students</h3>
              <p className="text-red-500 mb-6">{error}</p>
              <button 
                onClick={fetchStudents}
                className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Students Yet</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first student above!</p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-blue-700 text-sm">
                  💡 <strong>Tip:</strong> Use the form above to add students with their name, age, and email address.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {students.map((student, index) => (
                <div key={student._id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <StudentCard 
                    student={student} 
                    onDelete={deleteStudent}
                    onEdit={setEditingStudent} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}