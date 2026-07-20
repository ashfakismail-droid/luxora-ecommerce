/* LUXORA - Shop page logic: filters, sort, search, view, pagination */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, UI = window.LUXORA_UI, CUR = window.LUXORA_CURRENCY;

  const state = {
    search: '', cat: [], brand: [], rating: 0, min: null, max: null,
    inStock: false, sort: 'featured', view: 'grid', page: 1, perPage: 12
  };

  function getParams() {
    const p = new URLSearchParams(location.search);
    if (p.get('cat')) state.cat = [p.get('cat')];
    if (p.get('brand')) state.brand = [p.get('brand')];
    if (p.get('filter') === 'sale') state.sale = true;
    if (p.get('filter') === 'new') state.new = true;
    if (p.get('filter') === 'best') state.best = true;
  }

  function buildFilters() {
    const cats = DB.getCategories();
    const brands = DB.getBrands();
    document.getElementById('catFilter').innerHTML = cats.map(c =>
      `<label><input type="checkbox" value="${c.id}" ${(state.cat || []).includes(c.id) ? 'checked' : ''}> ${c.name}</label>`).join('');
    document.getElementById('brandFilter').innerHTML = brands.map(b =>
      `<label><input type="checkbox" value="${b.id}" ${(state.brand || []).includes(b.id) ? 'checked' : ''}> ${b.name}</label>`).join('');
    document.getElementById('ratingFilter').innerHTML = [4, 3, 2, 1].map(r =>
      `<label><input type="checkbox" value="${r}"> ${r}+ ★</label>`).join('');

    document.getElementById('catFilter').addEventListener('change', (e) => {
      state.cat = [...document.querySelectorAll('#catFilter input:checked')].map(i => i.value);
      state.page = 1; render();
    });
    document.getElementById('brandFilter').addEventListener('change', (e) => {
      state.brand = [...document.querySelectorAll('#brandFilter input:checked')].map(i => i.value);
      state.page = 1; render();
    });
    document.getElementById('ratingFilter').addEventListener('change', (e) => {
      const checked = [...document.querySelectorAll('#ratingFilter input:checked')].map(i => +i.value);
      state.rating = checked.length ? Math.min(...checked) : 0; state.page = 1; render();
    });
    document.getElementById('searchInput').addEventListener('input', (e) => { state.search = e.target.value.toLowerCase(); state.page = 1; render(); });
    document.getElementById('priceMin').addEventListener('input', (e) => { state.min = e.target.value ? +e.target.value : null; state.page = 1; render(); });
    document.getElementById('priceMax').addEventListener('input', (e) => { state.max = e.target.value ? +e.target.value : null; state.page = 1; render(); });
    document.getElementById('inStockOnly').addEventListener('change', (e) => { state.inStock = e.target.checked; state.page = 1; render(); });
    document.getElementById('sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
    document.getElementById('resetFilters').addEventListener('click', () => {
      Object.assign(state, { search: '', cat: [], brand: [], rating: 0, min: null, max: null, inStock: false, page: 1 });
      document.querySelectorAll('#catFilter input, #brandFilter input, #ratingFilter input').forEach(i => i.checked = false);
      document.getElementById('searchInput').value = '';
      document.getElementById('priceMin').value = ''; document.getElementById('priceMax').value = '';
      document.getElementById('inStockOnly').checked = false;
      render();
    });
    document.getElementById('gridView').addEventListener('click', () => setView('grid'));
    document.getElementById('listView').addEventListener('click', () => setView('list'));
  }

  function setView(v) {
    state.view = v;
    document.getElementById('shopGrid').classList.toggle('list', v === 'list');
    document.getElementById('gridView').classList.toggle('active', v === 'grid');
    document.getElementById('listView').classList.toggle('active', v === 'list');
  }

  function effectivePrice(p) { return (p.salePrice && p.salePrice > 0) ? p.salePrice : p.price; }

  function filterProducts() {
    let list = DB.getProducts().slice();
    if (state.search) {
      const q = state.search;
      const catNames = DB.getCategories().reduce((m, c) => (m[c.id] = c.name.toLowerCase(), m), {});
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (catNames[p.category] || '').includes(q) ||
        (p.tags || []).some(t => t.includes(q))
      );
    }
    if (state.cat.length) list = list.filter(p => state.cat.includes(p.category));
    if (state.brand.length) list = list.filter(p => state.brand.includes(p.brand));
    if (state.rating) list = list.filter(p => p.rating >= state.rating);
    if (state.min != null) list = list.filter(p => effectivePrice(p) >= state.min);
    if (state.max != null) list = list.filter(p => effectivePrice(p) <= state.max);
    if (state.inStock) list = list.filter(p => p.stock > 0);
    if (state.sale) list = list.filter(p => p.salePrice && p.salePrice > 0);
    if (state.new) list = list.filter(p => p.newArrival);
    if (state.best) list = list.filter(p => p.bestSeller);

    switch (state.sort) {
      case 'price-asc': list.sort((a, b) => effectivePrice(a) - effectivePrice(b)); break;
      case 'price-desc': list.sort((a, b) => effectivePrice(b) - effectivePrice(a)); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }

  function render() {
    const all = filterProducts();
    const totalPages = Math.max(1, Math.ceil(all.length / state.perPage));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * state.perPage;
    const pageItems = all.slice(start, start + state.perPage);

    document.getElementById('resultCount').textContent = `${all.length} product${all.length !== 1 ? 's' : ''} found`;
    const grid = document.getElementById('shopGrid');
    grid.innerHTML = pageItems.length ? pageItems.map(p => UI.productCard(p)).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><div class="ico">🔍</div><h3>No products found</h3><p class="muted">Try adjusting your filters.</p></div>`;

    // pagination
    const pag = document.getElementById('pagination');
    if (totalPages <= 1) { pag.innerHTML = ''; }
    else {
      let html = `<button ${state.page === 1 ? 'disabled' : ''} data-pg="prev">‹</button>`;
      for (let i = 1; i <= totalPages; i++) html += `<button class="${i === state.page ? 'active' : ''}" data-pg="${i}">${i}</button>`;
      html += `<button ${state.page === totalPages ? 'disabled' : ''} data-pg="next">›</button>`;
      pag.innerHTML = html;
      pag.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        const v = b.getAttribute('data-pg');
        if (v === 'prev') state.page--; else if (v === 'next') state.page++; else state.page = +v;
        render(); window.scrollTo({ top: 0, behavior: 'smooth' });
      }));
    }

    UI.refreshPrices();
    UI.renderWishButtons();
    updateFilterCount();
  }

  // ---------- Mobile filter drawer ----------
  // On mobile the sidebar is hidden by default and opened as a slide-in drawer.
  // Desktop layout is untouched (the drawer classes are only applied < 900px via CSS).
  let _filterCountEl = null;
  function updateFilterCount() {
    if (!_filterCountEl) return;
    const n = (state.cat.length + state.brand.length + (state.rating ? 1 : 0) + (state.min != null || state.max != null ? 1 : 0) + (state.inStock ? 1 : 0) + (state.search ? 1 : 0));
    if (n > 0) { _filterCountEl.style.display = 'inline-flex'; _filterCountEl.textContent = n; }
    else _filterCountEl.style.display = 'none';
  }

  function initMobileDrawer() {
    const panel = document.getElementById('filtersPanel');
    const backdrop = document.getElementById('filterBackdrop');
    const openBtn = document.getElementById('openFilters');
    const closeBtn = document.getElementById('closeFilters');
    const applyBtn = document.getElementById('applyFilters');
    _filterCountEl = document.getElementById('filterCount');
    if (!panel || !backdrop || !openBtn) return;

    function isMobile() { return window.matchMedia('(max-width: 900px)').matches; }

    function openDrawer() {
      if (!isMobile()) return;
      panel.classList.add('filter-drawer', 'open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      panel.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (!isMobile()) panel.classList.remove('filter-drawer');
    }

    openBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    applyBtn.addEventListener('click', () => { render(); closeDrawer(); });
    backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('open')) closeDrawer(); });
    window.addEventListener('resize', () => { if (!isMobile()) closeDrawer(); });
  }

  // Mobile-only Search drawer. Desktop layout is unchanged. The search input
  // filters the product list instantly; closing restores the layout.
  function initMobileSearch() {
    const panel = document.getElementById('searchPanel');
    const backdrop = document.getElementById('filterBackdrop');
    const openBtn = document.getElementById('openSearch');
    const closeBtn = document.getElementById('closeSearch');
    const applyBtn = document.getElementById('applySearch');
    const input = document.getElementById('searchInputMobile');
    if (!panel || !backdrop || !openBtn || !input) return;

    function isMobile() { return window.matchMedia('(max-width: 900px)').matches; }

    function openDrawer() {
      if (!isMobile()) return;
      panel.classList.add('search-drawer', 'open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      input.value = state.search;
      input.focus();
    }
    function closeDrawer() {
      panel.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (!isMobile()) panel.classList.remove('search-drawer');
    }

    openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (applyBtn) applyBtn.addEventListener('click', () => { state.search = input.value.trim().toLowerCase(); render(); closeDrawer(); });
    input.addEventListener('input', () => { state.search = input.value.trim().toLowerCase(); render(); });
    backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('open')) closeDrawer(); });
    window.addEventListener('resize', () => { if (!isMobile()) closeDrawer(); });
  }

  function init() {
    getParams();
    buildFilters();
    initMobileDrawer();
    initMobileSearch();
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
