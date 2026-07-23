/* LUXORA - Home page logic */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, UI = window.LUXORA_UI, CUR = window.LUXORA_CURRENCY;

  function render() {
    const products = DB.getProducts();
    const cats = DB.getCategories();
    const brands = DB.getBrands();

    // categories
    document.getElementById('homeCategories').innerHTML = cats.map(c => `
      <a href="shop.html?cat=${c.id}" class="cat-card">
        <img src="${c.image}" alt="${c.name}" loading="lazy">
        <div class="cat-label"><h3>${c.name}</h3><span>Shop now →</span></div>
      </a>`).join('');

    // featured / new / best
    const featured = products.filter(p => p.featured).slice(0, 8);
    const news = products.filter(p => p.newArrival).slice(0, 4);
    const best = products.filter(p => p.bestSeller).slice(0, 4);
    document.getElementById('homeFeatured').innerHTML = featured.map(p => UI.productCard(p)).join('');
    document.getElementById('homeNew').innerHTML = news.map(p => UI.productCard(p)).join('');
    document.getElementById('homeBest').innerHTML = best.map(p => UI.productCard(p)).join('');

    // brands
    document.getElementById('homeBrands').innerHTML = brands.map(b => `
      <a href="shop.html?brand=${b.id}" class="brand-logo-card"><img src="${b.logo}" alt="${b.name}" loading="lazy"></a>`).join('');

    // testimonials
    const testi = [
      { q: 'LUXORA redefined my wardrobe. The quality is simply unmatched.', n: 'Sophia M.', r: 'Verified Buyer' },
      { q: 'Impeccable service and pieces that turn heads everywhere I go.', n: 'James L.', r: 'Member' },
      { q: 'A truly premium experience from browsing to unboxing.', n: 'Amara K.', r: 'Verified Buyer' }
    ];
    document.getElementById('homeTesti').innerHTML = testi.map(t => `
      <div class="testi-card glass">
        <p class="quote">“${t.q}”</p>
        <div class="who"><div class="avatar">${t.n[0]}</div><div><div class="name">${t.n}</div><div class="role">${t.r}</div></div></div>
      </div>`).join('');

    UI.refreshPrices();
    UI.renderWishButtons();

    const nf = document.querySelector('[data-newsletter]');
    if (nf) nf.addEventListener('submit', (e) => { e.preventDefault(); nf.reset(); UI.toast('Subscribed! Welcome to LUXORA.', 'success'); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
