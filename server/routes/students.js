const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

router.post('/', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: newStudent
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: 'Error creating student',
      error: err.message 
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json({
      success: true,
      message: 'Students retrieved successfully',
      data: students
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving students',
      error: err.message 
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.json({
      success: true,
      message: 'Student retrieved successfully',
      data: student
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving student',
      error: err.message 
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.json({
      success: true,
      message: 'Student updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: 'Error updating student',
      error: err.message 
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.json({ 
      success: true,
      message: "Student deleted successfully" 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: 'Error deleting student',
      error: err.message 
    });
  }
});

module.exports = router;
