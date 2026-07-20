/* LUXORA - Shared store helpers (totals, coupons, orders) */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, CUR = window.LUXORA_CURRENCY;

  function priceOf(p) { return (p.salePrice && p.salePrice > 0) ? p.salePrice : p.price; }

  // returns enriched cart items with product + lineTotal (base USD)
  function enrichCart(cart) {
    return cart.map(item => {
      const p = DB.getProduct(item.productId);
      if (!p) return null;
      const unit = priceOf(p);
      return { ...item, product: p, unit, lineTotal: unit * (item.qty || 1) };
    }).filter(Boolean);
  }

  function computeTotals(cart, couponCode) {
    const items = enrichCart(cart);
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const settings = DB.getSettings();
    const taxRate = (settings.taxRate || 0) / 100;
    let discount = 0;
    let coupon = null;
    if (couponCode) {
      coupon = DB.getCoupons().find(c => c.code.toLowerCase() === couponCode.toLowerCase() && c.active);
      if (coupon) {
        if (coupon.type === 'percent') discount = subtotal * (coupon.value / 100);
        else discount = Math.min(coupon.value, subtotal);
        if (coupon.min && subtotal < coupon.min) { coupon = null; discount = 0; }
      }
    }
    const afterDiscount = Math.max(0, subtotal - discount);
    const tax = afterDiscount * taxRate;
    let shipping = 0;
    if (afterDiscount > 0) {
      shipping = (settings.freeShippingOver && afterDiscount >= settings.freeShippingOver) ? 0 : (settings.shippingFlat || 0);
    }
    const total = afterDiscount + tax + shipping;
    return { items, subtotal, discount, coupon, tax, shipping, total, taxRate };
  }

  function validateCoupon(code) {
    const c = DB.getCoupons().find(x => x.code.toLowerCase() === (code || '').toLowerCase());
    if (!c) return { ok: false, msg: 'Invalid coupon code.' };
    if (!c.active) return { ok: false, msg: 'This coupon is not active.' };
    return { ok: true, coupon: c };
  }

  function createOrder(data) {
    const orders = DB.getOrders();
    const id = 'LX-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);
    const order = {
      id, date: new Date().toISOString().slice(0, 10),
      status: 'pending', ...data
    };
    orders.unshift(order);
    DB.setOrders(orders);
    // record customer
    const customers = DB.getCustomers();
    let cust = customers.find(c => c.email === data.customer.email);
    if (!cust) {
      cust = { id: 'C' + Date.now(), name: data.customer.name, email: data.customer.email, phone: data.customer.phone, orders: 0, joined: order.date, status: 'active' };
      customers.push(cust);
    }
    cust.orders = (cust.orders || 0) + 1;
    DB.setCustomers(customers);
    return order;
  }

  window.LUXORA_STORE = { priceOf, enrichCart, computeTotals, validateCoupon, createOrder };
})();
