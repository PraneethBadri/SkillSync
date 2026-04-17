const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// Configure Multer for PDF/DOCX uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + '-' + Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX formats are allowed!"), false);
    }
  }
});

// @route   POST api/upload-resume
// @desc    Upload resume and trigger AI extraction
// @access  Private
router.post('/', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a valid document' });
    }

    // In Phase 3, we would send this file to the Python AI Microservice
    // For now, we mock the AI extraction
    const mockExtractedSkills = ["React.js", "Node.js", "System Architecture", "Leadership"];
    
    // Save to user profile
    const user = await User.findById(req.user.id);
    user.resumeUrl = req.file.path;
    user.skills = mockExtractedSkills;
    user.profileStrength = 85; 
    await user.save();

    res.json({ 
      message: 'Resume uploaded and processed successfully', 
      skills: mockExtractedSkills,
      profileStrength: user.profileStrength
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
