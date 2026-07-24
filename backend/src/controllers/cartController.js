const { supabaseAdmin, isConfigured } = require('../config/supabase');
const { success, error } = require('../utils/response');

const TABLE = 'cart';
const DEFAULT_USER_ID = 'guest';

const getUserId = (req) => String(req.query.userId || req.body?.userId || DEFAULT_USER_ID).trim();

const ensureConfigured = (res) => {
  if (!isConfigured || !supabaseAdmin) {
    error(res, 'Supabase cart is not configured', 503);
    return false;
  }
  return true;
};

const mapCartItem = (item) => ({
  key: item.item_key,
  productId: item.product_id,
  qty: item.quantity,
  variant: item.variant || null
});

const getCart = async (req, res) => {
  if (!ensureConfigured(res)) return;

  const { data, error: dbError } = await supabaseAdmin
    .from(TABLE)
    .select('item_key, product_id, quantity, variant')
    .eq('user_id', getUserId(req))
    .order('created_at', { ascending: true });

  if (dbError) return error(res, dbError.message, 503);
  return success(res, { items: (data || []).map(mapCartItem) }, 'Cart retrieved');
};

const addToCart = async (req, res) => {
  if (!ensureConfigured(res)) return;

  const productId = req.body?.productId || req.body?.product_id;
  const itemKey = String(req.body?.key || productId || '').trim();
  const quantity = Math.max(1, parseInt(req.body?.qty || req.body?.quantity, 10) || 1);
  if (!productId) return error(res, 'productId is required', 400);
  if (!itemKey) return error(res, 'key is required', 400);

  const { data, error: dbError } = await supabaseAdmin
    .from(TABLE)
    .upsert({
      user_id: getUserId(req),
      item_key: itemKey,
      product_id: productId,
      quantity,
      variant: req.body?.variant || null
    }, { onConflict: 'user_id,item_key' })
    .select('item_key, product_id, quantity, variant')
    .single();

  if (dbError) return error(res, dbError.message, 503);
  return success(res, { item: mapCartItem(data) }, 'Item added to cart', 201);
};

const updateCartItem = async (req, res) => {
  if (!ensureConfigured(res)) return;

  const itemKey = req.params.itemKey;
  const quantity = Math.max(1, parseInt(req.body?.qty || req.body?.quantity, 10) || 1);
  if (!itemKey) return error(res, 'key is required', 400);

  const { data, error: dbError } = await supabaseAdmin
    .from(TABLE)
    .update({ quantity })
    .eq('user_id', getUserId(req))
    .eq('item_key', itemKey)
    .select('item_key, product_id, quantity, variant')
    .single();

  if (dbError) return error(res, dbError.message, 503);
  return success(res, { item: mapCartItem(data) }, 'Cart item updated');
};

const removeFromCart = async (req, res) => {
  if (!ensureConfigured(res)) return;

  const { error: dbError } = await supabaseAdmin
    .from(TABLE)
    .delete()
    .eq('user_id', getUserId(req))
    .eq('item_key', req.params.itemKey);

  if (dbError) return error(res, dbError.message, 503);
  return success(res, { item: req.params.itemKey }, 'Item removed from cart');
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};