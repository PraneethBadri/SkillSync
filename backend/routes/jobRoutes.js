const express = require('express');
const router = express.Router();
const { createJob, getJobs, applyToJob } = require('../controllers/jobController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/jobs
// @desc    Create a job (Recruiter only)
// @access  Private
router.post('/', auth, createJob);

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', getJobs);

// @route   POST api/jobs/:id/apply
// @desc    Apply to a specific job
// @access  Private
router.post('/:id/apply', auth, applyToJob);

module.exports = router;
