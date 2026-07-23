/* ============================================================
   LUXORA - Admin shared JS
   Auth, layout shell, toast, currency, simple SVG charts.
   ============================================================ */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, CUR = window.LUXORA_CURRENCY;

  // ---------- Image resolver (admin pages live in /admin) ----------
  function IMG(src) {
    if (!src) return '../images/products/shoes-0.jpg';
    if (/^([a-z]+:\/\/|\/|data:|\.\.\/)/i.test(src)) return src;
    if (src.indexOf('/') !== -1) return src;
    return '../images/products/' + src;
  }
  window.LUXORA_IMG = IMG;

  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'luxora2026';

  // ---------- Auth ----------
  function isLoggedIn() { return localStorage.getItem(DB.STORAGE_KEYS.session) === '1'; }
  function login(u, p) {
    if (u === ADMIN_USER && p === ADMIN_PASS) { localStorage.setItem(DB.STORAGE_KEYS.session, '1'); return true; }
    return false;
  }
  function logout() { localStorage.removeItem(DB.STORAGE_KEYS.session); location.href = 'login.html'; }
  function requireAuth() {
    if (!isLoggedIn()) location.href = 'login.html';
  }

  // ---------- Toast ----------
  function toast(msg, type) {
    let wrap = document.getElementById('toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.id = 'toast-wrap'; wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
    const el = document.createElement('div');
    el.className = 'toast toast-' + (type || 'info');
    el.innerHTML = `<span class="toast-dot"></span><span>${msg}</span>`;
    wrap.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2600);
  }

  // ---------- Confirmation dialog ----------
  function confirmDialog(opts) {
    opts = opts || {};
    return new Promise((resolve) => {
      let wrap = document.getElementById('confirmModal');
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.id = 'confirmModal';
        wrap.className = 'modal-overlay confirm';
        document.body.appendChild(wrap);
      }
      wrap.innerHTML = `
        <div class="modal confirm-modal glass">
          <div class="confirm-ico">${opts.icon || '⚠'}</div>
          <h3>${opts.title || 'Are you sure?'}</h3>
          <p class="muted">${opts.message || ''}</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" data-confirm-no>Cancel</button>
            <button class="btn ${opts.danger ? 'btn-danger' : 'btn-gold'}" data-confirm-yes>${opts.confirmText || 'Confirm'}</button>
          </div>
        </div>`;
      wrap.classList.add('open');
      const close = (val) => { wrap.classList.remove('open'); resolve(val); };
      wrap.querySelector('[data-confirm-yes]').addEventListener('click', () => close(true));
      wrap.querySelector('[data-confirm-no]').addEventListener('click', () => close(false));
      wrap.addEventListener('click', (e) => { if (e.target === wrap) close(false); });
    });
  }

  // ---------- Loading state ----------
  function showLoading(el) {
    if (!el) return;
    el.classList.add('loading');
    el.setAttribute('data-loading', '1');
  }
  function hideLoading(el) {
    if (!el) return;
    el.classList.remove('loading');
    el.removeAttribute('data-loading');
  }

  // ---------- Sidebar shell ----------
  const NAV = [
    { href: 'dashboard.html', label: 'Dashboard', ico: '▣' },
    { href: 'products.html', label: 'Products', ico: '◈' },
    { href: 'categories.html', label: 'Categories', ico: '▤' },
    { href: 'orders.html', label: 'Orders', ico: '📦' },
    { href: 'customers.html', label: 'Customers', ico: '☺' },
    { href: 'inventory.html', label: 'Inventory', ico: '⛁' },
    { href: 'coupons.html', label: 'Coupons', ico: '🏷' },
    { href: 'reviews.html', label: 'Reviews', ico: '★' },
    { href: 'analytics.html', label: 'Analytics', ico: '📈' },
    { href: 'settings.html', label: 'Settings', ico: '⚙' }
  ];

  function currentPage() { return location.pathname.split('/').pop(); }

  function renderShell() {
    const page = currentPage();
    const shell = document.getElementById('adminShell');
    if (!shell) return;
    const links = NAV.map(n => `<a href="${n.href}" class="${n.href === page ? 'active' : ''}"><span class="ico">${n.ico}</span>${n.label}</a>`).join('');
    shell.innerHTML = `
      <aside class="sidebar" id="sidebar">
        <div class="brand">
          <img src="../images/misc/logo.svg" alt="LUXORA">
          <span class="brand-name">LUXORA</span>
        </div>
        <nav class="side-nav">${links}</nav>
        <div class="side-foot">
          <a href="../index.html" target="_blank">↗ View Store</a>
          <a href="#" id="logoutBtn">⏻ Logout</a>
        </div>
      </aside>
      <div class="admin-main">
        <div class="admin-topbar">
          <button class="menu-toggle-admin" id="menuToggleAdmin" aria-label="Menu">☰</button>
          <h1 id="pageTitle">${NAV.find(n => n.href === page)?.label || 'Admin'}</h1>
          <div class="spacer"></div>
          <div class="top-actions">
            <span class="muted" id="adminCurrency" style="font-size:13px"></span>
            <a href="../index.html" class="btn btn-outline btn-sm">View Store</a>
          </div>
        </div>
        <div class="admin-content" id="adminContent"></div>
      </div>`;

    document.getElementById('logoutBtn').addEventListener('click', (e) => { e.preventDefault(); logout(); });
    const mt = document.getElementById('menuToggleAdmin');
    if (mt) mt.addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
    document.getElementById('adminCurrency').textContent = 'Currency: ' + CUR.getCode();
  }

  // ---------- Charts (pure SVG, no deps) ----------
  function lineChart(el, data, opts) {
    opts = opts || {};
    const w = el.clientWidth || 600, h = 280, pad = 36;
    const max = Math.max(...data, 1);
    const step = (w - pad * 2) / (data.length - 1 || 1);
    const pts = data.map((v, i) => [pad + i * step, h - pad - (v / max) * (h - pad * 2)]);
    const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const area = path + ` L${pts[pts.length - 1][0].toFixed(1)} ${h - pad} L${pts[0][0].toFixed(1)} ${h - pad} Z`;
    const grid = [0, .25, .5, .75, 1].map(g => {
      const y = pad + g * (h - pad * 2);
      return `<line x1="${pad}" y1="${y}" x2="${w - pad}" y2="${y}" stroke="rgba(255,255,255,.06)"/>`;
    }).join('');
    const dots = pts.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="#c9a24b"/>`).join('');
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" preserveAspectRatio="none">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9a24b" stop-opacity=".35"/><stop offset="1" stop-color="#c9a24b" stop-opacity="0"/></linearGradient></defs>
      ${grid}
      <path d="${area}" fill="url(#lg)"/>
      <path d="${path}" fill="none" stroke="#c9a24b" stroke-width="2.5"/>
      ${dots}
    </svg>`;
  }

  function barChart(el, data, labels, colors) {
    const w = el.clientWidth || 600, h = 280, pad = 36;
    const max = Math.max(...data, 1);
    const bw = (w - pad * 2) / data.length * 0.6;
    const gap = (w - pad * 2) / data.length;
    const bars = data.map((v, i) => {
      const bh = (v / max) * (h - pad * 2);
      const x = pad + i * gap + (gap - bw) / 2;
      const y = h - pad - bh;
      const c = (colors && colors[i]) || '#c9a24b';
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="5" fill="${c}"/>
        <text x="${(x + bw / 2).toFixed(1)}" y="${(h - 12).toFixed(1)}" fill="#9a9aa6" font-size="11" text-anchor="middle">${labels[i]}</text>`;
    }).join('');
    const grid = [0, .5, 1].map(g => { const y = pad + g * (h - pad * 2); return `<line x1="${pad}" y1="${y}" x2="${w - pad}" y2="${y}" stroke="rgba(255,255,255,.06)"/>`; }).join('');
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" preserveAspectRatio="none">${grid}${bars}</svg>`;
  }

  function donutChart(el, segments) {
    const size = 200, r = 80, cx = size / 2, cy = size / 2, total = segments.reduce((s, x) => s + x.value, 0) || 1;
    let angle = -90;
    const arcs = segments.map(seg => {
      const frac = seg.value / total;
      const a2 = angle + frac * 360;
      const large = frac > 0.5 ? 1 : 0;
      const x1 = cx + r * Math.cos(angle * Math.PI / 180), y1 = cy + r * Math.sin(angle * Math.PI / 180);
      const x2 = cx + r * Math.cos(a2 * Math.PI / 180), y2 = cy + r * Math.sin(a2 * Math.PI / 180);
      const path = `M${cx} ${cy} L${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
      angle = a2;
      return `<path d="${path}" fill="${seg.color}"/>`;
    }).join('');
    el.innerHTML = `<svg viewBox="0 0 ${size} ${size}" width="200" height="200">${arcs}<circle cx="${cx}" cy="${cy}" r="${r - 34}" fill="var(--surface)"/></svg>`;
  }

  window.LUXORA_ADMIN = {
    isLoggedIn, login, logout, requireAuth, toast, renderShell, NAV,
    lineChart, barChart, donutChart, confirmDialog, showLoading, hideLoading, IMG
  };
})();
