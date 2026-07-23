const productService = require('../services/productService');
const { success, error } = require('../utils/response');

const getAllProducts = async (req, res) => {
  const { data, error: err } = await productService.getAll();
  if (err) return error(res, 'Failed to fetch products', 500, err);
  return success(res, data, 'Products retrieved');
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  const { data, error: err } = await productService.getById(id);
  if (err) {
    // Supabase returns a 404-style error (code 'PGRST116') when no row matches
    if (err.code === 'PGRST116') {
      return error(res, 'Product not found', 404, err);
    }
    return error(res, 'Failed to fetch product', 500, err);
  }
  return success(res, data, 'Product retrieved');
};

const getProductsByCategory = async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return error(res, 'Category query parameter is required', 400);
  }
  const { data, error: err } = await productService.getByCategory(category);
  if (err) return error(res, 'Failed to fetch products', 500, err);
  return success(res, data, 'Products by category retrieved');
};

const createProduct = async (req, res) => {
  const { data, error: err } = await productService.create(req.body);
  if (err) return error(res, 'Failed to create product', 400, err);
  return success(res, data, 'Product created', 201);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { data, error: err } = await productService.update(id, req.body);
  if (err) {
    if (err.code === 'PGRST116') {
      return error(res, 'Product not found', 404, err);
    }
    return error(res, 'Failed to update product', 400, err);
  }
  return success(res, data, 'Product updated');
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { data, error: err } = await productService.remove(id);
  if (err) {
    if (err.code === 'PGRST116') {
      return error(res, 'Product not found', 404, err);
    }
    return error(res, 'Failed to delete product', 400, err);
  }
  return success(res, data, 'Product deleted');
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
};
