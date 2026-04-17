const Job = require('../models/Job');
const User = require('../models/User');

exports.createJob = async (req, res) => {
  try {
    // Only recruiters can create jobs
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied. Only recruiters can post jobs.' });
    }

    const { title, company, location, type, salary, description, requiredSkills } = req.body;

    const newJob = new Job({
      title,
      company,
      location,
      type,
      salary,
      description,
      requiredSkills,
      postedBy: req.user.id
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ date: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Check if user already applied
    const alreadyApplied = job.applicants.some(applicant => applicant.user.toString() === req.user.id);
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    job.applicants.push({ user: req.user.id });
    await job.save();

    // Update user appliedJobs array
    const user = await User.findById(req.user.id);
    user.appliedJobs.push(job.id);
    await user.save();

    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
