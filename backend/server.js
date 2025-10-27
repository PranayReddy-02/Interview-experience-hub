const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const experienceRoutes = require('./routes/experiences');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const { errorHandler } = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const packageJson = require('./package.json'); // For version info

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet()); // Apply basic security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200', // Restrict to your frontend URL
  credentials: true,
}));



// Rate Limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api', limiter); // Apply rate limiting to all API routes

// Body Parsers - This is the crucial fix
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Interview Experience Hub API',
    status: 'Running',
    version: packageJson.version || '1.0.0',
    documentation: '/api-docs'
  });
});
app.use('/api/experiences', experienceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// Setup Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Interview Experience Hub API'
}));

// Handle 404 - Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('🔒 Process terminated');
    process.exit(0);
  });
});
