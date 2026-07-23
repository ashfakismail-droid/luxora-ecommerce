const ProductAPI = {
  getAll() {
    return API.request("/products");
  },

  getById(id) {
    return API.request(`/products/${id}`);
  },

  create(product) {
    return API.request("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  },

  update(id, product) {
    return API.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  },

  remove(id) {
    return API.request(`/products/${id}`, {
      method: "DELETE",
    });
  },
};

window.ProductAPI = ProductAPI;