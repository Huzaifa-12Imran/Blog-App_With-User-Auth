import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const BlogCard = ({ blog, onEdit, onDelete, onLike, showActions = true }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const isLiked = blog.likes?.some(like => like.user === user?.id);
  const isAuthor = blog.author?._id === user?.id || blog.author?.id === user?.id;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {blog.featuredImage && (
        <img 
          src={blog.featuredImage} 
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {blog.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span>By {blog.author?.username || 'Unknown'}</span>
              <span>•</span>
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              {blog.readTime > 0 && (
                <>
                  <span>•</span>
                  <span>{blog.readTime} min read</span>
                </>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(blog.status)}`}>
                {blog.status}
              </span>
            </div>
          )}
        </div>

        {/* Category and Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.category && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {blog.category}
            </span>
          )}
          {blog.tags?.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Excerpt or Content */}
        <div className="text-gray-700 mb-4">
          {blog.excerpt ? (
            <p className="text-sm leading-relaxed">{blog.excerpt}</p>
          ) : (
            <div>
              <p className="text-sm leading-relaxed">
                {isExpanded ? blog.content : truncateContent(blog.content)}
              </p>
              {blog.content.length > 200 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {blog.views || 0} views
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {blog.likes?.length || 0} likes
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {blog.comments?.length || 0} comments
          </span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              {/* Like Button */}
              {onLike && (
                <button
                  onClick={() => onLike(blog._id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isLiked ? 'Liked' : 'Like'}
                </button>
              )}
            </div>

            {/* Edit/Delete Actions (only for author) */}
            {isAuthor && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(blog)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(blog._id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;