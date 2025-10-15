const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');
require('dotenv').config();

// Import routes
const experienceRoutes = require('./routes/experiences');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

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

// API Routes
app.use('/api/experiences', experienceRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     description: Returns basic information about the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Interview Experience Hub API
 *                 status:
 *                   type: string
 *                   example: Running
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 endpoints:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["GET /api/experiences", "POST /api/experiences"]
 *                 documentation:
 *                   type: string
 *                   example: /api-docs
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Interview Experience Hub API',
    status: 'Running',
    version: '1.0.0',
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
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Database: MongoDB connected`);
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