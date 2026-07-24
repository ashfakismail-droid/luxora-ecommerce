const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { success, error } = require('../utils/response');

const hasRequiredCredentials = (email, password) => {
  return typeof email === 'string' && email.trim() && typeof password === 'string' && password.trim();
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!hasRequiredCredentials(email, password)) {
    return error(res, 'Email and password are required', 400);
  }
  
  if (!db.isConfigured) {
    return error(res, 'Authentication service is not configured', 503);
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

  if (!hasRequiredCredentials(email, password)) {
    return error(res, 'Email and password are required', 400);
  }
  
  if (!db.isConfigured) {
    return error(res, 'Authentication service is not configured', 503);
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
    return error(res, 'Authentication service is not configured', 503);
  }
  
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    await db.auth.signOut();
  }
  return success(res, null, 'Logout successful');
});

module.exports = router;