/* LUXORA - Admin Reviews */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, ADMIN = window.LUXORA_ADMIN;
  ADMIN.requireAuth();
  ADMIN.renderShell();
  const root = document.getElementById('adminContent');

  function stars(r) { return '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r)); }

  function render() {
    const reviews = DB.getReviews();
    const pending = reviews.filter(r => r.status === 'pending').length;
    root.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card"><div class="s-label">Total Reviews</div><div class="s-value">${reviews.length}</div></div>
        <div class="stat-card"><div class="s-label">Pending</div><div class="s-value">${pending}</div><div class="s-sub down">awaiting</div></div>
        <div class="stat-card"><div class="s-label">Approved</div><div class="s-value">${reviews.filter(r => r.status === 'approved').length}</div></div>
        <div class="stat-card"><div class="s-label">Avg Rating</div><div class="s-value">${(reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1)).toFixed(1)}</div></div>
      </div>
      <div class="toolbar">
        <select id="filter"><option value="">All</option><option value="pending">Pending</option><option value="approved">Approved</option></select>
      </div>
      <div class="panel">
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Product</th><th>Author</th><th>Rating</th><th>Title</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="rows"></tbody>
          </table>
        </div>
      </div>`;
    drawRows(reviews);
    document.getElementById('filter').addEventListener('change', (e) => {
      const f = e.target.value;
      drawRows(f ? DB.getReviews().filter(r => r.status === f) : DB.getReviews());
    });
  }

  function drawRows(list) {
    const tb = document.getElementById('rows');
    if (!list.length) { tb.innerHTML = `<tr><td colspan="7" class="empty-state">No reviews.</td></tr>`; return; }
    tb.innerHTML = list.map(r => {
      const p = DB.getProduct(r.productId);
      return `<tr>
        <td class="cell-name">${p ? p.name : r.productId}</td>
        <td>${r.name}</td>
        <td style="color:var(--gold)">${stars(r.rating)}</td>
        <td>${r.title}</td>
        <td class="cell-sub">${r.date}</td>
        <td><span class="badge-pill ${r.status === 'approved' ? 'b-active' : 'b-sale'}">${r.status}</span></td>
        <td>
          ${r.status === 'pending' ? '<button class="btn btn-success btn-sm" data-app="' + r.id + '">Approve</button>' : ''}
          <button class="btn btn-danger btn-sm" data-del="${r.id}">Delete</button>
        </td>
      </tr>`;
    }).join('');
    tb.querySelectorAll('[data-app]').forEach(b => b.addEventListener('click', () => setStatus(b.dataset.app, 'approved')));
    tb.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => del(b.dataset.del)));
  }

  function setStatus(id, status) {
    const list = DB.getReviews();
    const r = list.find(x => x.id === id);
    if (r) { r.status = status; DB.setReviews(list); ADMIN.toast('Review ' + status, 'success'); render(); }
  }
  function del(id) {
    ADMIN.confirmDialog({ title: 'Delete Review', message: 'Delete this review permanently?', confirmText: 'Delete', danger: true })
      .then(ok => { if (!ok) return; DB.setReviews(DB.getReviews().filter(r => r.id !== id)); ADMIN.toast('Review deleted', 'success'); render(); });
  }

  render();
})();
