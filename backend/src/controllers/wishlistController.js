const { supabaseAdmin, isConfigured } = require('../config/supabase');
const { success, error } = require('../utils/response');

const TABLE = 'wishlist';
const DEFAULT_USER_ID = 'guest';

const getUserId = (req) => String(req.query.userId || req.body?.userId || DEFAULT_USER_ID).trim();

const mapWishlistItem = (item) => item.product_id || item.productId || item.id;

const ensureConfigured = (res) => {
  if (!isConfigured || !supabaseAdmin) {
    error(res, 'Supabase wishlist is not configured', 503);
    return false;
  }
  return true;
};

const getWishlist = async (req, res) => {
  if (!ensureConfigured(res)) return;

  const userId = getUserId(req);
  const { data, error: dbError } = await supabaseAdmin
    .from(TABLE)
    .select('product_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (dbError) return error(res, dbError.message, 503);

  return success(res, { items: (data || []).map(mapWishlistItem).filter(Boolean) }, 'Wishlist retrieved');
};

const addToWishlist = async (req, res) => {
  if (!ensureConfigured(res)) return;

  const userId = getUserId(req);
  const productId = req.body?.productId || req.body?.product_id;

  if (!productId) return error(res, 'productId is required', 400);

  const { data, error: dbError } = await supabaseAdmin
    .from(TABLE)
    .upsert({ user_id: userId, product_id: productId }, { onConflict: 'user_id,product_id' })
    .select('product_id')
    .single();

  if (dbError) return error(res, dbError.message, 503);

  return success(res, { item: mapWishlistItem(data) }, 'Item added to wishlist', 201);
};

const removeFromWishlist = async (req, res) => {
  if (!ensureConfigured(res)) return;

  const userId = getUserId(req);
  const productId = req.params.productId || req.body?.productId || req.body?.product_id;

  if (!productId) return error(res, 'productId is required', 400);

  const { error: dbError } = await supabaseAdmin
    .from(TABLE)
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (dbError) return error(res, dbError.message, 503);

  return success(res, { item: productId }, 'Item removed from wishlist');
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};