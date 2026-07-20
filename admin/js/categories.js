/* LUXORA - Admin Categories */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, ADMIN = window.LUXORA_ADMIN;
  ADMIN.requireAuth();
  ADMIN.renderShell();
  const root = document.getElementById('adminContent');

  function render() {
    const cats = DB.getCategories();
    const products = DB.getProducts();
    root.innerHTML = `
      <div class="toolbar">
        <div class="search"><input type="text" id="search" placeholder="Search categories…"></div>
        <button class="btn btn-gold" id="addBtn">+ Add Category</button>
      </div>
      <div class="panel">
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Image</th><th>Name</th><th>Products</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody id="rows"></tbody>
          </table>
        </div>
      </div>`;
    drawRows(cats, products);
    document.getElementById('addBtn').addEventListener('click', () => openModal(null));
    document.getElementById('cancelCat').addEventListener('click', () => document.getElementById('catModal').classList.remove('open'));
    document.getElementById('search').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      drawRows(DB.getCategories().filter(c => c.name.toLowerCase().includes(q)), DB.getProducts());
    });
    document.getElementById('catForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.target;
      if (!f.elements['name'].value.trim()) { f.elements['name'].closest('.field').classList.add('invalid'); return; }
      save(f, products);
    });
  }

  function drawRows(cats, products) {
    const tb = document.getElementById('rows');
    if (!cats.length) { tb.innerHTML = `<tr><td colspan="5" class="empty-state">No categories.</td></tr>`; return; }
    tb.innerHTML = cats.map(c => `
      <tr>
        <td><img class="thumb" src="${c.image}" alt="${c.name}" onerror="this.src='../images/categories/footwear.svg'"></td>
        <td class="cell-name">${c.name}</td>
        <td>${products.filter(p => p.category === c.id).length}</td>
        <td class="cell-sub">${c.description || ''}</td>
        <td><button class="btn btn-outline btn-sm" data-edit="${c.id}">Edit</button>
            <button class="btn btn-danger btn-sm" data-del="${c.id}">Delete</button></td>
      </tr>`).join('');
    tb.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openModal(b.dataset.edit)));
    tb.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => del(b.dataset.del)));
  }

  function openModal(id) {
    const f = document.getElementById('catForm');
    f.reset();
    if (id) {
      const c = DB.getCategories().find(x => x.id === id);
      document.getElementById('catModalTitle').textContent = 'Edit Category';
      f.elements['id'].value = c.id;
      f.elements['name'].value = c.name;
      f.elements['image'].value = c.image;
      f.elements['description'].value = c.description || '';
    } else { document.getElementById('catModalTitle').textContent = 'Add Category'; f.elements['id'].value = ''; }
    document.getElementById('catModal').classList.add('open');
  }

  function save(f, products) {
    const cats = DB.getCategories();
    const id = f.elements['id'].value;
    const name = f.elements['name'].value.trim();
    const slug = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const data = { id: slug, name, image: f.elements['image'].value || 'images/categories/footwear.svg', description: f.elements['description'].value.trim() };
    if (id) { const i = cats.findIndex(c => c.id === id); cats[i] = data; ADMIN.toast('Category updated', 'success'); }
    else { cats.push(data); ADMIN.toast('Category added', 'success'); }
    DB.setCategories(cats);
    document.getElementById('catModal').classList.remove('open');
    render();
  }

  function del(id) {
    ADMIN.confirmDialog({ title: 'Delete Category', message: 'Delete this category permanently?', confirmText: 'Delete', danger: true })
      .then(ok => { if (!ok) return; DB.setCategories(DB.getCategories().filter(c => c.id !== id)); ADMIN.toast('Category deleted', 'success'); render(); });
  }

  render();
})();
