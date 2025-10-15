const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Interview Experience Hub API',
  swaggerOptions: {
    persistAuthorization: true,
  }
}));

// Test routes
app.get('/', (req, res) => {
  res.json({
    message: 'Interview Experience Hub API - Test Mode',
    status: 'Running',
    version: '1.0.0',
    mode: 'TEST (No MongoDB)',
    endpoints: [
      'GET /api/experiences',
      'POST /api/experiences',
      'GET /api/experiences/:id',
      'PUT /api/experiences/:id/upvote',
      'GET /api/experiences/companies/popular'
    ],
    documentation: '/api-docs'
  });
});

// Mock API routes for testing
app.get('/api/experiences', (req, res) => {
  res.json({
    message: 'Mock endpoint - would return experiences from MongoDB',
    query: req.query,
    status: 'success'
  });
});

app.post('/api/experiences', (req, res) => {
  res.status(201).json({
    message: 'Mock endpoint - would create experience in MongoDB',
    data: req.body,
    status: 'success',
    _id: 'mock-id-123'
  });
});

app.get('/api/experiences/:id', (req, res) => {
  res.json({
    message: 'Mock endpoint - would return single experience',
    id: req.params.id,
    status: 'success'
  });
});

app.put('/api/experiences/:id/upvote', (req, res) => {
  res.json({
    message: 'Mock endpoint - would upvote experience',
    id: req.params.id,
    upvotes: Math.floor(Math.random() * 50) + 1,
    status: 'success'
  });
});

app.get('/api/experiences/companies/popular', (req, res) => {
  res.json([
    { _id: 'Google', count: 5, avgUpvotes: 15.2 },
    { _id: 'Microsoft', count: 3, avgUpvotes: 12.1 },
    { _id: 'Amazon', count: 4, avgUpvotes: 10.5 }
  ]);
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableRoutes: {
      experiences: '/api/experiences',
      documentation: '/api-docs',
      health: '/'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Test Server is running on port ${PORT}`);
  console.log(`📊 Mode: TEST (No MongoDB required)`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
  console.log(`🛡️  Security: Helmet and rate limiting enabled`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('🔒 Process terminated');
  });
});

module.exports = app;