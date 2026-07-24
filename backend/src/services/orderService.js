const db = require('../config/database');

const normalizeOrder = (order) => {
  if (!order) return null;
  const meta = order.shipping_address || {};
  const orderItems = order.order_items || [];
  const items = orderItems.map((item) => ({
    productId: item.product_id,
    name: item.products?.name || item.name || meta.items?.find?.((i) => String(i.productId) === String(item.product_id))?.name || 'Product',
    image: item.products?.image || meta.items?.find?.((i) => String(i.productId) === String(item.product_id))?.image || '',
    qty: item.quantity,
    unit: Number(item.price || 0),
    variant: meta.items?.find?.((i) => String(i.productId) === String(item.product_id))?.variant || {}
  }));

  return {
    id: order.id,
    date: order.created_at ? new Date(order.created_at).toISOString().slice(0, 10) : meta.date,
    status: order.status || 'pending',
    customer: meta.customer || {},
    shipping: meta.address || meta,
    billing: meta.billing || meta.address || {},
    payment: order.payment_method || meta.payment || '',
    items,
    subtotal: Number(meta.subtotal || items.reduce((sum, item) => sum + item.unit * item.qty, 0)),
    discount: Number(meta.discount || 0),
    coupon: meta.coupon || '',
    tax: Number(meta.tax || 0),
    shippingCost: Number(meta.shippingCost || 0),
    total: Number(order.total || 0),
    currency: meta.currency || 'USD',
    created_at: order.created_at,
    updated_at: order.updated_at
  };
};

const getAll = async () => {
  if (!db.isConfigured) {
    return { data: [], error: null };
  }
  const { data, error } = await db.from('orders').select('*, order_items(*, products(*))').order('created_at', { ascending: false });
  return { data: data?.map(normalizeOrder) || [], error };
};

const getById = async (id) => {
  if (!db.isConfigured) {
    return { data: null, error: null };
  }
  const { data, error } = await db.from('orders').select('*, order_items(*, products(*))').eq('id', id).single();
  return { data: normalizeOrder(data), error };
};

const create = async (order) => {
  if (!db.isConfigured) {
    return { data: null, error: new Error('Database is not configured') };
  }
  const orderPayload = {
    status: 'pending',
    total: order.total || 0,
    shipping_address: {
      address: order.shipping || {},
      billing: order.billing || order.shipping || {},
      customer: order.customer || {},
      subtotal: order.subtotal || 0,
      discount: order.discount || 0,
      coupon: order.coupon || '',
      tax: order.tax || 0,
      shippingCost: order.shippingCost || 0,
      currency: order.currency || 'USD',
      items: order.items || []
    },
    payment_method: order.payment || order.payment_method || ''
  };

  const { data: createdOrder, error: orderError } = await db.from('orders').insert([orderPayload]).select().single();
  if (orderError) return { data: null, error: orderError };

  const items = (order.items || []).map((item) => ({
    order_id: createdOrder.id,
    product_id: item.productId,
    quantity: item.qty || 1,
    price: item.unit || 0
  }));

  if (items.length) {
    const { error: itemsError } = await db.from('order_items').insert(items);
    if (itemsError) return { data: null, error: itemsError };
  }

  const { data, error } = await db.from('orders').select('*, order_items(*, products(*))').eq('id', createdOrder.id).single();
  return { data: normalizeOrder(data), error };
};

module.exports = {
  getAll,
  getById,
  create
};