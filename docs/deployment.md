# Luxora Deployment Guide

This guide covers deploying the **backend** to Render and the **frontend** to Netlify, plus connecting them together.

---

## 1. Prerequisites

- A GitHub repo containing the restructured project (`frontend/` and `backend/`).
- A [Supabase](https://supabase.com) project with database, auth, and storage configured (see `docs/database.md`).
- Render and Netlify accounts.

---

## 2. Backend on Render

1. Go to [Render](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repo.
3. Configure:
   - **Name**: `luxora-api`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter
4. Add environment variables (Render dashboard → Environment):

   | Key | Value |
   | --- | --- |
   | `PORT` | `3000` (Render ignores this and uses its own port) |
   | `NODE_ENV` | `production` |
   | `CLIENT_URL` | `https://<your-netlify-site>.netlify.app` |
   | `SUPABASE_URL` | `https://<project>.supabase.co` |
   | `SUPABASE_ANON_KEY` | from Supabase → Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | from Supabase → Settings → API |

5. Deploy. Once live, copy the Render URL (e.g. `https://luxora-api.onrender.com`).
6. Verify: visit `https://luxora-api.onrender.com/api/health` — should return JSON.

---

## 3. Frontend on Netlify

1. Go to [Netlify](https://app.netlify.com) and add a new site from Git.
2. Connect your GitHub repo.
3. Configure:
   - **Base directory**: `frontend`
   - **Build command**: (leave empty — static site)
   - **Publish directory**: `frontend`
   - The included `frontend/netlify.toml` already sets publish dir and API proxy.
4. Add environment variables (Netlify dashboard → Site settings → Environment variables):

   | Key | Value |
   | --- | --- |
   | `VITE_API_URL` or `API_BASE` | `https://luxora-api.onrender.com/api` |

5. Deploy.

### Netlify redirects (`frontend/netlify.toml`)

The included `netlify.toml` forwards `/api/*` to the Render backend in production so the frontend can call relative `/api/...` paths and avoid CORS issues.

---

## 4. CORS

The backend already allows `CLIENT_URL` via the `cors` middleware. Set `CLIENT_URL` on Render to your Netlify URL.

If you prefer to call the absolute backend URL from the frontend instead of using the Netlify proxy, make sure CORS is enabled (it is by default).

---

## 5. Connecting Frontend → Backend

In your frontend JS, later, replace local data calls with `fetch('/api/products')` (proxied) or `fetch('https://luxora-api.onrender.com/api/products')` (direct).

A central API helper is recommended:

```js
// frontend/assets/js/api.js (add later)
const API_BASE = window.location.hostname.includes('netlify')
  ? '/api'                                          // via Netlify proxy
  : 'http://localhost:3000/api';                    // local dev

export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`);
  return res.json();
}
```

---

## 6. Local Development

Backend:
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Frontend:
- Serve the `frontend/` folder with any static server (e.g. Live Server in VS Code).
- For API calls during local dev, point the frontend at `http://localhost:3000/api`.

---

## 7. Troubleshooting

- **502 on Render free tier**: the free tier sleeps after inactivity. The first request after idle may take ~30s to wake. Use a paid tier for always-on.
- **CORS errors**: ensure `CLIENT_URL` on Render matches your Netlify URL exactly (including `https://`).
- **Supabase errors**: confirm keys are correct and that RLS policies allow the service role or that anon has read access.
- **Missing images**: check the `luxora` storage bucket exists and has public read policy.