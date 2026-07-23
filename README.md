# Luxora E-Commerce

Full-stack e-commerce application: a static frontend (deployed on Netlify) and an Express + Supabase backend API (deployed on Render).

## Repository Structure

```
luxora/
├── frontend/          # Static website (HTML/CSS/JS) — Netlify
│   ├── admin/          # Admin dashboard pages
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── pages/          # Public pages (index, shop, product, cart, etc.)
│   └── netlify.toml
│
├── backend/           # Express REST API — Render
│   ├── src/
│   │   ├── config/     # Supabase + database clients
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── docs/
│   ├── api.md
│   ├── database.md
│   └── deployment.md
└── README.md
```

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS (no redesign in this phase)
- **Backend**: Node.js + Express
- **Database / Auth / Storage**: Supabase (PostgreSQL)
- **Hosting**: Netlify (frontend) + Render (backend)

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env        # fill in Supabase credentials
npm install
npm run dev
```

API runs at `http://localhost:3000/api`. Health: `GET /api/health`.

### Frontend

Open `frontend/pages/index.html` directly, or serve the `frontend/` folder with any static server (e.g. VS Code Live Server).

## Documentation

- [API Reference](docs/api.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)
- [Backend README](backend/README.md)

## Status

- ✅ Project restructured into `frontend/` and `backend/`.
- ✅ Express backend scaffolded with all required routes, controllers, services, and middleware.
- ✅ Supabase configuration and environment variables prepared.
- ✅ Ready for Render (backend) and Netlify (frontend) deployment.
- ⏳ Frontend JS to be updated later to call the live API (replacing local data).

## Important Notes

- The **frontend is intentionally untouched** in this phase. UI, styles, and existing pages are unchanged.
- The **backend boots successfully even without Supabase credentials** — product/category endpoints return empty data, and cart/wishlist/auth/reviews return placeholder responses.
- Never commit `.env` files. The Supabase service role key is a secret.