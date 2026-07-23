const { success, error } = require('../utils/response');

const getCart = async (req, res) => {
  // Placeholder - will connect to Supabase cart table with auth
  return success(res, { items: [] }, 'Cart retrieved (placeholder - configure Supabase)');
};

const addToCart = async (req, res) => {
  // Placeholder - will connect to Supabase cart table
  return success(res, { message: 'Item added (placeholder - configure Supabase)' }, 'Item added to cart', 201);
};

module.exports = {
  getCart,
  addToCart
};