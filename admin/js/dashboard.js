/* LUXORA - Admin Dashboard */
(function () {
  'use strict';
  const CUR = window.LUXORA_CURRENCY, ADMIN = window.LUXORA_ADMIN;
  ADMIN.requireAuth();
  ADMIN.renderShell();
  const root = document.getElementById('adminContent');
  let state = { products: [], orders: [], customers: [], reviews: [], categories: [] };

  function apiData(result) { return result && result.data ? result.data : []; }
  function normalizeProduct(p) { return { id: String(p.id), name: p.name || '', category: p.category || '', stock: Number(p.stock || 0) }; }
  function normalizeOrder(o) {
    const address = o.shipping_address || {};
    return {
      id: o.id,
      customerName: o.customer_name || address.name || address.fullName || o.user_id || 'Customer',
      createdAt: o.created_at || '',
      date: o.created_at ? new Date(o.created_at).toLocaleDateString() : '',
      total: Number(o.total || 0),
      status: o.status || 'pending'
    };
  }
  function normalizeCategory(c) { return { id: c.slug || c.name || String(c.id), name: c.name || c.slug || String(c.id) }; }

  async function loadData() {
    ADMIN.showLoading(root);
    try {
      const [productResult, orderResult, categoryResult, reviewResult, customerResult] = await Promise.all([
        ADMIN.apiRequest('/products'),
        ADMIN.apiRequest('/orders'),
        ADMIN.apiRequest('/categories'),
        ADMIN.apiRequest('/reviews'),
        ADMIN.apiRequest('/users').catch(() => ({ data: [] }))
      ]);
      state = {
        products: apiData(productResult).map(normalizeProduct),
        orders: apiData(orderResult).map(normalizeOrder),
        categories: apiData(categoryResult).map(normalizeCategory),
        reviews: apiData(reviewResult),
        customers: apiData(customerResult)
      };
      render();
    } catch (err) {
      root.innerHTML = `<div class="panel empty-state">${err.message || 'Failed to load dashboard.'}</div>`;
      ADMIN.toast(err.message || 'Failed to load dashboard.', 'error');
    } finally {
      ADMIN.hideLoading(root);
    }
  }

  function compute() {
    const products = state.products;
    const orders = state.orders;
    const customers = state.customers;
    const reviews = state.reviews;
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pending = orders.filter(o => o.status === 'pending').length;
    const lowStock = products.filter(p => p.stock <= 20).length;
    return { products, orders, customers, reviews, revenue, pending, lowStock };
  }

  function render() {
    const c = compute();
    const recent = c.orders.slice(0, 6);
    const sales = salesSeries(c.orders);

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
      <tr><td class="cell-name">${o.id}</td><td>${o.customerName}</td><td class="cell-sub">${o.date}</td><td data-price="${o.total}">${CUR.format(o.total)}</td><td><span class="badge-pill status-${o.status}">${o.status}</span></td></tr>`).join('')
      : `<tr><td colspan="5" class="empty-state">No orders yet.</td></tr>`;
    refreshPrices();
  }

  function salesSeries(orders) {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    const totals = days.map(day => orders
      .filter(o => o.createdAt && new Date(o.createdAt).toISOString().slice(0, 10) === day)
      .reduce((sum, o) => sum + o.total, 0));
    return totals.some(Boolean) ? totals : [0, 0, 0, 0, 0, 0, 0];
  }

  function renderCatDonut(products) {
    const cats = state.categories;
    const counts = cats.map(cat => products.filter(p => p.category === cat.id).length);
    const palette = ['#c9a24b', '#e8c878', '#5b9dff', '#a98bff', '#4caf7d', '#e0556b', '#6ea8ff', '#d8b46a'];
    ADMIN.donutChart(document.getElementById('catDonut'), cats.map((c, i) => ({ value: counts[i] || 0, color: palette[i % palette.length] })));
    document.getElementById('catLegend').innerHTML = cats.map((c, i) => `<div class="lg"><span class="dot" style="background:${palette[i % palette.length]}"></span>${c.name} (${counts[i] || 0})</div>`).join('');
  }

  function refreshPrices() {
    document.querySelectorAll('[data-price]').forEach(el => { const v = parseFloat(el.getAttribute('data-price')); if (!isNaN(v)) el.textContent = CUR.format(v); });
  }

  loadData();
})();
