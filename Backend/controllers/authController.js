// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'your_secret_key_here',
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

// ─── VOLUNTEER REGISTRATION ──────────────────────────────────────────
exports.registerVolunteer = async (req, res) => {
  try {
    const { email, password, name, phone, skills, availability, city, location } = req.body;

    // Validation
    if (!email || !password || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, name, and phone are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new volunteer
    const newVolunteer = new User({
      email,
      password,
      name,
      phone,
      role: 'volunteer',
      skills: skills || [],
      availability: availability || 'flexible',
      city: city || location || ''
    });

    // Save to database (password will be hashed by pre-save middleware)
    await newVolunteer.save();

    // Generate token
    const token = generateToken(newVolunteer);

    res.status(201).json({
      success: true,
      message: 'Volunteer registered successfully',
      token,
      user: newVolunteer.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering volunteer',
      error: error.message
    });
  }
};

// ─── VOLUNTEER LOGIN ──────────────────────────────────────────────────
exports.loginVolunteer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user with password field included
    const user = await User.findOne({ email, role: 'volunteer' }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// ─── NGO REGISTRATION ──────────────────────────────────────────────────
exports.registerNGO = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      phone,
      organizationName,
      organizationDescription,
      registrationNumber
    } = req.body;

    // Validation
    if (!email || !password || !name || !phone || !organizationName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, name, phone, and organization name are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new NGO
    const newNGO = new User({
      email,
      password,
      name,
      phone,
      role: 'ngo',
      organizationName,
      organizationDescription: organizationDescription || '',
      registrationNumber: registrationNumber || '',
      isApproved: false
    });

    // Save to database
    await newNGO.save();

    // Generate token
    const token = generateToken(newNGO);

    res.status(201).json({
      success: true,
      message: 'NGO registered successfully. Awaiting admin approval.',
      token,
      user: newNGO.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering NGO',
      error: error.message
    });
  }
};

// ─── NGO LOGIN ──────────────────────────────────────────────────────
exports.loginNGO = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user with password field included
    const user = await User.findOne({ email, role: 'ngo' }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if NGO is approved
    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'NGO is not approved yet. Please wait for admin approval.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'NGO login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // For demo: hardcoded admin credentials
    // In production, this would be in database
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sevaconnect.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Simple password check for demo (use bcrypt in production)
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create admin user object
    const adminUser = {
      email,
      name: 'Admin',
      role: 'admin',
      id: 'admin_1'
    };

    // Generate token
    const token = generateToken(adminUser);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: adminUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// ─── LOGOUT ──────────────────────────────────────────────────────
exports.logout = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful. Please clear your token from client side.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message
    });
  }
};

// ─── GET ALL USERS (For testing/debugging) ──────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};


