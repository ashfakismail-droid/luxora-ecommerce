const db = require('../config/database');

const getAll = async () => {
  if (!db.isConfigured) {
    return { data: [], error: null };
  }
  const { data, error } = await db.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
  return { data, error };
};

const create = async (order) => {
  if (!db.isConfigured) {
    return { data: null, error: null };
  }
  // The order will be inserted with items via a transaction or separate inserts
  const { data, error } = await db.from('orders').insert([order]).select();
  return { data: data?.[0], error };
};

module.exports = {
  getAll,
  create
};