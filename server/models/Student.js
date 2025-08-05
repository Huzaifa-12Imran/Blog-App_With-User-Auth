const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  email: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
