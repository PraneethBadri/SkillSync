const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true }, // e.g. Remote, Hybrid, On-site
  salary: { type: String, required: true },
  description: { type: String, required: true },
  industry: { type: String },
  logo: { type: String }, // url to company logo
  
  // Data for AI matching
  requiredSkills: [{ type: String }],
  
  // Recruiter reference
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Applicants mapping
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    matchScore: { type: Number },
    appliedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
