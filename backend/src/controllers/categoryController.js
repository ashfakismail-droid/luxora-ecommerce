const db = require('../config/database');
const { success, error } = require('../utils/response');

const getAllCategories = async (req, res) => {
  if (!db.isConfigured) {
    return success(res, [], 'No categories (Supabase not configured)');
  }
  const { data, error: err } = await db.from('categories').select('*').order('name');
  if (err) {
  console.error('Categories Error:', err);
  return error(res, err.message, 500);
}
  return success(res, data, 'Categories retrieved');
};

module.exports = {
  getAllCategories
};