/**
 * Admin authorization middleware
 * Requires authenticate middleware to run first
 */
const isAdmin = (req, res, next) => {
  // Check for admin role in user metadata
  const user = req.user;
  
  // If no user from auth middleware, deny access
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Check if user has admin role
  const role = user.app_metadata?.role || user.user_metadata?.role;
  
  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

module.exports = { isAdmin };