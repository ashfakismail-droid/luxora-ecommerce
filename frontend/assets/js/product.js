/* LUXORA - Product detail page */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, UI = window.LUXORA_UI, CUR = window.LUXORA_CURRENCY;

  const selected = { color: null, size: null, qty: 1, img: 0 };

  function getProduct() {
    const id = new URLSearchParams(location.search).get('id');
    return DB.getProduct(id);
  }

  function render() {
    const p = getProduct();
    const root = document.getElementById('pdpRoot');
    if (!p) {
      root.innerHTML = `<div class="empty-state"><div class="ico">🚫</div><h3>Product not found</h3><p class="muted">It may have been removed.</p><a href="shop.html" class="btn btn-gold">Back to Shop</a></div>`;
      return;
    }
    document.title = p.name + ' — LUXORA';
    selected.color = p.colors[0];
    selected.size = p.sizes[0];

    const price = (p.salePrice && p.salePrice > 0) ? p.salePrice : p.price;
    const old = (p.salePrice && p.salePrice > 0) ? `<span class="old" data-price="${p.price}">${CUR.format(p.price)}</span>` : '';

    root.innerHTML = `
      <div class="breadcrumb"><a href="index.html">Home</a> / <a href="shop.html?cat=${p.category}">${p.category}</a> / ${p.name}</div>
      <div class="pdp">
        <div class="pdp-gallery">
          <div class="main-img" id="mainImgWrap"><img id="mainImg" src="${UI.IMG(p.images[0])}" alt="${p.name}"></div>
          <div class="thumbs" id="thumbs">
            ${p.images.map((img, i) => `<img src="${UI.IMG(img)}" class="${i === 0 ? 'active' : ''}" data-i="${i}" alt="${p.name} view ${i + 1}">`).join('')}
          </div>
        </div>
        <div class="pdp-info">
          <div class="pdp-brand">${p.brand}</div>
          <h1>${p.name}</h1>
          <div class="pdp-rating">${UI.stars(p.rating)} <span>${p.rating} · ${p.reviews} reviews</span></div>
          <div class="pdp-price"><span data-price="${price}">${CUR.format(price)}</span>${old}</div>
          <p class="pdp-desc">${p.description}</p>

          <div class="variant-block">
            <div class="label">Color: <strong id="colorLabel">${selected.color}</strong></div>
            <div class="swatches" id="swatches">
              ${p.colors.map((c, i) => `<span class="swatch ${i === 0 ? 'active' : ''}" style="background:${c}" data-color="${c}" title="${c}"></span>`).join('')}
            </div>
          </div>

          <div class="variant-block">
            <div class="label">Size</div>
            <div class="size-opts" id="sizes">
              ${p.sizes.map((s, i) => `<button class="size-opt ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>`).join('')}
            </div>
          </div>

          <div class="qty-row">
            <div class="qty-control">
              <button id="qtyMinus" aria-label="Decrease">−</button>
              <input id="qtyInput" value="1" readonly aria-label="Quantity">
              <button id="qtyPlus" aria-label="Increase">+</button>
            </div>
            <span class="muted" id="stockInfo">${p.stock > 0 ? p.stock + ' in stock' : 'Out of stock'}</span>
          </div>

          <div class="pdp-actions">
            <button class="btn btn-gold" id="addCart">Add to Cart</button>
            <button class="btn btn-dark" id="buyNow">Buy Now</button>
            <button class="btn btn-outline" id="wishBtn">♡ Wishlist</button>
          </div>

          <div class="pdp-meta">
            <div>✓ Authenticity guaranteed</div>
            <div>✓ Complimentary luxury packaging</div>
            <div>✓ Free returns within 30 days</div>
            <div>✓ Secure encrypted checkout</div>
          </div>
        </div>
      </div>

      <div class="pdp-tabs">
        <div class="tabs-nav">
          <button class="active" data-tab="desc">Description</button>
          <button data-tab="specs">Specifications</button>
          <button data-tab="reviews">Reviews (${p.reviews})</button>
          <button data-tab="related">Related</button>
        </div>
        <div class="tab-panel active" data-panel="desc"><p class="muted" style="max-width:760px">${p.description} Crafted with meticulous attention to detail, the ${p.name} embodies the LUXORA philosophy of quiet luxury and enduring quality.</p></div>
        <div class="tab-panel" data-panel="specs">
          <table class="spec-table">
            ${Object.entries(p.specs || {}).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
            <tr><td>Brand</td><td>${p.brand}</td></tr>
            <tr><td>Category</td><td>${p.category}</td></tr>
          </table>
        </div>
        <div class="tab-panel" data-panel="reviews" id="reviewPanel"></div>
        <div class="tab-panel" data-panel="related">
          <div class="related-grid" id="relatedGrid"></div>
        </div>
      </div>`;

    bind(p);
    renderReviews(p);
    renderRelated(p);
    UI.refreshPrices();
    UI.renderWishButtons();
    syncCartButton(p.id);
    syncWishButton(p.id);
  }

  // Keep the PDP Add-to-Cart / Wishlist buttons in sync with shared state.
  // Listens to the same events every other component uses so removing an item
  // from the cart (or wishlist) on another page updates this page instantly.
  function syncCartButton(id) {
    const btn = document.getElementById('addCart');
    if (!btn) return;
    const inCart = UI.isInCart(id);
    btn.textContent = inCart ? '✓ In Cart' : 'Add to Cart';
    btn.classList.toggle('in-cart', inCart);
  }
  function syncWishButton(id) {
    const btn = document.getElementById('wishBtn');
    if (!btn) return;
    const active = UI.inWishlist(id);
    btn.textContent = active ? '♥ In Wishlist' : '♡ Wishlist';
    btn.classList.toggle('btn-gold', active);
  }
  document.addEventListener('luxora:cart', () => syncCartButton(getProduct() ? getProduct().id : null));
  document.addEventListener('luxora:wishlist', () => syncWishButton(getProduct() ? getProduct().id : null));

  function bind(p) {
    // gallery
    const mainImg = document.getElementById('mainImg');
    document.getElementById('thumbs').addEventListener('click', (e) => {
      const t = e.target.closest('img'); if (!t) return;
      selected.img = +t.dataset.i;
      mainImg.src = UI.IMG(p.images[selected.img]);
      document.querySelectorAll('#thumbs img').forEach(i => i.classList.toggle('active', i === t));
    });
    // zoom
    const wrap = document.getElementById('mainImgWrap');
    wrap.addEventListener('mousemove', (e) => {
      const r = wrap.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      mainImg.style.transform = `scale(1.8)`;
      mainImg.style.transformOrigin = `${x}% ${y}%`;
    });
    wrap.addEventListener('mouseleave', () => { mainImg.style.transform = 'scale(1)'; mainImg.style.transformOrigin = 'center'; });

    // swatches
    document.getElementById('swatches').addEventListener('click', (e) => {
      const s = e.target.closest('.swatch'); if (!s) return;
      selected.color = s.dataset.color;
      document.getElementById('colorLabel').textContent = selected.color;
      document.querySelectorAll('#swatches .swatch').forEach(x => x.classList.toggle('active', x === s));
    });
    // sizes
    document.getElementById('sizes').addEventListener('click', (e) => {
      const b = e.target.closest('.size-opt'); if (!b) return;
      selected.size = b.dataset.size;
      document.querySelectorAll('#sizes .size-opt').forEach(x => x.classList.toggle('active', x === b));
    });
    // qty
    document.getElementById('qtyMinus').addEventListener('click', () => { selected.qty = Math.max(1, selected.qty - 1); document.getElementById('qtyInput').value = selected.qty; });
    document.getElementById('qtyPlus').addEventListener('click', () => { selected.qty = Math.min(p.stock || 99, selected.qty + 1); document.getElementById('qtyInput').value = selected.qty; });

    // actions
    document.getElementById('addCart').addEventListener('click', () => {
      UI.addToCart(p.id, selected.qty, { color: selected.color, size: selected.size });
    });
    document.getElementById('buyNow').addEventListener('click', () => {
      UI.addToCart(p.id, selected.qty, { color: selected.color, size: selected.size });
      location.href = 'checkout.html';
    });
    const wishBtn = document.getElementById('wishBtn');
    wishBtn.addEventListener('click', () => {
      UI.toggleWishlist(p.id);
      syncWishButton(p.id);
    });
    syncWishButton(p.id);

    // tabs
    document.querySelectorAll('.tabs-nav button').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tabs-nav button').forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.tab-panel').forEach(pn => pn.classList.toggle('active', pn.dataset.panel === tab));
      });
    });
  }

  function renderReviews(p) {
    const all = DB.getReviews().filter(r => r.productId === p.id && r.status === 'approved');
    const panel = document.getElementById('reviewPanel');
    if (!all.length) { panel.innerHTML = `<p class="muted">No reviews yet. Be the first to share your experience.</p>`; return; }
    panel.innerHTML = all.map(r => `
      <div class="review-item">
        <div class="head"><span class="name">${r.name}</span>${UI.stars(r.rating)}<span class="date">${r.date}</span></div>
        <div><strong>${r.title}</strong></div>
        <p class="muted">${r.comment}</p>
      </div>`).join('');
  }

  function renderRelated(p) {
    const related = DB.getProducts().filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
    if (!related.length) related.push(...DB.getProducts().filter(x => x.id !== p.id).slice(0, 4));
    document.getElementById('relatedGrid').innerHTML = related.map(x => UI.productCard(x)).join('');
    UI.refreshPrices();
    UI.renderWishButtons();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
