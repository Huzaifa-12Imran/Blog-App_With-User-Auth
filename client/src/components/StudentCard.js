export default function StudentCard({ student, onDelete, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {student.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
              <p className="text-gray-500 text-sm">Student ID: {student._id.slice(-6)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm">🎂</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Age</p>
                <p className="font-semibold text-gray-800">{student.age} years old</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm">📧</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                <p className="font-semibold text-gray-800 text-sm break-all">{student.email}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">
          <button 
            onClick={() => onEdit(student)} 
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <span>✏️</span>
            <span>Edit</span>
          </button>
          <button 
            onClick={() => onDelete(student._id)} 
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <span>🗑️</span>
            <span>Delete</span>
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Created: {new Date(student.createdAt).toLocaleDateString()}</span>
          <span>Updated: {new Date(student.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}