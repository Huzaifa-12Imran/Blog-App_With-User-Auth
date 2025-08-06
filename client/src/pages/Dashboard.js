import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import BlogForm from '../components/BlogForm';
import BlogCard from '../components/BlogCard';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, published, draft, archived

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:5000';
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/api/blogs');
      if (res.data.success) {
        setBlogs(res.data.data.blogs || []);
      } else {
        setError(res.data.message || 'Failed to fetch blogs');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch blogs. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBlog = async (blogData) => {
    try {
      setFormLoading(true);
      setError(null);
      
      let res;
      if (editingBlog) {
        res = await axios.put(`/api/blogs/${editingBlog._id}`, blogData);
      } else {
        res = await axios.post('/api/blogs', blogData);
      }

      if (res.data.success) {
        await fetchBlogs();
        setShowForm(false);
        setEditingBlog(null);
      } else {
        setError(res.data.message || 'Failed to save blog');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save blog');
    } finally {
      setFormLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const res = await axios.delete(`/api/blogs/${id}`);
      if (res.data.success) {
        await fetchBlogs();
      } else {
        setError(res.data.message || 'Failed to delete blog');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete blog');
    }
  };

  const handleLikeBlog = async (id) => {
    try {
      const res = await axios.post(`/api/blogs/${id}/like`);
      if (res.data.success) {
        await fetchBlogs();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to like blog');
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  const filteredBlogs = blogs.filter(blog => {
    if (filter === 'all') return true;
    return blog.status === filter;
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Your Blog, {user?.username}!
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Create, manage, and share your thoughts with the world
            </p>
            <div className="flex justify-center items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Role: {user?.role}
              </div>
              <div className="flex items-center text-sm text-green-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status: Active
              </div>
            </div>
          </div>
        </div>

        {/* Blog Form */}
        {showForm && (
          <div className="mb-8">
            <BlogForm 
              blog={editingBlog}
              onSubmit={handleSubmitBlog}
              onCancel={handleCancelForm}
              isLoading={formLoading}
            />
          </div>
        )}

        {/* Blog List */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
            <div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">My Blog Posts</h2>
                  <p className="text-gray-600">
                    {filteredBlogs.length === 0 ? 'No blog posts yet' : (
                      <>Total posts: <span className="font-semibold text-purple-600">{filteredBlogs.length}</span></>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Filter Dropdown */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Posts</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="archived">Archived</option>
              </select>

              {/* Action Buttons */}
              <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>{showForm ? 'Cancel' : 'New Post'}</span>
              </button>
              
              <button 
                onClick={fetchBlogs}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Blog Posts...</h3>
              <p className="text-gray-600">Please wait while we fetch your blog posts.</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Blog Posts Yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first blog post!</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredBlogs.map((blog, index) => (
                <div key={blog._id} className="opacity-0 animate-fade-in" style={{animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards'}}>
                  <BlogCard 
                    blog={blog} 
                    onDelete={deleteBlog}
                    onEdit={handleEditBlog}
                    onLike={handleLikeBlog}
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