/* LUXORA - Admin Categories */
(function () {
  'use strict';
  const ADMIN = window.LUXORA_ADMIN;
  ADMIN.requireAuth();
  ADMIN.renderShell();
  const root = document.getElementById('adminContent');
  let categories = [];
  let products = [];

  function apiData(result) { return result && result.data ? result.data : []; }
  function normalizeCategory(c) {
    return {
      id: c.id || c.slug,
      slug: c.slug || String(c.id),
      name: c.name || c.slug || String(c.id),
      image: c.image || '../images/categories/footwear.svg',
      description: c.description || ''
    };
  }
  function normalizeProduct(p) { return { category: p.category || '' }; }

  async function loadData() {
    ADMIN.showLoading(root);
    try {
      const [categoryResult, productResult] = await Promise.all([
        ADMIN.apiRequest('/categories'),
        ADMIN.apiRequest('/products')
      ]);
      categories = apiData(categoryResult).map(normalizeCategory);
      products = apiData(productResult).map(normalizeProduct);
      render();
    } catch (err) {
      root.innerHTML = `<div class="panel empty-state">${err.message || 'Failed to load categories.'}</div>`;
      ADMIN.toast(err.message || 'Failed to load categories.', 'error');
    } finally {
      ADMIN.hideLoading(root);
    }
  }

  function render() {
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
    drawRows(categories, products);
    document.getElementById('addBtn').addEventListener('click', () => openModal(null));
    document.getElementById('cancelCat').addEventListener('click', () => document.getElementById('catModal').classList.remove('open'));
    document.getElementById('search').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      drawRows(categories.filter(c => c.name.toLowerCase().includes(q)), products);
    });
    document.getElementById('catForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.target;
      const name = f.elements['name'].value.trim();
      if (!name) { 
        f.elements['name'].closest('.field').classList.add('invalid'); 
        ADMIN.toast('Category name is required', 'error');
        return; 
      }
      f.elements['name'].closest('.field').classList.remove('invalid');
      save(f);
    });
  }

  function drawRows(cats, products) {
    const tb = document.getElementById('rows');
    if (!cats.length) { tb.innerHTML = `<tr><td colspan="5" class="empty-state">No categories.</td></tr>`; return; }
    tb.innerHTML = cats.map(c => `
      <tr>
        <td><img class="thumb" src="${c.image}" alt="${c.name}" onerror="this.src='../images/categories/footwear.svg'"></td>
        <td class="cell-name">${c.name}</td>
        <td>${products.filter(p => p.category === c.name || p.category === c.id || p.category === c.slug).length}</td>
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
      const c = categories.find(x => String(x.id) === String(id));
      if (!c) { ADMIN.toast('Category not found', 'error'); return; }
      document.getElementById('catModalTitle').textContent = 'Edit Category';
      f.elements['id'].value = c.id;
      f.elements['name'].value = c.name;
      f.elements['image'].value = c.image;
      f.elements['description'].value = c.description || '';
    } else { 
      document.getElementById('catModalTitle').textContent = 'Add Category'; 
      f.elements['id'].value = ''; 
    }
    document.getElementById('catModal').classList.add('open');
  }

  async function save(f) {
    const id = f.elements['id'].value;
    const data = {
      name: f.elements['name'].value.trim(),
      image: f.elements['image'].value.trim(),
      description: f.elements['description'].value.trim()
    };

    ADMIN.showLoading(root);
    try {
      if (id) {
        await ADMIN.apiRequest('/categories/' + encodeURIComponent(id), {
          method: 'PUT',
          body: JSON.stringify(data)
        });
        ADMIN.toast('Category updated successfully', 'success');
      } else {
        await ADMIN.apiRequest('/categories', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        ADMIN.toast('Category created successfully', 'success');
      }
      document.getElementById('catModal').classList.remove('open');
      await loadData();
    } catch (err) {
      ADMIN.toast(err.message || 'Failed to save category', 'error');
    } finally {
      ADMIN.hideLoading(root);
    }
  }

  function del(id) {
    ADMIN.confirmDialog({ 
      title: 'Delete Category', 
      message: 'This action cannot be undone. Delete this category permanently?', 
      confirmText: 'Delete', 
      danger: true 
    }).then(async (ok) => {
      if (!ok) return;
      ADMIN.showLoading(root);
      try {
        await ADMIN.apiRequest('/categories/' + encodeURIComponent(id), {
          method: 'DELETE'
        });
        ADMIN.toast('Category deleted successfully', 'success');
        await loadData();
      } catch (err) {
        ADMIN.toast(err.message || 'Failed to delete category', 'error');
      } finally {
        ADMIN.hideLoading(root);
      }
    });
  }

  loadData();
})();
