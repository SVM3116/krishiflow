require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routers & Controllers
const cropRouter = require('./routes/cropRoutes');
const farmRouter = require('./routes/farmRoutes');
const weatherRouter = require('./routes/weatherRoutes');
const pestRouter = require('./routes/pestRoutes');
const planRouter = require('./routes/planRoutes');
const planController = require('./controllers/planController');
const requireAuth = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware Setup
app.use(cors()); // Allow all cross-origins for frontend integration
app.use(express.json()); // Parse incoming JSON requests

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// GET /api/health - Check if server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    appName: 'KrishiFlow AI'
  });
});

// Import Controllers directly for route aliases
const farmController = require('./controllers/farmController');
const weatherController = require('./controllers/weatherController');
const pestController = require('./controllers/pestController');

// Mount Routes
app.use('/api/crop-pairs', cropRouter);
app.use('/api/analyze-farm', farmRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/pest-detect', pestRouter);
app.use('/api/plans', planRouter);

// Frontend-Specific API Route Aliases
app.post('/api/analyze', farmController.analyzeFarm);
app.get('/api/weather', weatherController.getWeatherByDistrict);
app.post('/api/pest', pestController.detectPest);

// Mount the income calendar endpoint directly on /api/income-calendar/:planId
app.get('/api/income-calendar/:planId', requireAuth, planController.getIncomeCalendar);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}. Route not found.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server. Please try again later.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Express Server
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`KrishiFlow AI Backend server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`Port: http://localhost:${PORT}`);
    console.log(`Health endpoint: http://localhost:${PORT}/api/health`);
    console.log(`==================================================`);
  });
}

module.exports = app;

