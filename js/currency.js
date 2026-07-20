/* ============================================================
   LUXORA - Currency Helper
   Reusable, never hardcode "$". Changing currency updates the
   entire site automatically via a custom event.
   ============================================================ */
(function () {
  'use strict';

  const SUPPORTED = {
    USD: { symbol: '$', code: 'USD', rate: 1, locale: 'en-US' },
    EUR: { symbol: '€', code: 'EUR', rate: 0.92, locale: 'de-DE' },
    GBP: { symbol: '£', code: 'GBP', rate: 0.79, locale: 'en-GB' },
    INR: { symbol: '₹', code: 'INR', rate: 83.2, locale: 'en-IN' },
    AED: { symbol: 'د.إ', code: 'AED', rate: 3.67, locale: 'ar-AE' },
    SAR: { symbol: '﷼', code: 'SAR', rate: 3.75, locale: 'ar-SA' },
    JPY: { symbol: '¥', code: 'JPY', rate: 156, locale: 'ja-JP', zeroDecimal: true }
  };

  const KEY = 'luxora_currency';

  function getCode() {
    return localStorage.getItem(KEY) || 'USD';
  }
  function setCode(code) {
    if (!SUPPORTED[code]) code = 'USD';
    localStorage.setItem(KEY, code);
    document.dispatchEvent(new CustomEvent('luxora:currency', { detail: { code } }));
  }
  function getInfo() {
    return SUPPORTED[getCode()] || SUPPORTED.USD;
  }
  // convert from base USD amount to selected currency
  function convert(amountUSD) {
    const info = getInfo();
    const v = amountUSD * info.rate;
    return info.zeroDecimal ? Math.round(v) : v;
  }
  // format a base USD amount
  function format(amountUSD) {
    const info = getInfo();
    const v = convert(amountUSD);
    try {
      return new Intl.NumberFormat(info.locale, {
        style: 'currency',
        currency: info.code,
        maximumFractionDigits: info.zeroDecimal ? 0 : 2,
        minimumFractionDigits: info.zeroDecimal ? 0 : 2
      }).format(v);
    } catch (e) {
      return info.symbol + v.toFixed(info.zeroDecimal ? 0 : 2);
    }
  }
  // format an already-converted amount (used internally)
  function formatRaw(value) {
    const info = getInfo();
    try {
      return new Intl.NumberFormat(info.locale, {
        style: 'currency',
        currency: info.code,
        maximumFractionDigits: info.zeroDecimal ? 0 : 2,
        minimumFractionDigits: info.zeroDecimal ? 0 : 2
      }).format(value);
    } catch (e) {
      return info.symbol + value.toFixed(info.zeroDecimal ? 0 : 2);
    }
  }

  window.LUXORA_CURRENCY = {
    SUPPORTED, getCode, setCode, getInfo, convert, format, formatRaw
  };
})();
