const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  name: { type: String },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  year: { type: String, default: '' },
  faculty: { type: String, default: '' },
  awards: [{
    title: String,
    year: String,
    description: String,
  }],
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema); 