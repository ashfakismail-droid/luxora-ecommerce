const db = require('../config/database');

const getAll = async () => {
  if (!db.isConfigured) {
    return { data: [], error: null };
  }

  const { data, error } = await db
    .adminFrom('products')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

const getById = async (id) => {
  if (!db.isConfigured) {
    return { data: null, error: null };
  }

  const productId = Number(id);

  const { data, error } = await db
    .adminFrom('products')
    .select('*')
    .eq('id', productId)
    .single();

  return { data, error };
};

const getByCategory = async (category) => {
  if (!db.isConfigured) {
    return { data: [], error: null };
  }

  const { data, error } = await db
    .adminFrom('products')
    .select('*')
    .eq('category', category);

  return { data, error };
};

const create = async (product) => {
  if (!db.supabaseAdmin) {
    return {
      data: null,
      error: 'Supabase admin client not configured'
    };
  }

  console.log('Incoming product:', product);

  const { data, error } = await db
    .adminFrom('products')
    .insert([product])
    .select()
    .single();

  console.log('Insert error:', error);

  return { data, error };
};

const update = async (id, updates) => {
  if (!db.supabaseAdmin) {
    return {
      data: null,
      error: 'Supabase admin client not configured'
    };
  }

  const { data, error } = await db
    .adminFrom('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

const remove = async (id) => {
  if (!db.supabaseAdmin) {
    return {
      data: null,
      error: 'Supabase admin client not configured'
    };
  }

  const { data, error } = await db
    .adminFrom('products')
    .delete()
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

module.exports = {
  getAll,
  getById,
  getByCategory,
  create,
  update,
  remove
};