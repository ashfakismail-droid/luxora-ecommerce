/* LUXORA - Compare page */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, UI = window.LUXORA_UI, CUR = window.LUXORA_CURRENCY;

  function getCompare() {
    return DB.read('luxora_compare', []);
  }

  function render() {
    const root = document.getElementById('compareRoot');
    const ids = getCompare();
    const products = ids.map(id => DB.getProduct(id)).filter(Boolean);

    if (!products.length) {
      root.innerHTML = `<div class="empty-state glass"><div class="ico">⇄</div><h3>Nothing to compare yet</h3><p class="muted">Tap the compare icon on any product to add it here.</p><a href="shop.html" class="btn btn-gold">Browse Products</a></div>`;
      return;
    }

    const rows = [
      { label: 'Image', get: p => `<img src="${UI.IMG(p.image)}" alt="${p.name}">` },
      { label: 'Brand', get: p => p.brand },
      { label: 'Price', get: p => { const price = (p.salePrice && p.salePrice > 0) ? p.salePrice : p.price; return `<span data-price="${price}">${CUR.format(price)}</span>${p.salePrice ? ` <span class="card-old">${CUR.format(p.price)}</span>` : ''}`; } },
      { label: 'Rating', get: p => UI.stars(p.rating) + ` <span>(${p.reviews})</span>` },
      { label: 'Category', get: p => (DB.getCategories().find(c => c.id === p.category) || {}).name || p.category },
      { label: 'Stock', get: p => p.stock > 0 ? `<span class="stock-in">✓ In stock</span>` : `<span class="stock-out">Sold out</span>` },
      { label: 'Description', get: p => `<span class="cmp-desc">${p.description}</span>` },
      { label: '', get: p => `<a href="product.html?id=${p.id}" class="btn btn-gold btn-sm">View</a> <button class="btn btn-outline btn-sm" data-rm="${p.id}">Remove</button>` }
    ];

    let html = `<div class="compare-table"><div class="cmp-row cmp-head"><div class="cmp-cell cmp-label"></div>`;
    products.forEach(p => { html += `<div class="cmp-cell cmp-prod"><button class="cmp-x" data-rm="${p.id}" aria-label="Remove">✕</button><div class="cmp-name">${p.name}</div></div>`; });
    html += `</div>`;
    rows.forEach(r => {
      html += `<div class="cmp-row"><div class="cmp-cell cmp-label">${r.label}</div>`;
      products.forEach(p => { html += `<div class="cmp-cell">${r.get(p)}</div>`; });
      html += `</div>`;
    });
    html += `</div>`;
    root.innerHTML = html;
    UI.refreshPrices();

    root.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => {
      const set = new Set(getCompare());
      set.delete(b.getAttribute('data-rm'));
      DB.write('luxora_compare', [...set]);
      UI.renderCompareBar();
      render();
    }));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
