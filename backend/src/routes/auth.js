const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { success, error } = require('../utils/response');

// Placeholder endpoints - will integrate with Supabase Auth
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!db.isConfigured) {
    return success(res, { 
      message: 'Login endpoint ready (configure Supabase for full auth)',
      token: null 
    }, 'Auth not configured');
  }
  
  // Full Supabase auth integration
  const { data, error: authError } = await db.auth.signInWithPassword({
    email,
    password
  });
  
  if (authError) return error(res, authError.message, 401, authError);
  return success(res, { token: data.session?.access_token }, 'Login successful');
});

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!db.isConfigured) {
    return success(res, { 
      message: 'Register endpoint ready (configure Supabase for full auth)' 
    }, 'Auth not configured');
  }
  
  const { data, error: authError } = await db.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
  
  if (authError) return error(res, authError.message, 400, authError);
  return success(res, data, 'Registration successful', 201);
});

router.post('/logout', async (req, res) => {
  if (!db.isConfigured) {
    return success(res, { message: 'Logged out' }, 'Logout successful');
  }
  
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    await db.auth.signOut();
  }
  return success(res, null, 'Logout successful');
});

module.exports = router;