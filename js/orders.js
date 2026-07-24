/* LUXORA - Orders page (history, status, invoice) */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, UI = window.LUXORA_UI, CUR = window.LUXORA_CURRENCY, ORDERS = window.LUXORA_ORDER_API;

  function statusPill(s) {
    const map = { pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };
    return `<span class="status-pill status-${s}">${map[s] || s}</span>`;
  }

  function normalizeOrder(o) {
    const items = o.items || o.order_items || [];
    return {
      ...o,
      id: o.id || o.order_id,
      date: o.date || (o.created_at ? new Date(o.created_at).toISOString().slice(0, 10) : ''),
      status: o.status || 'pending',
      payment: o.payment || o.payment_method || '',
      shipping: o.shipping || o.shipping_address || {},
      billing: o.billing || o.billing_address || {},
      items: items.map(i => ({
        productId: i.productId || i.product_id,
        name: i.name || i.product_name,
        image: i.image || i.product_image,
        qty: i.qty || i.quantity || 1,
        unit: i.unit || i.unit_price || 0,
        variant: i.variant || {}
      })),
      subtotal: Number(o.subtotal || 0),
      discount: Number(o.discount || 0),
      tax: Number(o.tax || 0),
      shippingCost: Number(o.shippingCost || o.shipping_cost || 0),
      total: Number(o.total || 0)
    };
  }

  async function render() {
    const root = document.getElementById('ordersRoot');
    const params = new URLSearchParams(location.search);
    const successId = params.get('order');
    const success = params.get('success');

    root.innerHTML = `<div class="glass" style="padding:24px"><p class="muted">Loading orders...</p></div>`;

    if (!ORDERS || typeof ORDERS.listOrders !== 'function') {
      root.innerHTML = `<div class="empty-state glass"><div class="ico">⚠️</div><h3>Orders unavailable</h3><p class="muted">Unable to load the orders API. Please refresh and try again.</p></div>`;
      return;
    }

    let orders;
    try {
      orders = (await ORDERS.listOrders()).map(normalizeOrder);
    } catch (err) {
      root.innerHTML = `<div class="empty-state glass"><div class="ico">⚠️</div><h3>Unable to load orders</h3><p class="muted">${err.message || 'Please try again later.'}</p><button class="btn btn-gold" id="retryOrders">Retry</button></div>`;
      document.getElementById('retryOrders').addEventListener('click', render);
      return;
    }

    if (!orders.length) {
      root.innerHTML = `<div class="empty-state glass"><div class="ico">📦</div><h3>No orders yet</h3><p class="muted">When you place an order it will appear here.</p><a href="shop.html" class="btn btn-gold">Start Shopping</a></div>`;
      return;
    }

    let html = '';
    if (success && successId) {
      html += `<div class="glass" style="padding:24px;margin-bottom:24px;border-left:3px solid var(--success)">
        <h3 style="margin-bottom:6px">✓ Order ${successId} placed successfully!</h3>
        <p class="muted">Thank you for shopping with LUXORA. A confirmation has been sent to your email.</p>
      </div>`;
    }

    html += orders.map(o => {
      const items = (o.items || []).map(i => `
        <div class="oi"><img src="${UI.IMG(i.image)}" alt="${i.name}"><div><div class="oi-name">${i.name}</div><div class="oi-qty">Qty ${i.qty}${i.variant && i.variant.size ? ' · ' + i.variant.size : ''}</div></div></div>`).join('');
      return `
      <div class="order-card glass">
        <div class="o-head">
          <div><span class="o-id">${o.id}</span> <span class="muted" style="font-size:13px">· ${o.date}</span></div>
          ${statusPill(o.status)}
        </div>
        <div class="order-items">${items}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;flex-wrap:wrap;gap:10px">
          <div class="muted">Total: <strong style="color:var(--text)" data-price="${o.total}">${CUR.format(o.total)}</strong> · ${o.payment}</div>
          <button class="btn btn-outline btn-sm" data-invoice="${o.id}">View Invoice</button>
        </div>
        <div id="inv-${o.id}" style="display:none;margin-top:16px"></div>
      </div>`;
    }).join('');

    root.innerHTML = html;
    UI.refreshPrices();

    document.querySelectorAll('[data-invoice]').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.invoice;
      const box = document.getElementById('inv-' + id);
      if (box.style.display === 'none') { box.innerHTML = invoiceHTML(orders.find(o => o.id === id)); box.style.display = 'block'; b.textContent = 'Hide Invoice'; UI.refreshPrices(); }
      else { box.style.display = 'none'; b.textContent = 'View Invoice'; }
    }));
  }

  function invoiceHTML(o) {
    const s = DB.getSettings();
    const rows = (o.items || []).map(i => `<tr><td>${i.name}${i.variant && i.variant.size ? ' (' + i.variant.size + ')' : ''}</td><td>${i.qty}</td><td data-price="${i.unit * i.qty}">${CUR.format(i.unit * i.qty)}</td></tr>`).join('');
    return `<div class="glass" style="padding:22px">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;border-bottom:1px solid var(--line);padding-bottom:14px;margin-bottom:14px">
        <div><strong>${s.storeName}</strong><div class="muted" style="font-size:13px">${s.address}</div></div>
        <div style="text-align:right"><div><strong>Invoice</strong></div><div class="muted" style="font-size:13px">${o.id} · ${o.date}</div></div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead><tr style="text-align:left;color:var(--text-mute)"><th>Item</th><th>Qty</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="margin-top:14px;text-align:right;font-size:14px;color:var(--text-dim)">
        <div>Subtotal: <span data-price="${o.subtotal}">${CUR.format(o.subtotal)}</span></div>
        ${o.discount > 0 ? `<div style="color:var(--success)">Discount: -<span data-price-raw="${o.discount}">${CUR.formatRaw(o.discount)}</span></div>` : ''}
        <div>Tax: <span data-price="${o.tax}">${CUR.format(o.tax)}</span></div>
        <div>Shipping: ${o.shippingCost === 0 ? 'Free' : `<span data-price="${o.shippingCost}">${CUR.format(o.shippingCost)}</span>`}</div>
        <div style="font-size:18px;color:var(--text);font-weight:600;margin-top:6px">Total: <span data-price="${o.total}">${CUR.format(o.total)}</span></div>
      </div>
      <div class="muted" style="font-size:13px;margin-top:14px">Ship to: ${o.shipping.address}, ${o.shipping.city} ${o.shipping.zip}, ${o.shipping.country}</div>
    </div>`;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
