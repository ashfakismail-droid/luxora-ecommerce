const db = require('../config/database');
const { success, error } = require('../utils/response');

const getAllCategories = async (req, res) => {
  if (!db.isConfigured) {
    return success(res, [], 'No categories (Supabase not configured)');
  }
  const { data, error: err } = await db.from('categories').select('*').order('name');
  if (err) return error(res, 'Failed to fetch categories', 500, err);
  return success(res, data, 'Categories retrieved');
};

module.exports = {
  getAllCategories
};