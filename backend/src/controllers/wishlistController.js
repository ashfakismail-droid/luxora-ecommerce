const { success, error } = require('../utils/response');

const getWishlist = async (req, res) => {
  // Placeholder - will connect to Supabase wishlist table with auth
  return success(res, { items: [] }, 'Wishlist retrieved (placeholder - configure Supabase)');
};

const addToWishlist = async (req, res) => {
  // Placeholder - will connect to Supabase wishlist table
  return success(res, { message: 'Item added (placeholder - configure Supabase)' }, 'Item added to wishlist', 201);
};

module.exports = {
  getWishlist,
  addToWishlist
};