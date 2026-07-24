/* LUXORA - Admin Products */
(function () {
  'use strict';
  const CUR = window.LUXORA_CURRENCY, ADMIN = window.LUXORA_ADMIN;
  ADMIN.requireAuth();
  ADMIN.renderShell();
  const root = document.getElementById('adminContent');
  let pendingImage = null;
  let products = [];
  let categories = [];

  function priceOf(p) { return (p.salePrice && p.salePrice > 0) ? p.salePrice : p.price; }
  function slugify(value) { return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'product'; }
  function normalizeProduct(p) {
    return {
      id: String(p.id),
      name: p.name || '',
      slug: p.slug || slugify(p.name),
      brand: p.brand || '',
      category: p.category || '',
      status: p.is_active === false || Number(p.stock || 0) === 0 ? 'out' : 'active',
      price: Number(p.price || 0),
      salePrice: Number(p.compare_at_price || 0),
      stock: Number(p.stock || 0),
      rating: Number(p.rating || 0),
      reviews: Number(p.reviews_count || 0),
      description: p.description || '',
      colors: Array.isArray(p.colors) ? p.colors : [],
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
      tags: Array.isArray(p.tags) ? p.tags : [],
      featured: !!p.featured,
      bestSeller: !!p.best_seller,
      newArrival: !!p.new_arrival,
      image: p.image || '../images/products/shoes-0.jpg',
      images: Array.isArray(p.images) ? p.images : []
    };
  }
  function normalizeCategory(c) { return { id: c.slug || c.name || String(c.id), name: c.name || c.slug || String(c.id) }; }
  function apiData(result) { return result && result.data ? result.data : []; }
  function currentProduct(id) { return products.find(p => String(p.id) === String(id)); }
  function uniqueBrands() {
    const values = products.map(p => p.brand).filter(Boolean);
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }

  async function loadData() {
    ADMIN.showLoading(root);
    try {
      const [productResult, categoryResult] = await Promise.all([
        ADMIN.apiRequest('/products'),
        ADMIN.apiRequest('/categories')
      ]);
      products = apiData(productResult).map(normalizeProduct);
      categories = apiData(categoryResult).map(normalizeCategory);
      render();
    } catch (err) {
      root.innerHTML = `<div class="panel empty-state">${err.message || 'Failed to load products.'}</div>`;
      ADMIN.toast(err.message || 'Failed to load products.', 'error');
    } finally {
      ADMIN.hideLoading(root);
    }
  }

  function render() {
    const cats = categories;
    const brands = uniqueBrands();

    root.innerHTML = `
      <div class="toolbar">
        <div class="search"><input type="text" id="search" placeholder="Search products…"></div>
        <select id="filterCat"><option value="">All Categories</option>${cats.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select>
        <select id="filterStatus"><option value="">All Status</option><option value="active">Active</option><option value="out">Out of Stock</option></select>
        <button class="btn btn-gold" id="addBtn">+ Add Product</button>
      </div>
      <div class="panel">
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="rows"></tbody>
          </table>
        </div>
      </div>`;

    // populate selects in modal
    document.getElementById('brandSelect').innerHTML = brands.map(b => `<option value="${b}">${b}</option>`).join('') + '<option value="">Other / none</option>';
    document.getElementById('catSelect').innerHTML = cats.map(c => `<option value="${c.name}">${c.name}</option>`).join('');

    bind();
    drawRows(products);
  }

  function drawRows(list) {
    const tb = document.getElementById('rows');
    if (!list.length) { tb.innerHTML = `<tr><td colspan="8" class="empty-state">No products found.</td></tr>`; return; }
    tb.innerHTML = list.map(p => `
      <tr>
        <td><img class="thumb" src="${ADMIN.IMG(p.image)}" alt="${p.name}"></td>
        <td class="cell-name">${p.name}</td>
        <td class="cell-sub">${p.category}</td>
        <td class="cell-sub">${p.brand}</td>
        <td data-price="${priceOf(p)}">${CUR.format(priceOf(p))}</td>
        <td>${p.stock}</td>
        <td><span class="badge-pill ${p.status === 'active' ? 'b-active' : 'b-inactive'}">${p.status === 'active' ? 'Active' : 'Out'}</span>${p.salePrice > 0 ? ' <span class="badge-pill b-sale">Sale</span>' : ''}</td>
        <td>
          <button class="btn btn-outline btn-sm" data-edit="${p.id}">Edit</button>
          <button class="btn btn-danger btn-sm" data-del="${p.id}">Delete</button>
        </td>
      </tr>`).join('');
    tb.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openModal(b.dataset.edit)));
    tb.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => deleteProduct(b.dataset.del)));
    refreshPrices();
  }

  function bind() {
    document.getElementById('addBtn').addEventListener('click', () => openModal(null));
    document.getElementById('cancelProduct').addEventListener('click', closeModal);
    document.getElementById('search').addEventListener('input', filter);
    document.getElementById('filterCat').addEventListener('change', filter);
    document.getElementById('filterStatus').addEventListener('change', filter);

    document.getElementById('imgInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { pendingImage = ev.target.result; document.getElementById('imgPreview').src = pendingImage; };
      reader.readAsDataURL(file);
    });

    document.getElementById('productForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.target;
      if (!f.elements['name'].value.trim() || !f.elements['price'].value || !f.elements['stock'].value) {
        f.querySelectorAll('input[required]').forEach(i => { if (!i.value.trim()) i.closest('.field').classList.add('invalid'); });
        ADMIN.toast('Please complete required fields.', 'error'); return;
      }
      saveProduct(f);
    });
    bindColorAdd();
  }

  function filter() {
    const q = document.getElementById('search').value.toLowerCase();
    const cat = document.getElementById('filterCat').value;
    const st = document.getElementById('filterStatus').value;
    let list = products.slice();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    if (cat) list = list.filter(p => p.category === cat);
    if (st) list = list.filter(p => p.status === st);
    drawRows(list);
  }

  function openModal(id) {
    const f = document.getElementById('productForm');
    f.reset();
    pendingImage = null;
    const modal = document.getElementById('productModal');
    if (id) {
      const p = currentProduct(id);
      if (!p) { ADMIN.toast('Product not found', 'error'); return; }
      document.getElementById('modalTitle').textContent = 'Edit Product';
      f.elements['id'].value = p.id;
      f.elements['name'].value = p.name;
      f.elements['brand'].value = p.brand;
      f.elements['category'].value = p.category;
      f.elements['status'].value = p.status;
      f.elements['price'].value = p.price;
      f.elements['salePrice'].value = p.salePrice || 0;
      f.elements['stock'].value = p.stock;
      f.elements['rating'].value = p.rating;
      f.elements['description'].value = p.description;
      renderColorPicker(p.colors || []);
      f.elements['sizes'].value = (p.sizes || []).join(', ');
      f.elements['tags'].value = (p.tags || []).join(', ');
      f.elements['featured'].checked = !!p.featured;
      f.elements['bestSeller'].checked = !!p.bestSeller;
      f.elements['newArrival'].checked = !!p.newArrival;
      document.getElementById('imgPreview').src = p.image;
    } else {
      document.getElementById('modalTitle').textContent = 'Add Product';
      f.elements['id'].value = '';
      renderColorPicker(['#111111']);
      document.getElementById('imgPreview').src = '../images/products/shoes-0.jpg';
    }
    modal.classList.add('open');
  }

  // ---- Color picker (replaces manual HEX text input) ----
  function renderColorPicker(colors) {
    const wrap = document.getElementById('colorPickerWrap');
    wrap.innerHTML = '';
    (colors && colors.length ? colors : ['#111111']).forEach(c => wrap.appendChild(buildColorRow(c)));
    syncColors();
  }

  function buildColorRow(hex) {
    const row = document.createElement('div');
    row.className = 'color-row';
    const input = document.createElement('input');
    input.type = 'color';
    input.value = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex) ? hex : '#111111';
    input.className = 'color-input';
    const hexLabel = document.createElement('span');
    hexLabel.className = 'color-hex';
    hexLabel.textContent = input.value.toUpperCase();
    input.addEventListener('input', () => { hexLabel.textContent = input.value.toUpperCase(); syncColors(); });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'color-remove';
    remove.textContent = '✕';
    remove.setAttribute('aria-label', 'Remove color');
    remove.addEventListener('click', () => { row.remove(); syncColors(); });
    row.appendChild(input);
    row.appendChild(hexLabel);
    row.appendChild(remove);
    return row;
  }

  function syncColors() {
    const rows = [...document.querySelectorAll('#colorPickerWrap .color-input')];
    const vals = rows.map(r => r.value.toUpperCase());
    document.getElementById('colorsInput').value = vals.join(', ');
    // Hide remove button when only one color remains.
    document.querySelectorAll('#colorPickerWrap .color-row').forEach(r => {
      r.querySelector('.color-remove').style.display = rows.length <= 1 ? 'none' : '';
    });
  }

  function bindColorAdd() {
    const btn = document.getElementById('addColorBtn');
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      document.getElementById('colorPickerWrap').appendChild(buildColorRow('#c9a24b'));
      syncColors();
    });
  }
  function closeModal() { document.getElementById('productModal').classList.remove('open'); }

  async function saveProduct(f) {
    const id = f.elements['id'].value;
    const data = {
      name: f.elements['name'].value.trim(),
      slug: slugify(f.elements['name'].value.trim()),
      brand: f.elements['brand'].value,
      category: f.elements['category'].value,
      price: parseFloat(f.elements['price'].value) || 0,
      compare_at_price: parseFloat(f.elements['salePrice'].value) || null,
      stock: parseInt(f.elements['stock'].value) || 0,
      rating: parseFloat(f.elements['rating'].value) || 4.5,
      reviews_count: id && currentProduct(id) ? (currentProduct(id).reviews || 0) : 0,
      description: f.elements['description'].value.trim(),
      is_active: f.elements['status'].value === 'active' && (parseInt(f.elements['stock'].value) || 0) > 0,
      updated_at: new Date().toISOString()
    };
    if (pendingImage) data.image = pendingImage;
    else if (id && currentProduct(id)) data.image = currentProduct(id).image;

    data.images = data.image ? [data.image] : [];

    ADMIN.showLoading(root);
    if (id) {
      try {
        await ADMIN.apiRequest('/products/' + encodeURIComponent(id), { method: 'PUT', body: JSON.stringify(data) });
        ADMIN.toast('Product updated', 'success');
      } catch (err) {
        ADMIN.toast(err.message || 'Failed to update product', 'error');
        ADMIN.hideLoading(root);
        return;
      }
    } else {
      if (!data.image) data.image = '../images/products/shoes-0.jpg';
      data.images = [data.image];
      try {
        await ADMIN.apiRequest('/products', { method: 'POST', body: JSON.stringify(data) });
        ADMIN.toast('Product added', 'success');
      } catch (err) {
        ADMIN.toast(err.message || 'Failed to add product', 'error');
        ADMIN.hideLoading(root);
        return;
      }
    }
    closeModal();
    loadData();
  }

  function deleteProduct(id) {
    ADMIN.confirmDialog({
      title: 'Delete Product',
      message: 'This action cannot be undone. Delete this product permanently?',
      confirmText: 'Delete',
      danger: true
    }).then(ok => {
      if (!ok) return;
      ADMIN.showLoading(root);
      ADMIN.apiRequest('/products/' + encodeURIComponent(id), { method: 'DELETE' })
        .then(() => { ADMIN.toast('Product deleted', 'success'); loadData(); })
        .catch(err => { ADMIN.hideLoading(root); ADMIN.toast(err.message || 'Failed to delete product', 'error'); });
    });
  }

  function refreshPrices() {
    document.querySelectorAll('[data-price]').forEach(el => { const v = parseFloat(el.getAttribute('data-price')); if (!isNaN(v)) el.textContent = CUR.format(v); });
  }

  loadData();
})();
