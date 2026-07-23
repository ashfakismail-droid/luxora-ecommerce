const userService = require('../services/userService');
const { success, error } = require('../utils/response');

const getAllUsers = async (req, res) => {
  const { data, error: err } = await userService.getAll();
  if (err) return error(res, 'Failed to fetch users', 500, err);
  return success(res, data, 'Users retrieved');
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const { data, error: err } = await userService.getById(id);
  if (err) {
    if (err.code === 'PGRST116') {
      return error(res, 'User not found', 404, err);
    }
    return error(res, 'Failed to fetch user', 500, err);
  }
  return success(res, data, 'User retrieved');
};

module.exports = {
  getAllUsers,
  getUserById
};
