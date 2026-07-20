/* LUXORA - Cart page */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, UI = window.LUXORA_UI, CUR = window.LUXORA_CURRENCY, STORE = window.LUXORA_STORE;
  let appliedCoupon = sessionStorage.getItem('luxora_coupon') || '';

  function render() {
    const cart = DB.getCart();
    const list = document.getElementById('cartList');
    const summary = document.getElementById('cartSummary');

    if (!cart.length) {
      list.innerHTML = `<div class="empty-state glass" style="grid-column:1/-1"><div class="ico">🛒</div><h3>Your cart is empty</h3><p class="muted">Discover our luxury collection.</p><a href="shop.html" class="btn btn-gold">Start Shopping</a></div>`;
      summary.innerHTML = '';
      return;
    }

    const t = STORE.computeTotals(cart, appliedCoupon);
    list.innerHTML = t.items.map(i => {
      const k = encodeURIComponent(i.key);
      const variant = i.variant ? `<div class="ci-meta">${i.variant.color ? 'Color: ' + i.variant.color : ''}${i.variant.size ? ' · Size: ' + i.variant.size : ''}</div>` : '';
      return `
      <div class="cart-item glass">
        <img src="${UI.IMG(i.product.image)}" alt="${i.product.name}">
        <div>
          <div class="ci-title">${i.product.name}</div>
          <div class="ci-meta">${i.product.brand}</div>
          ${variant}
          <div class="qty-control" style="margin-top:10px">
            <button data-dec="${k}" aria-label="Decrease">−</button>
            <input value="${i.qty}" readonly aria-label="Qty">
            <button data-inc="${k}" aria-label="Increase">+</button>
          </div>
          <button class="ci-remove" data-remove="${k}">Remove</button>
        </div>
        <div class="ci-price" data-price="${i.lineTotal}">${CUR.format(i.lineTotal)}</div>
      </div>`;
    }).join('');

    const couponMsg = appliedCoupon ? `<div class="coupon-msg ok">Coupon "${appliedCoupon}" applied ✓</div>` : '';
    summary.innerHTML = `
      <h3>Order Summary</h3>
      <div class="coupon-msg" id="couponMsg">${couponMsg}</div>
      <div class="coupon-row">
        <input type="text" id="couponInput" placeholder="Coupon code" value="${appliedCoupon}">
        <button class="btn btn-outline btn-sm" id="applyCoupon">Apply</button>
      </div>
      <div class="summary-row"><span>Subtotal</span><span data-price="${t.subtotal}">${CUR.format(t.subtotal)}</span></div>
      ${t.discount > 0 ? `<div class="summary-row" style="color:var(--success)"><span>Discount</span><span data-price-raw="${-t.discount}">-${CUR.formatRaw(t.discount)}</span></div>` : ''}
      <div class="summary-row"><span>Tax (${(t.taxRate * 100).toFixed(0)}%)</span><span data-price="${t.tax}">${CUR.format(t.tax)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${t.shipping === 0 ? 'Free' : `<span data-price="${t.shipping}">${CUR.format(t.shipping)}</span>`}</span></div>
      <div class="summary-row total"><span>Total</span><span data-price="${t.total}">${CUR.format(t.total)}</span></div>
      <a href="checkout.html" class="btn btn-gold btn-block" style="margin-top:18px">Proceed to Checkout</a>
      <a href="shop.html" class="btn btn-outline btn-block" style="margin-top:10px">Continue Shopping</a>`;

    bind();
    UI.refreshPrices();
  }

  function bind() {
    document.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => { UI.removeFromCart(decodeURIComponent(b.dataset.remove)); }));
    document.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => { const key = decodeURIComponent(b.dataset.inc); const i = DB.getCart().find(x => x.key === key); UI.updateQty(key, (i ? i.qty : 1) + 1); }));
    document.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => { const key = decodeURIComponent(b.dataset.dec); const i = DB.getCart().find(x => x.key === key); UI.updateQty(key, (i ? i.qty : 1) - 1); }));

    const apply = document.getElementById('applyCoupon');
    if (apply) apply.addEventListener('click', () => {
      const code = document.getElementById('couponInput').value.trim();
      if (!code) { appliedCoupon = ''; sessionStorage.removeItem('luxora_coupon'); render(); return; }
      const res = STORE.validateCoupon(code);
      const msg = document.getElementById('couponMsg');
      if (res.ok) { appliedCoupon = res.coupon.code; sessionStorage.setItem('luxora_coupon', appliedCoupon); UI.toast('Coupon applied', 'success'); }
      else { appliedCoupon = ''; sessionStorage.removeItem('luxora_coupon'); if (msg) { msg.textContent = res.msg; msg.className = 'coupon-msg err'; } UI.toast(res.msg, 'error'); }
      render();
    });
  }

  // Re-render automatically whenever the cart changes (add/remove/qty) so the
  // UI stays in sync without a page refresh.
  document.addEventListener('luxora:cart', render);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
