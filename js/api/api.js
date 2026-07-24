const API_BASE = "https://luxora-api-6v80.onrender.com/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "API request failed");
  }

  return result;
}

window.API = { request };