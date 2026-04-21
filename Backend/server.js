const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const volunteerRoutes = require('./routes/volunteerRoutes');
const ngoRoutes = require('./routes/ngoRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to SevaConnect API',
    version: '1.0.0',
    description: 'Volunteer Management Platform Backend',
    endpoints: {
      health: '/health',
      test: '/api/test',
      volunteers: '/api/volunteers',
      ngos: '/api/ngos'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running successfully',
    timestamp: new Date().toISOString()
  });
});

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    data: {
      appName: 'SevaConnect',
      version: '1.0.0',
      description: 'Volunteer Management Platform'
    }
  });
});

// Use routes
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/ngos', ngoRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`👥 Volunteers: http://localhost:${PORT}/api/volunteers`);
  console.log(`🏢 NGOs: http://localhost:${PORT}/api/ngos`);
});

module.exports = app;
