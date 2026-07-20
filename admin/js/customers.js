/* LUXORA - Admin Customers */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, CUR = window.LUXORA_CURRENCY, ADMIN = window.LUXORA_ADMIN;
  ADMIN.requireAuth();
  ADMIN.renderShell();
  const root = document.getElementById('adminContent');

  function render() {
    const customers = DB.getCustomers();
    const orders = DB.getOrders();
    root.innerHTML = `
      <div class="toolbar">
        <div class="search"><input type="text" id="search" placeholder="Search customers…"></div>
        <select id="filterStatus"><option value="">All Status</option><option value="active">Active</option><option value="banned">Banned</option></select>
      </div>
      <div class="panel">
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="rows"></tbody>
          </table>
        </div>
      </div>`;
    drawRows(customers);
    document.getElementById('search').addEventListener('input', filter);
    document.getElementById('filterStatus').addEventListener('change', filter);
  }

  function drawRows(list) {
    const tb = document.getElementById('rows');
    if (!list.length) { tb.innerHTML = `<tr><td colspan="7" class="empty-state">No customers yet. Orders placed in the store will appear here.</td></tr>`; return; }
    tb.innerHTML = list.map(c => `
      <tr>
        <td class="cell-name">${c.name}</td>
        <td class="cell-sub">${c.email}</td>
        <td class="cell-sub">${c.phone || '-'}</td>
        <td>${c.orders || 0}</td>
        <td class="cell-sub">${c.joined || '-'}</td>
        <td><span class="badge-pill status-${c.status || 'active'}">${c.status || 'active'}</span></td>
        <td>
          <button class="btn btn-outline btn-sm" data-toggle="${c.email}">${c.status === 'banned' ? 'Activate' : 'Ban'}</button>
          <button class="btn btn-danger btn-sm" data-del="${c.email}">Delete</button>
        </td>
      </tr>`).join('');
    tb.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => toggle(b.dataset.toggle)));
    tb.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => del(b.dataset.del)));
  }

  function filter() {
    const q = document.getElementById('search').value.toLowerCase();
    const st = document.getElementById('filterStatus').value;
    let list = DB.getCustomers();
    if (q) list = list.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    if (st) list = list.filter(c => (c.status || 'active') === st);
    drawRows(list);
  }

  function toggle(email) {
    const list = DB.getCustomers();
    const c = list.find(x => x.email === email);
    if (c) { c.status = c.status === 'banned' ? 'active' : 'banned'; DB.setCustomers(list); ADMIN.toast('Customer status updated', 'success'); render(); }
  }
  function del(email) {
    ADMIN.confirmDialog({ title: 'Delete Customer', message: 'Delete this customer permanently?', confirmText: 'Delete', danger: true })
      .then(ok => { if (!ok) return; DB.setCustomers(DB.getCustomers().filter(c => c.email !== email)); ADMIN.toast('Customer deleted', 'success'); render(); });
  }

  render();
})();
