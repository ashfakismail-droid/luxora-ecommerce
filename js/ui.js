/* ============================================================
   LUXORA - Shared UI (public site)
   Header, footer, cart, wishlist, toast, currency switcher,
   theme, mobile menu. Loaded on every public page.
   ============================================================ */
(function () {
  'use strict';

  const DB = window.LUXORA_DB;
  const CUR = window.LUXORA_CURRENCY;

  // ---------- Image resolver ----------
  // Product images in the DB are stored as bare filenames (e.g. "shoes-0.jpg").
  // Resolve them to the real path under images/products/. If a full path or
  // external URL is passed through, it is returned unchanged.
  function IMG(src) {
    if (!src) return 'images/products/shoes-0.jpg';
    if (/^([a-z]+:\/\/|\/|data:|\.\.\/)/i.test(src)) return src;
    if (src.indexOf('/') !== -1) return src;
    return 'images/products/' + src;
  }
  window.LUXORA_IMG = IMG;

  // ---------- Toast ----------
  function toast(msg, type) {
    type = type || 'info';
    let wrap = document.getElementById('toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'toast-wrap';
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    const el = document.createElement('div');
    el.className = 'toast toast-' + type;
    const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : '♥');
    el.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${msg}</span>`;
    wrap.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 350);
    }, 3000);
  }

  // ---------- Cart ----------
  function getCart() { return DB.getCart(); }
  function setCart(c) { DB.setCart(c); updateHeaderCounts(); document.dispatchEvent(new CustomEvent('luxora:cart')); }
  // Count is ALWAYS derived from the real cart array, and only items whose
  // product still exists are counted. No separate badge counter is ever stored.
  function cartCount() {
    return getCart().reduce((s, i) => s + ((i && i.productId && DB.getProduct(i.productId)) ? (i.qty || 1) : 0), 0);
  }
  function addToCart(productId, qty, variant) {
    qty = qty || 1;
    const cart = getCart();
    const key = productId + '|' + (variant ? JSON.stringify(variant) : '');
    const existing = cart.find(i => i.key === key);
    if (existing) existing.qty += qty;
    else cart.push({ key, productId, qty, variant: variant || null });
    setCart(cart);
    toast('Product added to cart', 'success');
    renderCartButtons();
  }
  function removeFromCart(key) {
    setCart(getCart().filter(i => i.key !== key));
    document.dispatchEvent(new CustomEvent('luxora:cart'));
    renderCartButtons();
  }
  function updateQty(key, qty) {
    const cart = getCart();
    const item = cart.find(i => i.key === key);
    if (item) {
      item.qty = Math.max(1, qty);
      setCart(cart);
    }
  }
  function updateCartCount() {
    const n = cartCount();
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = n;
      el.style.display = n > 0 ? 'inline-flex' : 'none';
    });
  }

  // ---------- Wishlist ----------
  function getWishlist() { return DB.getWishlist(); }
  function setWishlist(w) { DB.setWishlist(w); updateHeaderCounts(); document.dispatchEvent(new CustomEvent('luxora:wishlist')); }
  function inWishlist(id) { return getWishlist().includes(id); }
  function toggleWishlist(id) {
    const w = getWishlist();
    if (w.includes(id)) { setWishlist(w.filter(x => x !== id)); toast('Removed from Wishlist', 'info'); }
    else { w.push(id); setWishlist(w); toast('Added to Wishlist', 'success'); }
    document.dispatchEvent(new CustomEvent('luxora:wishlist'));
  }
  // Count is ALWAYS derived from the real wishlist array, filtered to ids that
  // still resolve to a product. No separate badge counter is ever stored.
  function wishlistCount() {
    return getWishlist().filter(id => DB.getProduct(id)).length;
  }
  function updateWishlistCount() {
    const n = wishlistCount();
    document.querySelectorAll('[data-wishlist-count]').forEach(el => {
      el.textContent = n;
      el.style.display = n > 0 ? 'inline-flex' : 'none';
    });
  }

  // ---------- Single source of truth for header badges ----------
  // Recalculates cart + wishlist counts directly from storage on every call.
  // Every page calls this on load and after any mutation.
  function updateHeaderCounts() {
    updateCartCount();
    updateWishlistCount();
  }

  // ---------- Currency switcher ----------
  function buildCurrencyOptions(select) {
    if (!select) return;
    select.innerHTML = '';
    Object.values(CUR.SUPPORTED).forEach(c => {
      const o = document.createElement('option');
      o.value = c.code; o.textContent = c.code + ' ' + c.symbol;
      select.appendChild(o);
    });
    select.value = CUR.getCode();
    select.addEventListener('change', () => CUR.setCode(select.value));
  }

  // re-render all [data-price] elements on currency change
  function refreshPrices() {
    document.querySelectorAll('[data-price]').forEach(el => {
      const base = parseFloat(el.getAttribute('data-price'));
      if (!isNaN(base)) el.textContent = CUR.format(base);
    });
    document.querySelectorAll('[data-price-raw]').forEach(el => {
      const val = parseFloat(el.getAttribute('data-price-raw'));
      if (!isNaN(val)) el.textContent = CUR.formatRaw(val);
    });
  }

  // ---------- Theme ----------
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme || 'dark');
  }
  function initTheme() {
    const s = DB.getSettings();
    applyTheme(s.theme || 'dark');
  }

  // ---------- Header / Footer injection ----------
  const NAV = [
    { href: 'index.html', label: 'Home' },
    { href: 'shop.html', label: 'Shop' },
    { href: 'about.html', label: 'About' },
    { href: 'contact.html', label: 'Contact' },
    { href: 'faq.html', label: 'FAQ' },
    { href: 'privacy.html', label: 'Privacy' },
    { href: 'terms.html', label: 'Terms' }
  ];

  function currentPage() {
    const p = location.pathname.split('/').pop();
    return p || 'index.html';
  }

  function renderHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;
    const page = currentPage();
    const links = NAV.map(n => `<a href="${n.href}" class="${n.href === page ? 'active' : ''}">${n.label}</a>`).join('');

    header.innerHTML = `
      <div class="container header-inner">
        <button class="icon-btn menu-toggle" id="menuToggle" aria-label="Menu">&#9776;</button>
        <a href="index.html" class="brand">
          <img src="images/misc/logo.svg" alt="LUXORA" class="brand-logo" width="34" height="34">
          <span class="brand-name">LUXORA</span>
        </a>
        <nav class="main-nav">${links}</nav>
        <div class="header-actions">
          <select class="currency-select" id="currencySelect" aria-label="Currency"></select>
          <a href="wishlist.html" class="icon-btn" aria-label="Wishlist">
            &#9825;<span class="badge" data-wishlist-count>0</span>
          </a>
          <a href="cart.html" class="icon-btn" aria-label="Cart">
            &#128722;<span class="badge" data-cart-count>0</span>
          </a>
          <a href="admin/login.html" class="btn btn-ghost admin-desktop">Admin</a>
        </div>
      </div>
      <div class="mobile-menu" id="mobileMenu">
        <nav class="mobile-nav">${links}</nav>
        <div class="mobile-admin">
          <div class="dev-demo">
            <span class="dev-label">Developer Demo</span>
            <a href="admin/login.html" class="dev-admin-link">&#9881; Admin Dashboard</a>
          </div>
        </div>
      </div>`;

    buildCurrencyOptions(header.querySelector('#currencySelect'));
    header.querySelector('#menuToggle').addEventListener('click', () => {
      header.querySelector('#mobileMenu').classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      const m = header.querySelector('#mobileMenu');
      if (m && m.classList.contains('open') && !m.contains(e.target) && !header.querySelector('#menuToggle').contains(e.target)) {
        m.classList.remove('open');
      }
    });
  }

  function renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    const s = DB.getSettings();
    footer.innerHTML = `
      <div class="container footer-grid">
        <div class="footer-col footer-brand">
          <a href="index.html" class="brand">
            <img src="images/misc/logo.svg" alt="LUXORA" class="brand-logo" width="34" height="34">
            <span class="brand-name">LUXORA</span>
          </a>
          <p>${s.tagline}. Curated luxury fashion & lifestyle essentials for the modern connoisseur.</p>
          <div class="socials">
            <a href="${s.social.instagram}" aria-label="Instagram">IG</a>
            <a href="${s.social.twitter}" aria-label="Twitter">TW</a>
            <a href="${s.social.facebook}" aria-label="Facebook">FB</a>
            <a href="${s.social.pinterest}" aria-label="Pinterest">PT</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <a href="shop.html">All Products</a>
          <a href="shop.html?cat=footwear">Footwear</a>
          <a href="shop.html?cat=bags">Bags</a>
          <a href="shop.html?cat=watches">Watches</a>
          <a href="shop.html?cat=fashion">Fashion</a>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <a href="about.html">About Us</a>
          <a href="contact.html">Contact</a>
          <a href="faq.html">FAQ</a>
          <a href="orders.html">My Orders</a>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <a href="privacy.html">Privacy Policy</a>
          <a href="terms.html">Terms of Service</a>
        </div>
        <div class="footer-col">
          <h4>Newsletter</h4>
          <p>Subscribe for exclusive drops & offers.</p>
          <form class="newsletter-form" data-newsletter>
            <input type="email" required placeholder="Your email" aria-label="Email">
            <button type="submit" class="btn btn-gold">Join</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">© ${new Date().getFullYear()} ${s.storeName}. All rights reserved.</div>
      </div>`;

    const nf = footer.querySelector('[data-newsletter]');
    if (nf) nf.addEventListener('submit', (e) => {
      e.preventDefault();
      nf.reset();
      toast('Subscribed! Welcome to LUXORA.', 'success');
    });
  }

  // ---------- Product card ----------
  function productCard(p) {
    const price = p.salePrice && p.salePrice > 0 ? p.salePrice : p.price;
    const old = p.salePrice && p.salePrice > 0 ? `<span class="card-old">${CUR.format(p.price)}</span>` : '';
    const inCart = isInCart(p.id);
    const badge = p.salePrice && p.salePrice > 0 ? '<span class="card-badge sale">Sale</span>'
      : (p.newArrival ? '<span class="card-badge new">New</span>' : '');
    const stockBadge = p.stock <= 0 ? '<span class="card-badge out">Sold Out</span>'
      : (p.stock <= 10 ? `<span class="card-badge low">Only ${p.stock} left</span>` : '');
    const wished = inWishlist(p.id) ? 'active' : '';
    const cartBtn = inCart
      ? `<button class="btn btn-gold btn-sm in-cart" data-cart="${p.id}" type="button">✓ In Cart</button>`
      : `<button class="btn btn-outline btn-sm" data-add="${p.id}" type="button" ${p.stock <= 0 ? 'disabled' : ''}>${p.stock <= 0 ? 'Sold Out' : 'Add to Cart'}</button>`;
    return `
      <article class="product-card glass" data-id="${p.id}">
        <a href="product.html?id=${p.id}" class="card-media">
          ${badge}${stockBadge}
          <img src="${IMG(p.image)}" alt="${p.name}" loading="lazy">
          <button class="wish-btn ${wished}" data-wish="${p.id}" aria-label="Wishlist" type="button">&#9825;</button>
          <button class="quick-view-btn" data-quick="${p.id}" type="button" aria-label="Quick view">⤢</button>
          <button class="compare-btn" data-compare="${p.id}" type="button" aria-label="Compare">⇄</button>
        </a>
        <div class="card-body">
          <span class="card-brand">${p.brand}</span>
          <a href="product.html?id=${p.id}" class="card-title">${p.name}</a>
          <div class="card-rating">${stars(p.rating)} <span>(${p.reviews})</span></div>
          <div class="card-price">
            <span class="card-now" data-price="${price}">${CUR.format(price)}</span>
            ${old}
          </div>
          <div class="card-actions">
            <a href="product.html?id=${p.id}" class="btn btn-gold btn-sm">View</a>
            ${cartBtn}
          </div>
        </div>
      </article>`;
  }

  function isInCart(id) {
    return getCart().some(i => i.productId === id);
  }

  function renderCartButtons() {
    document.querySelectorAll('[data-add], [data-cart]').forEach(btn => {
      const id = btn.getAttribute('data-add') || btn.getAttribute('data-cart');
      const inCart = isInCart(id);
      if (inCart) {
        btn.outerHTML = `<button class="btn btn-gold btn-sm in-cart" data-cart="${id}" type="button">✓ In Cart</button>`;
      } else if (btn.classList.contains('in-cart')) {
        const p = DB.getProduct(id);
        btn.outerHTML = `<button class="btn btn-outline btn-sm" data-add="${id}" type="button" ${p && p.stock <= 0 ? 'disabled' : ''}>${p && p.stock <= 0 ? 'Sold Out' : 'Add to Cart'}</button>`;
      }
    });
  }

  function stars(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    let s = '';
    for (let i = 0; i < full; i++) s += '★';
    if (half) s += '⯨';
    for (let i = full + (half ? 1 : 0); i < 5; i++) s += '☆';
    return `<span class="stars" title="${rating}">${s}</span>`;
  }

  // ---------- Global event delegation ----------
  function bindGlobal() {
    document.addEventListener('click', (e) => {
      const wish = e.target.closest('[data-wish]');
      if (wish) { e.preventDefault(); toggleWishlist(wish.getAttribute('data-wish')); renderWishButtons(); return; }
      const add = e.target.closest('[data-add]');
      if (add) { e.preventDefault(); addToCart(add.getAttribute('data-add'), 1, null); return; }
      const cartBtn = e.target.closest('[data-cart]');
      if (cartBtn) { e.preventDefault(); location.href = 'cart.html'; return; }
      const quick = e.target.closest('[data-quick]');
      if (quick) { e.preventDefault(); openQuickView(quick.getAttribute('data-quick')); return; }
      const cmp = e.target.closest('[data-compare]');
      if (cmp) { e.preventDefault(); toggleCompare(cmp.getAttribute('data-compare')); return; }
    });
    document.addEventListener('luxora:currency', refreshPrices);
    document.addEventListener('luxora:cart', renderCartButtons);
    document.addEventListener('luxora:wishlist', renderCartButtons);
  }

  function renderWishButtons() {
    document.querySelectorAll('[data-wish]').forEach(btn => {
      const id = btn.getAttribute('data-wish');
      btn.classList.toggle('active', inWishlist(id));
    });
  }

  // ---------- Quick View ----------
  function openQuickView(id) {
    const p = DB.getProduct(id);
    if (!p) return;
    let wrap = document.getElementById('quickViewModal');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'quickViewModal';
      wrap.className = 'modal-overlay quick-view';
      document.body.appendChild(wrap);
    }
    const price = (p.salePrice && p.salePrice > 0) ? p.salePrice : p.price;
    const old = (p.salePrice && p.salePrice > 0) ? `<span class="old">${CUR.format(p.price)}</span>` : '';
    const inCart = isInCart(p.id);
    wrap.innerHTML = `
      <div class="modal quick-view-modal glass">
        <button class="modal-close" data-qv-close aria-label="Close">✕</button>
        <div class="qv-grid">
          <div class="qv-media"><img src="${IMG(p.image)}" alt="${p.name}"></div>
          <div class="qv-info">
            <div class="qv-brand">${p.brand}</div>
            <h3>${p.name}</h3>
            <div class="qv-rating">${stars(p.rating)} <span>${p.rating} · ${p.reviews} reviews</span></div>
            <div class="qv-price"><span data-price="${price}">${CUR.format(price)}</span>${old}</div>
            <p class="qv-desc">${p.description}</p>
            <div class="qv-stock ${p.stock > 0 ? 'in' : 'out'}">${p.stock > 0 ? '✓ In stock' : '✕ Out of stock'}</div>
            <div class="qv-actions">
              <a href="product.html?id=${p.id}" class="btn btn-gold">View Details</a>
              ${inCart ? `<button class="btn btn-dark" data-qv-cart="${p.id}">✓ In Cart</button>` : `<button class="btn btn-outline" data-qv-add="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>${p.stock <= 0 ? 'Sold Out' : 'Add to Cart'}</button>`}
            </div>
          </div>
        </div>
      </div>`;
    wrap.classList.add('open');
    document.body.style.overflow = 'hidden';
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap || e.target.closest('[data-qv-close]')) closeQuickView();
      const add = e.target.closest('[data-qv-add]');
      if (add) { addToCart(add.getAttribute('data-qv-add'), 1, null); closeQuickView(); }
      const cb = e.target.closest('[data-qv-cart]');
      if (cb) { location.href = 'cart.html'; }
    });
  }
  function closeQuickView() {
    const wrap = document.getElementById('quickViewModal');
    if (wrap) { wrap.classList.remove('open'); document.body.style.overflow = ''; }
  }

  // ---------- Compare ----------
  // Compare list is stored under luxora_compare and read/written through the
  // shared DB helpers so it stays consistent with the single source of truth.
  function getCompare() { return DB.read('luxora_compare', []); }
  function saveCompare(list) { DB.write('luxora_compare', list); }
  let compareSet = new Set(getCompare());
  function toggleCompare(id) {
    if (compareSet.has(id)) { compareSet.delete(id); toast('Removed from compare', 'info'); }
    else {
      if (compareSet.size >= 4) { toast('You can compare up to 4 products', 'error'); return; }
      compareSet.add(id); toast('Added to compare', 'success');
    }
    saveCompare([...compareSet]);
    renderCompareBar();
  }
  function renderCompareBar() {
    let bar = document.getElementById('compareBar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'compareBar';
      bar.className = 'compare-bar';
      document.body.appendChild(bar);
    }
    // Hide completely when empty (Task 5). Only show when compare.length > 0.
    if (!compareSet.size) { bar.classList.remove('open'); bar.innerHTML = ''; return; }
    const items = [...compareSet].map(id => DB.getProduct(id)).filter(Boolean);
    if (!items.length) { bar.classList.remove('open'); bar.innerHTML = ''; return; }
    bar.innerHTML = `
      <div class="cb-inner">
        <div class="cb-items">${items.map(p => `<div class="cb-item"><img src="${IMG(p.image)}" alt="${p.name}"><button data-cb-remove="${p.id}" aria-label="Remove">✕</button></div>`).join('')}</div>
        <div class="cb-actions">
          <button class="btn btn-outline btn-sm" data-cb-clear>Clear</button>
          <button class="btn btn-gold btn-sm" data-cb-go>Compare (${items.length})</button>
        </div>
      </div>`;
    bar.classList.add('open');
    bar.querySelector('[data-cb-go]').addEventListener('click', () => { location.href = 'compare.html'; });
    bar.querySelector('[data-cb-clear]').addEventListener('click', () => { compareSet.clear(); saveCompare(); renderCompareBar(); });
    bar.querySelectorAll('[data-cb-remove]').forEach(b => b.addEventListener('click', () => { compareSet.delete(b.getAttribute('data-cb-remove')); saveCompare(); renderCompareBar(); }));
  }

  // ---------- Init ----------
  function init() {
    DB.init();
    // Re-sync compare set from storage after repair/migration.
    compareSet = new Set(getCompare());
    initTheme();
    renderHeader();
    renderFooter();
    updateHeaderCounts();
    refreshPrices();
    bindGlobal();
    renderCartButtons();
    renderCompareBar();
  }

  window.LUXORA_UI = {
    init, toast, addToCart, removeFromCart, updateQty, getCart, cartCount,
    toggleWishlist, inWishlist, getWishlist, productCard, stars, refreshPrices,
    buildCurrencyOptions, updateCartCount, updateWishlistCount, updateHeaderCounts, renderWishButtons,
    openQuickView, closeQuickView, toggleCompare, renderCompareBar, isInCart, IMG
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
