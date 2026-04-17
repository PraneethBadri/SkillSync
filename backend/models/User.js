const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['seeker', 'recruiter'], required: true },
  
  // Seeker Specific Profile Data
  skills: [{ type: String }],
  experience: [{
    title: String,
    company: String,
    years: Number
  }],
  education: [{
    degree: String,
    institution: String
  }],
  resumeUrl: { type: String }, // path to stored resume
  profileStrength: { type: Number, default: 0 },
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
