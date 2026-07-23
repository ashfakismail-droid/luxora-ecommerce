const db = require('../config/database');

const getAll = async () => {
  if (!db.isConfigured) {
    return { data: [], error: null };
  }
  const { data, error } = await db.from('users').select('*').order('created_at', { ascending: false });
  return { data, error };
};

const getById = async (id) => {
  if (!db.isConfigured) {
    return { data: null, error: null };
  }
  const { data, error } = await db.from('users').select('*').eq('id', id).single();
  return { data, error };
};

module.exports = {
  getAll,
  getById
};