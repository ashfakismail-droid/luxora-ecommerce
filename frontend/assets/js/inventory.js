/* LUXORA - Admin Inventory */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, ADMIN = window.LUXORA_ADMIN;
  ADMIN.requireAuth();
  ADMIN.renderShell();
  const root = document.getElementById('adminContent');

  function render() {
    const products = DB.getProducts();
    const low = products.filter(p => p.stock <= 20).length;
    const out = products.filter(p => p.stock === 0).length;
    root.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card"><div class="s-label">Total SKUs</div><div class="s-value">${products.length}</div></div>
        <div class="stat-card"><div class="s-label">Low Stock (≤20)</div><div class="s-value">${low}</div><div class="s-sub down">needs attention</div></div>
        <div class="stat-card"><div class="s-label">Out of Stock</div><div class="s-value">${out}</div><div class="s-sub down">${out ? 'restock' : 'all good'}</div></div>
        <div class="stat-card"><div class="s-label">Units Total</div><div class="s-value">${products.reduce((s, p) => s + p.stock, 0)}</div></div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Stock Levels</h3>
          <div class="toolbar" style="margin:0">
            <div class="search"><input type="text" id="search" placeholder="Search…"></div>
            <select id="filter"><option value="">All</option><option value="low">Low Stock</option><option value="out">Out of Stock</option></select>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Adjust</th><th>Status</th></tr></thead>
            <tbody id="rows"></tbody>
          </table>
        </div>
      </div>`;
    drawRows(products);
    document.getElementById('search').addEventListener('input', filter);
    document.getElementById('filter').addEventListener('change', filter);
  }

  function drawRows(list) {
    const tb = document.getElementById('rows');
    if (!list.length) { tb.innerHTML = `<tr><td colspan="5" class="empty-state">No products.</td></tr>`; return; }
    tb.innerHTML = list.map(p => {
      const lvl = p.stock === 0 ? '<span class="badge-pill b-inactive">Out</span>' : (p.stock <= 20 ? '<span class="badge-pill b-sale">Low</span>' : '<span class="badge-pill b-active">OK</span>');
      return `<tr>
        <td class="cell-name">${p.name}</td>
        <td class="cell-sub">${p.category}</td>
        <td><strong>${p.stock}</strong></td>
        <td>
          <button class="btn btn-outline btn-sm" data-dec="${p.id}">−</button>
          <button class="btn btn-outline btn-sm" data-inc="${p.id}">+</button>
          <input type="number" id="set-${p.id}" value="${p.stock}" style="width:70px;padding:6px;border-radius:8px;border:1px solid var(--line);background:var(--bg);color:var(--text)">
          <button class="btn btn-gold btn-sm" data-set="${p.id}">Set</button>
        </td>
        <td>${lvl}</td>
      </tr>`;
    }).join('');
    tb.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => adjust(b.dataset.inc, 1)));
    tb.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => adjust(b.dataset.dec, -1)));
    tb.querySelectorAll('[data-set]').forEach(b => b.addEventListener('click', () => {
      const v = parseInt(document.getElementById('set-' + b.dataset.set).value) || 0;
      setStock(b.dataset.set, v);
    }));
  }

  function filter() {
    const q = document.getElementById('search').value.toLowerCase();
    const f = document.getElementById('filter').value;
    let list = DB.getProducts();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q));
    if (f === 'low') list = list.filter(p => p.stock > 0 && p.stock <= 20);
    if (f === 'out') list = list.filter(p => p.stock === 0);
    drawRows(list);
  }

  function adjust(id, delta) {
    const list = DB.getProducts();
    const p = list.find(x => x.id === id);
    if (p) { p.stock = Math.max(0, p.stock + delta); p.status = p.stock > 0 ? 'active' : 'out'; DB.setProducts(list); render(); }
  }
  function setStock(id, v) {
    const list = DB.getProducts();
    const p = list.find(x => x.id === id);
    if (p) { p.stock = Math.max(0, v); p.status = p.stock > 0 ? 'active' : 'out'; DB.setProducts(list); ADMIN.toast('Stock updated', 'success'); render(); }
  }

  render();
})();
