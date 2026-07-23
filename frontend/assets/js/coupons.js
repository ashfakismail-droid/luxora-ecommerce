/* LUXORA - Admin Coupons */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, ADMIN = window.LUXORA_ADMIN;
  ADMIN.requireAuth();
  ADMIN.renderShell();
  const root = document.getElementById('adminContent');

  function render() {
    const coupons = DB.getCoupons();
    root.innerHTML = `
      <div class="toolbar">
        <div class="search"><input type="text" id="search" placeholder="Search codes…"></div>
        <button class="btn btn-gold" id="addBtn">+ Add Coupon</button>
      </div>
      <div class="panel">
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="rows"></tbody>
          </table>
        </div>
      </div>`;
    drawRows(coupons);
    document.getElementById('addBtn').addEventListener('click', () => openModal(null));
    document.getElementById('cancelCoupon').addEventListener('click', () => document.getElementById('couponModal').classList.remove('open'));
    document.getElementById('search').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      drawRows(DB.getCoupons().filter(c => c.code.toLowerCase().includes(q)));
    });
    document.getElementById('couponForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.target;
      if (!f.elements['code'].value.trim() || !f.elements['value'].value) { f.querySelectorAll('input[required]').forEach(i => { if (!i.value.trim()) i.closest('.field').classList.add('invalid'); }); return; }
      save(f);
    });
  }

  function drawRows(list) {
    const tb = document.getElementById('rows');
    if (!list.length) { tb.innerHTML = `<tr><td colspan="7" class="empty-state">No coupons.</td></tr>`; return; }
    tb.innerHTML = list.map((c, i) => `
      <tr>
        <td class="cell-name">${c.code}</td>
        <td class="cell-sub">${c.type}</td>
        <td>${c.type === 'percent' ? c.value + '%' : '$' + c.value}</td>
        <td>$${c.min || 0}</td>
        <td class="cell-sub">${c.expires || '-'}</td>
        <td><span class="badge-pill ${c.active ? 'b-active' : 'b-inactive'}">${c.active ? 'Active' : 'Inactive'}</span></td>
        <td><button class="btn btn-outline btn-sm" data-edit="${i}">Edit</button>
            <button class="btn btn-danger btn-sm" data-del="${i}">Delete</button></td>
      </tr>`).join('');
    tb.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openModal(+b.dataset.edit)));
    tb.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => del(+b.dataset.del)));
  }

  function openModal(idx) {
    const f = document.getElementById('couponForm');
    f.reset();
    if (idx != null) {
      const c = DB.getCoupons()[idx];
      document.getElementById('couponTitle').textContent = 'Edit Coupon';
      f.elements['idx'].value = idx;
      f.elements['code'].value = c.code;
      f.elements['type'].value = c.type;
      f.elements['value'].value = c.value;
      f.elements['min'].value = c.min || 0;
      f.elements['expires'].value = c.expires || '';
      f.elements['active'].value = String(c.active);
    } else { document.getElementById('couponTitle').textContent = 'Add Coupon'; f.elements['idx'].value = ''; }
    document.getElementById('couponModal').classList.add('open');
  }

  function save(f) {
    const coupons = DB.getCoupons();
    const idx = f.elements['idx'].value;
    const data = {
      code: f.elements['code'].value.trim().toUpperCase(),
      type: f.elements['type'].value,
      value: parseFloat(f.elements['value'].value) || 0,
      min: parseFloat(f.elements['min'].value) || 0,
      expires: f.elements['expires'].value,
      active: f.elements['active'].value === 'true'
    };
    if (idx === '') { coupons.push(data); ADMIN.toast('Coupon added', 'success'); }
    else { coupons[idx] = data; ADMIN.toast('Coupon updated', 'success'); }
    DB.setCoupons(coupons);
    document.getElementById('couponModal').classList.remove('open');
    render();
  }

  function del(idx) {
    ADMIN.confirmDialog({ title: 'Delete Coupon', message: 'Delete this coupon permanently?', confirmText: 'Delete', danger: true })
      .then(ok => { if (!ok) return; const coupons = DB.getCoupons(); coupons.splice(idx, 1); DB.setCoupons(coupons); ADMIN.toast('Coupon deleted', 'success'); render(); });
  }

  render();
})();
