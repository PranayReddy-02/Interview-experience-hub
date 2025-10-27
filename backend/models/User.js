const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true }, // In production, hash this
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String, trim: true },
  linkedinProfile: { type: String, trim: true },
  degree: { type: String },
  branch: { type: String },
  college: { type: String },
  experience: { type: String, enum: ['Fresher', '0-3 Years', '3+ Years'] },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', UserSchema);
