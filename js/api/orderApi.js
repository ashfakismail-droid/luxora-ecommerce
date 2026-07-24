/* LUXORA - Orders API client */
(function () {
  'use strict';

  async function request(endpoint, options) {
    if (!window.API || typeof window.API.request !== 'function') {
      throw new Error('Orders API is unavailable. Please refresh the page and try again.');
    }
    const result = await window.API.request(endpoint, options);
    return result && Object.prototype.hasOwnProperty.call(result, 'data') ? result.data : result;
  }

  function listOrders() {
    return request('/orders');
  }

  function getOrder(id) {
    return request(`/orders/${encodeURIComponent(id)}`);
  }

  function createOrder(order) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(order)
    });
  }

  window.LUXORA_ORDER_API = { listOrders, getOrder, createOrder };
})();