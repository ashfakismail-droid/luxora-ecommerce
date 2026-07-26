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

const createCategory = async (req, res) => {
  if (!db.supabaseAdmin) {
    return error(res, 'Supabase admin client not configured', 500);
  }
  const { name, slug, image, description } = req.body;
  if (!name) {
    return error(res, 'Category name is required', 400);
  }
  const categorySlug = slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const { data, error: err } = await db
    .adminFrom('categories')
    .insert([{ name, slug: categorySlug, image, description }])
    .select()
    .single();

  if (err) {
    return error(res, err.message || 'Failed to create category', 400, err);
  }
  return success(res, data, 'Category created', 201);
};

const updateCategory = async (req, res) => {
  if (!db.supabaseAdmin) {
    return error(res, 'Supabase admin client not configured', 500);
  }
  const { id } = req.params;
  const updates = req.body;
  if (updates.name && !updates.slug) {
    updates.slug = updates.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  const { data, error: err } = await db
    .adminFrom('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (err) {
    if (err.code === 'PGRST116') {
      return error(res, 'Category not found', 404, err);
    }
    return error(res, err.message || 'Failed to update category', 400, err);
  }
  return success(res, data, 'Category updated');
};

const deleteCategory = async (req, res) => {
  if (!db.supabaseAdmin) {
    return error(res, 'Supabase admin client not configured', 500);
  }
  const { id } = req.params;

  const { data, error: err } = await db
    .adminFrom('categories')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (err) {
    if (err.code === 'PGRST116') {
      return error(res, 'Category not found', 404, err);
    }
    return error(res, err.message || 'Failed to delete category', 400, err);
  }
  return success(res, data, 'Category deleted');
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
