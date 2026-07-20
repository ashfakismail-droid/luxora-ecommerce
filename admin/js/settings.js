/* LUXORA - Admin Settings */
(function () {
  'use strict';
  const DB = window.LUXORA_DB, CUR = window.LUXORA_CURRENCY, ADMIN = window.LUXORA_ADMIN;
  ADMIN.requireAuth();
  ADMIN.renderShell();
  const root = document.getElementById('adminContent');

  function render() {
    const s = DB.getSettings();
    root.innerHTML = `
      <form id="settingsForm">
        <div class="grid-2">
          <div class="panel">
            <div class="panel-head"><h3>Store</h3></div>
            <div class="field"><label>Store Name</label><input name="storeName" value="${s.storeName}"></div>
            <div class="field"><label>Tagline</label><input name="tagline" value="${s.tagline}"></div>
            <div class="field"><label>Logo Path</label><input name="logo" value="${s.logo}"></div>
            <div class="field"><label>Theme</label>
              <select name="theme"><option value="dark" ${s.theme === 'dark' ? 'selected' : ''}>Dark</option><option value="light" ${s.theme === 'light' ? 'selected' : ''}>Light</option></select>
            </div>
            <div class="field"><label>Default Currency</label>
              <select name="currency" id="currencySel"></select>
            </div>
          </div>
          <div class="panel">
            <div class="panel-head"><h3>Commerce</h3></div>
            <div class="field-row">
              <div class="field"><label>Tax Rate (%)</label><input name="taxRate" type="number" step="0.1" value="${s.taxRate}"></div>
              <div class="field"><label>Shipping Flat (USD)</label><input name="shippingFlat" type="number" step="0.01" value="${s.shippingFlat}"></div>
            </div>
            <div class="field"><label>Free Shipping Over (USD)</label><input name="freeShippingOver" type="number" step="0.01" value="${s.freeShippingOver}"></div>
            <div class="field"><label>Contact Email</label><input name="contactEmail" value="${s.contactEmail}"></div>
            <div class="field"><label>Contact Phone</label><input name="contactPhone" value="${s.contactPhone}"></div>
            <div class="field"><label>Address</label><input name="address" value="${s.address}"></div>
          </div>
        </div>
        <div class="panel" style="margin-top:20px">
          <div class="panel-head"><h3>Social Media</h3></div>
          <div class="field-row">
            <div class="field"><label>Instagram</label><input name="instagram" value="${s.social.instagram || ''}"></div>
            <div class="field"><label>Twitter</label><input name="twitter" value="${s.social.twitter || ''}"></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Facebook</label><input name="facebook" value="${s.social.facebook || ''}"></div>
            <div class="field"><label>Pinterest</label><input name="pinterest" value="${s.social.pinterest || ''}"></div>
          </div>
        </div>
        <div style="margin-top:20px;display:flex;gap:10px">
          <button type="submit" class="btn btn-gold">Save Settings</button>
          <button type="button" class="btn btn-outline" id="resetData">Reset Demo Data</button>
        </div>
      </form>`;

    const sel = document.getElementById('currencySel');
    Object.values(CUR.SUPPORTED).forEach(c => { const o = document.createElement('option'); o.value = c.code; o.textContent = c.code + ' ' + c.symbol; sel.appendChild(o); });
    sel.value = s.currency || 'USD';

    document.getElementById('settingsForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.target;
      const data = {
        storeName: f.elements['storeName'].value.trim(),
        tagline: f.elements['tagline'].value.trim(),
        logo: f.elements['logo'].value.trim(),
        theme: f.elements['theme'].value,
        currency: f.elements['currency'].value,
        taxRate: parseFloat(f.elements['taxRate'].value) || 0,
        shippingFlat: parseFloat(f.elements['shippingFlat'].value) || 0,
        freeShippingOver: parseFloat(f.elements['freeShippingOver'].value) || 0,
        contactEmail: f.elements['contactEmail'].value.trim(),
        contactPhone: f.elements['contactPhone'].value.trim(),
        address: f.elements['address'].value.trim(),
        social: {
          instagram: f.elements['instagram'].value.trim(),
          twitter: f.elements['twitter'].value.trim(),
          facebook: f.elements['facebook'].value.trim(),
          pinterest: f.elements['pinterest'].value.trim()
        }
      };
      DB.setSettings(data);
      CUR.setCode(data.currency);
      document.documentElement.setAttribute('data-theme', data.theme);
      ADMIN.toast('Settings saved', 'success');
    });

    document.getElementById('resetData').addEventListener('click', () => {
      ADMIN.confirmDialog({ title: 'Reset Demo Data', message: 'This will erase all products, orders and customers and restore defaults. This cannot be undone.', confirmText: 'Reset', danger: true })
        .then(ok => {
          if (!ok) return;
          ['luxora_products','luxora_categories','luxora_brands','luxora_coupons','luxora_reviews','luxora_orders','luxora_customers','luxora_settings','luxora_cart','luxora_wishlist'].forEach(k => localStorage.removeItem(k));
          DB.init();
          ADMIN.toast('Demo data reset', 'success');
          setTimeout(() => location.reload(), 600);
        });
    });
  }

  render();
})();
