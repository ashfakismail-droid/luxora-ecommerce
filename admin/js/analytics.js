/* LUXORA - Admin Analytics */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, CUR = window.LUXORA_CURRENCY, ADMIN = window.LUXORA_ADMIN;
  ADMIN.requireAuth();
  ADMIN.renderShell();
  const root = document.getElementById('adminContent');

  function render() {
    const products = DB.getProducts();
    const orders = DB.getOrders();
    const cats = DB.getCategories();
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

    // monthly revenue (synthetic 12 months)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthly = months.map((_, i) => Math.round((revenue / 12 || 800) * (0.5 + Math.random() * 1.2) + i * 40));

    // popular products by (reviews + sales proxy)
    const popular = products.slice().sort((a, b) => (b.reviews + b.stock / 10) - (a.reviews + a.stock / 10)).slice(0, 6);
    const popLabels = popular.map(p => p.name.split(' ').slice(-1)[0]);
    const popData = popular.map(p => p.reviews + 10);

    // category distribution
    const catCounts = cats.map(c => products.filter(p => p.category === c.id).length);
    const palette = ['#c9a24b', '#e8c878', '#5b9dff', '#a98bff', '#4caf7d', '#e0556b', '#6ea8ff', '#d8b46a'];

    root.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card"><div class="s-label">Revenue</div><div class="s-value" data-price="${revenue}">${CUR.format(revenue)}</div></div>
        <div class="stat-card"><div class="s-label">Orders</div><div class="s-value">${orders.length}</div></div>
        <div class="stat-card"><div class="s-label">Avg Order</div><div class="s-value" data-price="${orders.length ? revenue / orders.length : 0}">${CUR.format(orders.length ? revenue / orders.length : 0)}</div></div>
        <div class="stat-card"><div class="s-label">Products</div><div class="s-value">${products.length}</div></div>
      </div>

      <div class="panel" style="margin-bottom:20px">
        <div class="panel-head"><h3>Monthly Revenue</h3></div>
        <div class="chart-box" id="revChart"></div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <div class="panel-head"><h3>Popular Products</h3></div>
          <div class="chart-box" id="popChart"></div>
        </div>
        <div class="panel">
          <div class="panel-head"><h3>Category Distribution</h3></div>
          <div id="catDonut" style="display:flex;justify-content:center;margin-bottom:14px"></div>
          <div class="chart-legend" id="catLegend"></div>
        </div>
      </div>`;

    ADMIN.lineChart(document.getElementById('revChart'), monthly);
    ADMIN.barChart(document.getElementById('popChart'), popData, popLabels, palette);
    ADMIN.donutChart(document.getElementById('catDonut'), cats.map((c, i) => ({ value: catCounts[i] || 0, color: palette[i % palette.length] })));
    document.getElementById('catLegend').innerHTML = cats.map((c, i) => `<div class="lg"><span class="dot" style="background:${palette[i % palette.length]}"></span>${c.name} (${catCounts[i] || 0})</div>`).join('');
    refreshPrices();
  }

  function refreshPrices() {
    document.querySelectorAll('[data-price]').forEach(el => { const v = parseFloat(el.getAttribute('data-price')); if (!isNaN(v)) el.textContent = CUR.format(v); });
  }

  render();
})();
