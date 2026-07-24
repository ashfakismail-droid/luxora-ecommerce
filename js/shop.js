/* ============================================================
   LUXORA - Shop Module
   Product CRUD API migration from LocalStorage
  =========================================================== */

// ProductAPI is declared as a global const in js/api/productApi.js
// and is available in the shared global lexical environment.
// Do NOT redeclare it here — that causes a SyntaxError.
const { getCategories } = window.LUXORA_DB;

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 12;
let sortOption = 'featured';
let isLoading = false;
let loadError = null;

// Field mapping utilities
function normalizeProduct(backendProduct) {
  if (!backendProduct) return null;
  
  const p = {
    id: backendProduct.id != null ? String(backendProduct.id) : '',
    name: backendProduct.name || '',
    slug: backendProduct.slug || '',
    description: backendProduct.description || '',
    price: parseFloat(backendProduct.price) || 0,
    // Map compare_at_price to salePrice (0 if null/undefined)
    salePrice: parseFloat(backendProduct.compare_at_price) > 0 ? parseFloat(backendProduct.compare_at_price) : 0,
    category: backendProduct.category || '',
    // Map reviews_count to reviews (0 if null)
    reviews: parseInt(backendProduct.reviews_count) || 0,
    rating: parseFloat(backendProduct.rating) || 0,
    brand: backendProduct.brand || '',
    image: backendProduct.image || '',
    images: Array.isArray(backendProduct.images) ? backendProduct.images : [],
    stock: parseInt(backendProduct.stock) || 0,
    // is_active mapping to status field (for compatibility with UI expectations)
    status: backendProduct.is_active ? 'active' : 'inactive',
    createdAt: backendProduct.created_at || '',
    updatedAt: backendProduct.updated_at || '',
    // Provide safe defaults for UI expectations
    featured: false,
    bestSeller: false,
    newArrival: false,
    tags: []
  };
  
  // Category normalization: try to match the ID used in the frontend categories
  const categories = getCategories();
  const categoryMatch = categories.find(cat => cat.name === p.category || cat.id === p.category);
  if (categoryMatch) {
    p.category = categoryMatch.id;
  } else {
    p.category = p.category || '';
  }
  
  return p;
}

// Category normalized IDs for filtering
function getCategoryIds() {
  const categories = getCategories();
  return categories.map(cat => cat.id);
}

function resolveCategoryImage(category) {
  const id = String(category?.id || '').trim().toLowerCase();
  const image = String(category?.image || '').trim();

  if (id === 'bags') return 'images/categories/bags.svg';
  if (image) return image;
  return id ? `images/categories/${id}.jpg` : '';
}

function getShopCategories() {
  const categories = getCategories().map(cat => ({
    ...cat,
    image: resolveCategoryImage(cat)
  }));
  const seen = new Set(categories.map(cat => String(cat.id).toLowerCase()));

  allProducts.forEach(product => {
    const id = String(product.category || '').trim().toLowerCase();
    if (!id || seen.has(id)) return;

    seen.add(id);
    categories.push({
      id,
      name: id.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
      image: resolveCategoryImage({ id })
    });
  });

  return categories;
}

// Filtering logic
function filterProducts(products, currentFilters) {
  return products.filter(p => {
    if (currentFilters.search && !p.name.toLowerCase().includes(currentFilters.search.toLowerCase())) {
      return false;
    }
    
    if (currentFilters.category && p.category !== currentFilters.category) {
      return false;
    }
    
    if (currentFilters.brands && currentFilters.brands.length > 0 && !currentFilters.brands.includes(p.brand)) {
      return false;
    }
    
    const minPrice = currentFilters.priceMin ? parseFloat(currentFilters.priceMin) : 0;
    const maxPrice = currentFilters.priceMax ? parseFloat(currentFilters.priceMax) : Number.MAX_SAFE_INTEGER;
    if (p.price < minPrice || p.price > maxPrice) {
      return false;
    }
    
    const minRating = currentFilters.ratingFilter ? parseInt(currentFilters.ratingFilter) : 0;
    if (p.rating < minRating) {
      return false;
    }
    
    if (currentFilters.inStockOnly && p.stock <= 0) {
      return false;
    }
    
    if (currentFilters.filters.length > 0 && !currentFilters.filters.includes('sale')) {
      if (p.salePrice > 0 && p.salePrice < p.price) {
        return false;
      }
    }
    
    return true;
  });
}

// Sorting logic
function sortProducts(products, sortOption) {
  const sorted = [...products];
  
  switch (sortOption) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      sorted.sort((a, b) => b.rating - a.rating);
  }
  
  return sorted;
}

// Pagination
function paginate(products, page, perPage) {
  const start = (page - 1) * perPage;
  return products.slice(start, start + perPage);
}

// Render products to the grid
function renderProducts(products) {
  const shopGrid = document.getElementById('shopGrid');
  const resultCount = document.getElementById('resultCount');
  
  if (loadError) {
    shopGrid.innerHTML = `
      <div class="error-message">
        <h3>Error Loading Products</h3>
        <p>${loadError}</p>
        <button onclick="location.reload()" class="btn btn-outline">Retry</button>
      </div>
    `;
    resultCount.textContent = '0 results';
    return;
  }
  
  if (isLoading) {
    shopGrid.innerHTML = `
      <div class="loading-placeholder">
        <div class="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    `;
    return;
  }
  
  if (products.length === 0) {
    shopGrid.innerHTML = `
      <div class="no-results">
        <h3>No Products Found</h3>
        <p>Try adjusting your filters or search.</p>
      </div>
    `;
    resultCount.textContent = '0 results';
    return;
  }
  
  const paginated = paginate(products, currentPage, productsPerPage);
  shopGrid.innerHTML = paginated.map(p => window.LUXORA_UI.productCard(p)).join('');
  
  resultCount.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;
  
  // Render pagination controls
  const pagination = document.getElementById('pagination');
  if (pagination) {
    renderPagination(pagination, products.length);
  }
}

// Pagination rendering
function renderPagination(container, totalProducts) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = '<div class="pagination-inner">';
  
  // Previous button
  html += `<button class="btn btn-outline btn-sm" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">Previous</button>`;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="btn ${currentPage === i ? 'btn-gold' : 'btn-outline'} btn-sm" onclick="changePage(${i})">${i}</button>`;
  }
  
  // Next button
  html += `<button class="btn btn-outline btn-sm" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next</button>`;
  
  html += '</div>';
  container.innerHTML = html;
}

// Change page
function changePage(page) {
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  currentPage = Math.min(Math.max(1, page), totalPages);
  render(false);
}

// Main render function
function render(resetPage = true) {
  const state = shopState;
  
  // Apply filters
  let filtered = filterProducts(allProducts, state.filters);
  
  // Apply sorting
  filtered = sortProducts(filtered, state.sortOption);
  
  // Update state
  filteredProducts = filtered;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  currentPage = resetPage ? 1 : Math.min(Math.max(1, currentPage), totalPages);
  
  // Render
  renderProducts(filtered);
}

// Apply filters and sort
function applyFiltersAndSort() {
  render(true);
}

// Build filters UI
function buildFilters() {
  // Build category filters
  const catFilter = document.getElementById('catFilter');
  if (catFilter) {
    const categories = getShopCategories();
    categories.forEach(cat => {
      catFilter.appendChild(createFilterElement('cat', cat.id, cat.name, cat.image));
    });
  }
  
  // Build brand filters
  const brandFilter = document.getElementById('brandFilter');
  if (brandFilter) {
    const uniqueBrands = [...new Set(allProducts.map(p => p.brand))].filter(Boolean);
    uniqueBrands.forEach(brand => {
      brandFilter.appendChild(createFilterElement('brands', brand, brand));
    });
  }
  
  // Build rating filters
  const ratingFilter = document.getElementById('ratingFilter');
  if (ratingFilter) {
    const ratings = [5, 4, 3, 2, 1];
    ratings.forEach(rating => {
      ratingFilter.appendChild(createRatingFilter(rating));
    });
  }
}

// Create filter element
function createFilterElement(type, value, label, image) {
  const wrapper = document.createElement('div');
  wrapper.className = 'filter-item';
  
  if (type === 'cat') {
    wrapper.className = 'cat-item';
    wrapper.innerHTML = `
      <button class="cat-btn ${shopState.filters.category === value ? 'active' : ''}" 
              data-category="${value}" 
              onclick="setCategoryFilter('${value}')">
        ${image ? `<img src="${image}" alt="${label}" class="cat-image" />` : ''}
        <span class="cat-label">${label}</span>
      </button>
    `;
  } else {
    // Defensive guard: resolve the filter values array safely.
    // shopState.filters keys are plural (e.g. "brands"); if a singular/unknown
    // type is passed, fall back to an empty array instead of throwing.
    const currentValues = Array.isArray(shopState.filters[type]) ? shopState.filters[type] : [];
    wrapper.className = 'checkbox-wrapper';
    wrapper.innerHTML = `
      <label class="checkbox-container">
        <input type="checkbox" class="filter-checkbox" 
               ${currentValues.includes(value) ? 'checked' : ''} 
               data-${type}="${value}" 
               onchange="setMultiFilter('${type}', '${value}')">
        <span class="checkmark"></span>
        ${label}
      </label>
    `;
  }
  
  return wrapper;
}

// Create rating filter
function createRatingFilter(rating) {
  const wrapper = document.createElement('div');
  wrapper.className = 'rating-filter';
  wrapper.innerHTML = `
    <label class="checkbox-container">
      <input type="checkbox" class="rating-checkbox" 
             ${shopState.filters.ratingFilter === rating ? 'checked' : ''} 
             data-rating="${rating}" 
             onchange="setRatingFilter(${rating})">
      <span class="checkmark"></span>
      <span class="stars">${renderStars(rating)}</span> & Up
    </label>
  `;
  return wrapper;
}

// Render stars for rating
function renderStars(rating) {
  return '★★★★☆'.substring(0, rating) + '☆'.repeat(5 - rating);
}

// Event handlers
function setCategoryFilter(categoryId) {
  shopState.filters.category = shopState.filters.category === categoryId ? '' : categoryId;
  applyFiltersAndSort();
}

function setMultiFilter(type, value) {
  // Defensive guard: ensure values is always an array even if the state key
  // is missing or not yet initialized.
  let values = Array.isArray(shopState.filters[type]) ? [...shopState.filters[type]] : [];
  const index = values.indexOf(value);
  
  if (index > -1) {
    values.splice(index, 1);
  } else {
    values.push(value);
  }
  
  shopState.filters[type] = values;
  applyFiltersAndSort();
}

function setRatingFilter(rating) {
  shopState.filters.ratingFilter = shopState.filters.ratingFilter === rating ? 0 : rating;
  applyFiltersAndSort();
}

function setSearchFilter(searchTerm) {
  const query = String(searchTerm || '').trim();
  shopState.filters.search = query;
  const url = new URL(window.location.href);
  if (query) url.searchParams.set('q', query);
  else url.searchParams.delete('q');
  history.replaceState(null, '', url);

  const searchInput = document.getElementById('searchInput');
  const searchInputMobile = document.getElementById('searchInputMobile');
  if (searchInput && searchInput.value !== query) searchInput.value = query;
  if (searchInputMobile && searchInputMobile.value !== query) searchInputMobile.value = query;
  applyFiltersAndSort();
}

function setPriceRange(min, max) {
  shopState.filters.priceMin = min || '';
  shopState.filters.priceMax = max || '';
  applyFiltersAndSort();
}

function setSortOption(option) {
  shopState.sortOption = option;
  applyFiltersAndSort();
}

function setViewMode(mode) {
  const grid = document.getElementById('shopGrid');
  const gridView = document.getElementById('gridView');
  const listView = document.getElementById('listView');
  
  if (mode === 'grid') {
    grid.className = 'product-grid shop-grid';
    gridView.classList.add('active');
    listView.classList.remove('active');
  } else {
    grid.className = 'product-list';
    gridView.classList.remove('active');
    listView.classList.add('active');
  }
}

// Handle mobile search drawer
function openSearchPanel() {
  const searchPanel = document.getElementById('searchPanel');
  const filterBackdrop = document.getElementById('filterBackdrop');
  
  if (searchPanel) {
    searchPanel.classList.add('open');
    searchPanel.setAttribute('aria-hidden', 'false');
  }
  
  if (filterBackdrop) {
    filterBackdrop.classList.add('open');
  }
}

function closeSearchPanel() {
  const searchPanel = document.getElementById('searchPanel');
  const filterBackdrop = document.getElementById('filterBackdrop');
  
  if (searchPanel) {
    searchPanel.classList.remove('open');
    searchPanel.setAttribute('aria-hidden', 'true');
  }
  
  if (filterBackdrop) {
    filterBackdrop.classList.remove('open');
  }
}

function applyMobileSearch() {
  const input = document.getElementById('searchInputMobile');
  if (input) {
    setSearchFilter(input.value);
    closeSearchPanel();
  }
}

function resetFilters() {
  shopState.filters = {
    category: '',
    search: '',
    priceMin: '',
    priceMax: '',
    ratingFilter: 0,
    inStockOnly: false,
    brands: [],
    filters: []
  };
  // Sync the in-stock checkbox with the reset state
  const inStockOnly = document.getElementById('inStockOnly');
  if (inStockOnly) inStockOnly.checked = false;
  const url = new URL(window.location.href);
  url.searchParams.delete('q');
  history.replaceState(null, '', url);
  const searchInput = document.getElementById('searchInput');
  const searchInputMobile = document.getElementById('searchInputMobile');
  if (searchInput) searchInput.value = '';
  if (searchInputMobile) searchInputMobile.value = '';
  applyFiltersAndSort();
}

// State management
const shopState = {
  filters: {
    category: '',
    search: '',
    priceMin: '',
    priceMax: '',
    ratingFilter: 0,
    inStockOnly: false,
    brands: [],
    filters: []
  },
  sortOption: 'featured'
};

// Initialize shop module
async function init() {
  const shopGrid = document.getElementById('shopGrid');
  if (!shopGrid) {
    return;
  }
  
  const initialSearch = new URLSearchParams(window.location.search).get('q') || '';
  shopState.filters.search = initialSearch;
  const searchInput = document.getElementById('searchInput');
  const searchInputMobile = document.getElementById('searchInputMobile');
  if (searchInput) searchInput.value = initialSearch;
  if (searchInputMobile) searchInputMobile.value = initialSearch;

  isLoading = true;
  shopGrid.innerHTML = `
    <div class="loading-placeholder">
      <div class="loading-spinner"></div>
      <p>Loading products from API...</p>
    </div>
  `;
  
  try {
    const response = await ProductAPI.getAll();
    allProducts = (response.data || []).map(normalizeProduct);
    loadError = null;
  } catch (error) {
    console.error('Error loading products:', error);
    loadError = 'Failed to load products. Please try again later.';
  } finally {
    isLoading = false;
  }
  
  buildFilters();
  render();
  
  setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById('searchInput');
  const searchInputMobile = document.getElementById('searchInputMobile');
  const applySearch = document.getElementById('applySearch');
  const openSearch = document.getElementById('openSearch');
  
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        setSearchFilter(e.target.value);
      }, 300);
    });
  }
  
  if (searchInputMobile && applySearch) {
    applySearch.addEventListener('click', applyMobileSearch);
  }
  
  if (openSearch) {
    openSearch.addEventListener('click', openSearchPanel);
  }
  
  // Filter controls
  const closeFilters = document.getElementById('closeFilters');
  const filterBackdrop = document.getElementById('filterBackdrop');
  
  if (closeFilters) {
    closeFilters.addEventListener('click', () => {
      filterBackdrop.classList.remove('open');
    });
  }
  
  if (filterBackdrop) {
    filterBackdrop.addEventListener('click', () => {
      filterBackdrop.classList.remove('open');
      closeSearchPanel();
    });
  }
  
  const closeSearch = document.getElementById('closeSearch');
  if (closeSearch) {
    closeSearch.addEventListener('click', closeSearchPanel);
  }
  
  // Sort dropdown
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      setSortOption(e.target.value);
    });
  }
  
  // View toggles
  const gridView = document.getElementById('gridView');
  const listView = document.getElementById('listView');
  if (gridView && listView) {
    gridView.addEventListener('click', () => setViewMode('grid'));
    listView.addEventListener('click', () => setViewMode('list'));
  }
  
  // Reset filters
  const resetFiltersBtn = document.getElementById('resetFilters');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetFilters);
  }

  // In-stock availability toggle
  const inStockOnly = document.getElementById('inStockOnly');
  if (inStockOnly) {
    inStockOnly.addEventListener('change', (e) => {
      shopState.filters.inStockOnly = e.target.checked;
      applyFiltersAndSort();
    });
  }
  
  // Apply filters button
  const applyFiltersBtn = document.getElementById('applyFilters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      filterBackdrop.classList.remove('open');
    });
  }
  
  // Price range input handling
  const priceMin = document.getElementById('priceMin');
  const priceMax = document.getElementById('priceMax');
  if (priceMin && priceMax) {
    const applyPriceFilter = () => {
      setPriceRange(priceMin.value, priceMax.value);
    };
    
    const priceRangeTimeout = () => {
      clearTimeout(priceRangeTimeout.timer);
      priceRangeTimeout.timer = setTimeout(applyPriceFilter, 500);
    };
    
    priceRangeTimeout.timer = setTimeout(applyPriceFilter, 500);
    
    priceMin.addEventListener('input', priceRangeTimeout);
    priceMax.addEventListener('input', priceRangeTimeout);
  }
  
  // Mobile menu toggle
  const mobileFilterBar = document.getElementById('mobileFilterBar');
  if (mobileFilterBar) {
    mobileFilterBar.addEventListener('click', () => {
      filterBackdrop.classList.add('open');
    });
  }
  
  const drawerClose = document.querySelectorAll('.drawer-close');
  drawerClose.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.currentTarget.closest('.search-drawer').classList.remove('open');
      filterBackdrop.classList.remove('open');
    });
  });
}

// Expose functions globally
window.shop = {
  init,
  setCategoryFilter,
  setMultiFilter,
  setRatingFilter,
  setSearchFilter,
  setPriceRange,
  setSortOption,
  setViewMode,
  openSearchPanel,
  closeSearchPanel,
  applyMobileSearch,
  resetFilters,
  changePage,
  render,
  applyFiltersAndSort,
  filterProducts,
  sortProducts,
  normalizeProduct
};

// Global helper
window.renderStars = renderStars;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for DB to be initialized
    setTimeout(init, 100);
  });
} else {
  // DOM already loaded
  setTimeout(init, 100);
}
