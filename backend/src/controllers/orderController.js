const orderService = require('../services/orderService');
const { success, error } = require('../utils/response');

const getAllOrders = async (req, res) => {
  const { data, error: err } = await orderService.getAll();
  if (err) return error(res, 'Failed to fetch orders', 500, err);
  return success(res, data, 'Orders retrieved');
};

const createOrder = async (req, res) => {
  const { data, error: err } = await orderService.create(req.body);
  if (err) return error(res, 'Failed to create order', 400, err);
  return success(res, data, 'Order created', 201);
};

module.exports = {
  getAllOrders,
  createOrder
};
