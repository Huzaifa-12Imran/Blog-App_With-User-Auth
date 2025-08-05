export default function StudentCard({ student, onDelete, onEdit }) {
  return (
    <div className="card-hover p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-medium">
              {student.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
              <p className="text-gray-500 text-sm">Student ID: {student._id.slice(-6)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Age</p>
                <p className="font-semibold text-gray-800">{student.age} years old</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
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
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-1 shadow-soft hover:shadow-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>
          <button 
            onClick={() => onDelete(student._id)} 
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-1 shadow-soft hover:shadow-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
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