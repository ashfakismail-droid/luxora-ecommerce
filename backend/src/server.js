const app = require('./app');
const { log } = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  log(`🚀 Luxora API server running on port ${PORT}`);
  log(`📊 Health check: http://localhost:${PORT}/api/health`);
  log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  log(`🔐 Supabase configured: ${!!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    log('Process terminated');
    process.exit(0);
  });
});

// Unhandled rejections
process.on('unhandledRejection', (err) => {
  log(`Unhandled Rejection: ${err.message}`, 'error');
  server.close(() => process.exit(1));
});

module.exports = server;