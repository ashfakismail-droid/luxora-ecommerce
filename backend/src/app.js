const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const { notFound, errorHandler } = require('./middleware/errorHandler');

// Routes
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const reviewRoutes = require('./routes/reviews');

const app = express();

// Security
app.use(helmet());

// CORS
const allowedOrigins = [
  "http://127.0.0.1:5501",
  "http://localhost:5501",
  "https://luxora-storee.netlify.app",
  "https://e-commerce-me.netlify.app"
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
// Body parsing
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '15mb'
}));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Luxora API is running',
    timestamp: new Date().toISOString(),
    supabaseConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
  });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;