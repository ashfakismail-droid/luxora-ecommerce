/* LUXORA - Wishlist page */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, UI = window.LUXORA_UI;

  function render() {
    const ids = DB.getWishlist();
    const grid = document.getElementById('wishGrid');
    if (!ids.length) {
      grid.innerHTML = `<div class="empty-state glass" style="grid-column:1/-1"><div class="ico">♡</div><h3>Your wishlist is empty</h3><p class="muted">Tap the heart on any product to save it here.</p><a href="shop.html" class="btn btn-gold">Browse Products</a></div>`;
      return;
    }
    const products = ids.map(id => DB.getProduct(id)).filter(Boolean);
    grid.innerHTML = products.map(p => UI.productCard(p)).join('');
    UI.refreshPrices();
    UI.renderWishButtons();
  }

  // Re-render automatically whenever the wishlist changes (add/remove) so the
  // UI stays in sync without a page refresh.
  document.addEventListener('luxora:wishlist', render);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
