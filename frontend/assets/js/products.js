/* LUXORA - Admin Products */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, CUR = window.LUXORA_CURRENCY, ADMIN = window.LUXORA_ADMIN;
  ADMIN.requireAuth();
  ADMIN.renderShell();
  const root = document.getElementById('adminContent');
  let pendingImage = null;

  function priceOf(p) { return (p.salePrice && p.salePrice > 0) ? p.salePrice : p.price; }

  function render() {
    const products = DB.getProducts();
    const cats = DB.getCategories();
    const brands = DB.getBrands();

    ADMIN.showLoading(root);
    setTimeout(() => ADMIN.hideLoading(root), 250);

    root.innerHTML = `
      <div class="toolbar">
        <div class="search"><input type="text" id="search" placeholder="Search products…"></div>
        <select id="filterCat"><option value="">All Categories</option>${cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select>
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
    document.getElementById('brandSelect').innerHTML = brands.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
    document.getElementById('catSelect').innerHTML = cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

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
    let list = DB.getProducts();
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
      const p = DB.getProduct(id);
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

  function saveProduct(f) {
    const products = DB.getProducts();
    const id = f.elements['id'].value;
    const data = {
      name: f.elements['name'].value.trim(),
      brand: f.elements['brand'].value,
      category: f.elements['category'].value,
      status: f.elements['status'].value,
      price: parseFloat(f.elements['price'].value) || 0,
      salePrice: parseFloat(f.elements['salePrice'].value) || 0,
      stock: parseInt(f.elements['stock'].value) || 0,
      rating: parseFloat(f.elements['rating'].value) || 4.5,
      reviews: id ? (DB.getProduct(id).reviews || 0) : 0,
      description: f.elements['description'].value.trim(),
      colors: (f.elements['colors'].value || '').split(',').map(s => s.trim()).filter(Boolean),
      sizes: f.elements['sizes'].value.split(',').map(s => s.trim()).filter(Boolean),
      tags: f.elements['tags'].value.split(',').map(s => s.trim()).filter(Boolean),
      featured: f.elements['featured'].checked,
      bestSeller: f.elements['bestSeller'].checked,
      newArrival: f.elements['newArrival'].checked
    };
    if (pendingImage) data.image = pendingImage;
    if (id) {
      const idx = products.findIndex(p => p.id === id);
      products[idx] = { ...products[idx], ...data };
      if (!pendingImage) data.image = products[idx].image;
      products[idx] = data;
      ADMIN.toast('Product updated', 'success');
    } else {
      const newId = 'p' + (Date.now());
      data.id = newId;
      data.images = [data.image || '../images/products/shoes-0.jpg'];
      data.image = data.images[0];
      products.unshift(data);
      ADMIN.toast('Product added', 'success');
    }
    DB.setProducts(products);
    closeModal();
    render();
  }

  function deleteProduct(id) {
    ADMIN.confirmDialog({
      title: 'Delete Product',
      message: 'This action cannot be undone. Delete this product permanently?',
      confirmText: 'Delete',
      danger: true
    }).then(ok => {
      if (!ok) return;
      DB.setProducts(DB.getProducts().filter(p => p.id !== id));
      // Clean every reference to the deleted product so no orphan IDs remain
      // in cart, wishlist or compare (single source of truth stays consistent).
      DB.removeProductReferences(id);
      ADMIN.toast('Product deleted', 'success');
      render();
    });
  }

  function refreshPrices() {
    document.querySelectorAll('[data-price]').forEach(el => { const v = parseFloat(el.getAttribute('data-price')); if (!isNaN(v)) el.textContent = CUR.format(v); });
  }

  render();
})();
