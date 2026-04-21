const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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

// Mock volunteer data endpoint
app.get('/api/volunteers', (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'volunteer' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'volunteer' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'admin' }
    ]
  });
});

// Mock NGO data endpoint
app.get('/api/ngos', (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { id: 1, name: 'Help Foundation', category: 'Education', volunteers: 45 },
      { id: 2, name: 'Care Society', category: 'Healthcare', volunteers: 62 },
      { id: 3, name: 'Green Earth', category: 'Environment', volunteers: 38 }
    ]
  });
});

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
