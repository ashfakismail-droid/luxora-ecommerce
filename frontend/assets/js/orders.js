/* LUXORA - Admin Orders */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, CUR = window.LUXORA_CURRENCY, ADMIN = window.LUXORA_ADMIN;
  ADMIN.requireAuth();
  ADMIN.renderShell();
  const root = document.getElementById('adminContent');
  const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  function render() {
    const orders = DB.getOrders();
    root.innerHTML = `
      <div class="toolbar">
        <div class="search"><input type="text" id="search" placeholder="Search order id or customer…"></div>
        <select id="filterStatus"><option value="">All Status</option>${STATUSES.map(s => `<option value="${s}">${s}</option>`).join('')}</select>
      </div>
      <div class="panel">
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="rows"></tbody>
          </table>
        </div>
      </div>`;
    drawRows(orders);
    document.getElementById('search').addEventListener('input', filter);
    document.getElementById('filterStatus').addEventListener('change', filter);
  }

  function drawRows(list) {
    const tb = document.getElementById('rows');
    if (!list.length) { tb.innerHTML = `<tr><td colspan="8" class="empty-state">No orders found.</td></tr>`; return; }
    tb.innerHTML = list.map(o => `
      <tr>
        <td class="cell-name">${o.id}</td>
        <td>${o.customer.name}<div class="cell-sub">${o.customer.email}</div></td>
        <td class="cell-sub">${o.date}</td>
        <td>${(o.items || []).reduce((s, i) => s + i.qty, 0)}</td>
        <td data-price="${o.total}">${CUR.format(o.total)}</td>
        <td class="cell-sub">${o.payment}</td>
        <td><span class="badge-pill status-${o.status}">${o.status}</span></td>
        <td>
          <select data-status="${o.id}" class="status-select">
            ${STATUSES.map(s => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </td>
      </tr>`).join('');
    tb.querySelectorAll('[data-status]').forEach(sel => sel.addEventListener('change', () => updateStatus(sel.dataset.status, sel.value)));
    refreshPrices();
  }

  function filter() {
    const q = document.getElementById('search').value.toLowerCase();
    const st = document.getElementById('filterStatus').value;
    let list = DB.getOrders();
    if (q) list = list.filter(o => o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q));
    if (st) list = list.filter(o => o.status === st);
    drawRows(list);
  }

  function updateStatus(id, status) {
    const orders = DB.getOrders();
    const o = orders.find(x => x.id === id);
    if (o) { o.status = status; DB.setOrders(orders); ADMIN.toast('Order ' + id + ' → ' + status, 'success'); }
  }

  function refreshPrices() {
    document.querySelectorAll('[data-price]').forEach(el => { const v = parseFloat(el.getAttribute('data-price')); if (!isNaN(v)) el.textContent = CUR.format(v); });
  }

  render();
})();
