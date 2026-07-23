const { success, error } = require('../utils/response');

const getReviews = async (req, res) => {
  // Placeholder - will connect to Supabase reviews table
  return success(res, [], 'Reviews retrieved (placeholder - configure Supabase)');
};

const createReview = async (req, res) => {
  // Placeholder - will connect to Supabase reviews table
  return success(res, { message: 'Review added (placeholder - configure Supabase)' }, 'Review created', 201);
};

module.exports = {
  getReviews,
  createReview
};