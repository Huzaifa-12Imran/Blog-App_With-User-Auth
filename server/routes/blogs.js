const express = require('express');
const Blog = require('../models/Blog');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all published blogs (public route)
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tags, search } = req.query;
    const query = { status: 'published' };

    // Add filters
    if (category) {
      query.category = new RegExp(category, 'i');
    }

    if (tags) {
      query.tags = { $in: tags.split(',').map(tag => tag.trim()) };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-comments'); // Exclude comments for performance

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get public blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching blogs'
    });
  }
});

// Get single blog by ID (public route)
router.get('/public/:id', async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'username')
      .populate('comments.user', 'username');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      data: { blog }
    });

  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching blog'
    });
  }
});

// Get all blogs for authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { author: req.user._id };

    if (status) {
      query.status = status;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching blogs'
    });
  }
});

// Create new blog
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, excerpt, tags, category, status, featuredImage } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const blog = new Blog({
      title,
      content,
      excerpt,
      author: req.user._id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      category: category || 'General',
      status: status || 'draft',
      featuredImage
    });

    await blog.save();
    await blog.populate('author', 'username');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: { blog }
    });

  } catch (error) {
    console.error('Create blog error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating blog'
    });
  }
});

// Update blog
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, excerpt, tags, category, status, featuredImage } = req.body;
    
    const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found or you are not authorized to update it'
      });
    }

    // Update fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (tags !== undefined) blog.tags = tags.split(',').map(tag => tag.trim());
    if (category) blog.category = category;
    if (status) blog.status = status;
    if (featuredImage !== undefined) blog.featuredImage = featuredImage;

    await blog.save();
    await blog.populate('author', 'username');

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: { blog }
    });

  } catch (error) {
    console.error('Update blog error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating blog'
    });
  }
});

// Delete blog
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ 
      _id: req.params.id, 
      author: req.user._id 
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found or you are not authorized to delete it'
      });
    }

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting blog'
    });
  }
});

// Like/Unlike blog
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const existingLike = blog.likes.find(like => 
      like.user.toString() === req.user._id.toString()
    );

    if (existingLike) {
      // Unlike
      blog.likes = blog.likes.filter(like => 
        like.user.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      blog.likes.push({ user: req.user._id });
    }

    await blog.save();

    res.json({
      success: true,
      message: existingLike ? 'Blog unliked' : 'Blog liked',
      data: { 
        liked: !existingLike,
        likesCount: blog.likes.length 
      }
    });

  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing like'
    });
  }
});

// Add comment to blog
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    blog.comments.push({
      user: req.user._id,
      content
    });

    await blog.save();
    await blog.populate('comments.user', 'username');

    const newComment = blog.comments[blog.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: newComment }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding comment'
    });
  }
});

// Delete comment
router.delete('/:id/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const comment = blog.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Only comment author or blog author can delete comment
    if (comment.user.toString() !== req.user._id.toString() && 
        blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    blog.comments.pull(req.params.commentId);
    await blog.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting comment'
    });
  }
});

module.exports = router;