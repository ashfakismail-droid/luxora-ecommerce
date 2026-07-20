/* LUXORA - Checkout page */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, UI = window.LUXORA_UI, CUR = window.LUXORA_CURRENCY, STORE = window.LUXORA_STORE;
  let appliedCoupon = sessionStorage.getItem('luxora_coupon') || '';

  function renderSummary() {
    const cart = DB.getCart();
    const summary = document.getElementById('checkoutSummary');
    if (!cart.length) {
      summary.innerHTML = `<h3>Order Summary</h3><p class="muted">Your cart is empty.</p><a href="shop.html" class="btn btn-gold btn-block" style="margin-top:14px">Shop Now</a>`;
      return;
    }
    const t = STORE.computeTotals(cart, appliedCoupon);
    summary.innerHTML = `
      <h3>Order Summary</h3>
      ${t.items.map(i => `
        <div class="summary-row"><span>${i.product.name} ×${i.qty}</span><span data-price="${i.lineTotal}">${CUR.format(i.lineTotal)}</span></div>`).join('')}
      <div class="summary-row"><span>Subtotal</span><span data-price="${t.subtotal}">${CUR.format(t.subtotal)}</span></div>
      ${t.discount > 0 ? `<div class="summary-row" style="color:var(--success)"><span>Discount (${appliedCoupon})</span><span data-price-raw="${-t.discount}">-${CUR.formatRaw(t.discount)}</span></div>` : ''}
      <div class="summary-row"><span>Tax</span><span data-price="${t.tax}">${CUR.format(t.tax)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${t.shipping === 0 ? 'Free' : `<span data-price="${t.shipping}">${CUR.format(t.shipping)}</span>`}</span></div>
      <div class="summary-row total"><span>Total</span><span data-price="${t.total}">${CUR.format(t.total)}</span></div>`;
    UI.refreshPrices();
  }

  function bind() {
    const same = document.getElementById('sameAsShip');
    same.addEventListener('change', () => {
      document.getElementById('billingFields').style.display = same.checked ? 'none' : 'block';
    });
    document.querySelectorAll('.pay-method input').forEach(r => r.addEventListener('change', () => {
      document.querySelectorAll('.pay-method').forEach(m => m.classList.toggle('active', m.querySelector('input').checked));
      const val = document.querySelector('.pay-method input:checked').value;
      document.getElementById('cardFields').style.display = (val === 'card') ? 'block' : 'none';
    }));

    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
      e.preventDefault();
      if (validate()) submit();
    });
  }

  function validate() {
    const form = document.getElementById('checkoutForm');
    let ok = true;
    const required = ['name', 'email', 'phone', 'address', 'city', 'zip', 'country'];
    required.forEach(n => {
      const el = form.elements[n];
      const field = el.closest('.field');
      if (!el.value.trim() || (n === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value))) {
        field.classList.add('invalid'); ok = false;
      } else field.classList.remove('invalid');
    });
    const pay = form.elements['pay'].value;
    if (pay === 'card') {
      const card = form.elements['card'];
      if (!/^[0-9\s]{12,19}$/.test(card.value.trim())) { card.closest('.field').classList.add('invalid'); ok = false; }
      else card.closest('.field').classList.remove('invalid');
    }
    if (!ok) UI.toast('Please complete the required fields.', 'error');
    return ok;
  }

  function submit() {
    const form = document.getElementById('checkoutForm');
    const cart = DB.getCart();
    if (!cart.length) { UI.toast('Your cart is empty.', 'error'); return; }
    const t = STORE.computeTotals(cart, appliedCoupon);
    const pay = form.elements['pay'].value;
    const same = document.getElementById('sameAsShip').checked;
    const customer = {
      name: form.elements['name'].value.trim(),
      email: form.elements['email'].value.trim(),
      phone: form.elements['phone'].value.trim()
    };
    const shipping = {
      address: form.elements['address'].value.trim(),
      city: form.elements['city'].value.trim(),
      zip: form.elements['zip'].value.trim(),
      country: form.elements['country'].value.trim()
    };
    const billing = same ? shipping : {
      address: form.elements['b_address'].value.trim(),
      city: form.elements['b_city'].value.trim(),
      zip: form.elements['b_zip'].value.trim(),
      country: form.elements['b_country'].value.trim()
    };
    const order = STORE.createOrder({
      customer, shipping, billing, payment: pay,
      items: t.items.map(i => ({ productId: i.productId, name: i.product.name, image: i.product.image, qty: i.qty, unit: i.unit, variant: i.variant })),
      subtotal: t.subtotal, discount: t.discount, coupon: appliedCoupon, tax: t.tax, shipping: t.shipping, total: t.total,
      currency: CUR.getCode()
    });
    DB.setCart([]);
    sessionStorage.removeItem('luxora_coupon');
    UI.updateCartCount();
    location.href = 'orders.html?order=' + order.id + '&success=1';
  }

  function init() {
    if (!DB.getCart().length) {
      // still render so user sees empty state
    }
    renderSummary();
    bind();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
