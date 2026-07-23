/* LUXORA - Admin Dashboard */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, CUR = window.LUXORA_CURRENCY, ADMIN = window.LUXORA_ADMIN, STORE = window.LUXORA_STORE;
  ADMIN.requireAuth();
  ADMIN.renderShell();
  const root = document.getElementById('adminContent');

  function compute() {
    const products = DB.getProducts();
    const orders = DB.getOrders();
    const customers = DB.getCustomers();
    const reviews = DB.getReviews();
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pending = orders.filter(o => o.status === 'pending').length;
    const lowStock = products.filter(p => p.stock <= 20).length;
    return { products, orders, customers, reviews, revenue, pending, lowStock };
  }

  function render() {
    const c = compute();
    const recent = c.orders.slice(0, 6);
    // sales chart (last 7 "days" derived from orders or synthetic)
    const sales = syntheticSeries(7, c.revenue);

    root.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card"><div class="s-ico">💰</div><div class="s-label">Total Revenue</div><div class="s-value" data-price="${c.revenue}">${CUR.format(c.revenue)}</div><div class="s-sub">↗ live</div></div>
        <div class="stat-card"><div class="s-ico">📦</div><div class="s-label">Orders</div><div class="s-value">${c.orders.length}</div><div class="s-sub">${c.pending} pending</div></div>
        <div class="stat-card"><div class="s-ico">☺</div><div class="s-label">Customers</div><div class="s-value">${c.customers.length}</div><div class="s-sub">↗ registered</div></div>
        <div class="stat-card"><div class="s-ico">◈</div><div class="s-label">Products</div><div class="s-value">${c.products.length}</div><div class="s-sub">${c.lowStock} low stock</div></div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <div class="panel-head"><h3>Revenue (7 days)</h3><span class="muted" data-price="${c.revenue}">${CUR.format(c.revenue)}</span></div>
          <div class="chart-box" id="salesChart"></div>
        </div>
        <div class="panel">
          <div class="panel-head"><h3>Sales by Category</h3></div>
          <div id="catDonut" style="display:flex;justify-content:center"></div>
          <div class="chart-legend" id="catLegend"></div>
        </div>
      </div>

      <div class="panel" style="margin-top:20px">
        <div class="panel-head"><h3>Recent Orders</h3><a href="orders.html" class="btn btn-outline btn-sm">View All</a></div>
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
            <tbody id="recentOrders"></tbody>
          </table>
        </div>
      </div>`;

    ADMIN.lineChart(document.getElementById('salesChart'), sales);
    renderCatDonut(c.products);
    document.getElementById('recentOrders').innerHTML = recent.length ? recent.map(o => `
      <tr><td class="cell-name">${o.id}</td><td>${o.customer.name}</td><td class="cell-sub">${o.date}</td><td data-price="${o.total}">${CUR.format(o.total)}</td><td><span class="badge-pill status-${o.status}">${o.status}</span></td></tr>`).join('')
      : `<tr><td colspan="5" class="empty-state">No orders yet.</td></tr>`;
    refreshPrices();
  }

  function syntheticSeries(n, total) {
    const base = total > 0 ? total / (n * 3) : 1200;
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(Math.round(base * (0.6 + Math.random() * 0.9)));
    return arr;
  }

  function renderCatDonut(products) {
    const cats = DB.getCategories();
    const counts = cats.map(cat => products.filter(p => p.category === cat.id).length);
    const palette = ['#c9a24b', '#e8c878', '#5b9dff', '#a98bff', '#4caf7d', '#e0556b', '#6ea8ff', '#d8b46a'];
    ADMIN.donutChart(document.getElementById('catDonut'), cats.map((c, i) => ({ value: counts[i] || 0, color: palette[i % palette.length] })));
    document.getElementById('catLegend').innerHTML = cats.map((c, i) => `<div class="lg"><span class="dot" style="background:${palette[i % palette.length]}"></span>${c.name} (${counts[i] || 0})</div>`).join('');
  }

  function refreshPrices() {
    document.querySelectorAll('[data-price]').forEach(el => { const v = parseFloat(el.getAttribute('data-price')); if (!isNaN(v)) el.textContent = CUR.format(v); });
  }

  render();
})();
