# Luxora Backend API

Production-ready Express REST API for the Luxora e-commerce storefront. Built with Node.js, Express, and Supabase (PostgreSQL + Auth + Storage).

## Tech Stack

- **Runtime**: Node.js >= 18
- **Framework**: Express 4
- **Database/Auth/Storage**: Supabase (PostgreSQL)
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Config**: dotenv

## Getting Started

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# then edit .env with your Supabase project credentials
```

Required variables:

| Variable | Description |
| --- | --- |
| `PORT` | Server port (default 3000) |
| `NODE_ENV` | `development` / `production` |
| `CLIENT_URL` | Frontend origin for CORS |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |

### 3. Run the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server starts on `http://localhost:3000` by default.

Health check: `GET /api/health`

## Project Structure

```
backend/
├── src/
│   ├── config/        # Supabase + database clients
│   ├── controllers/   # Route handlers (HTTP layer)
│   ├── middleware/    # auth, admin, validation, errorHandler
│   ├── models/        # Reserved for schema/row helpers
│   ├── routes/        # Express routers per resource
│   ├── services/      # Business logic / data access
│   ├── utils/         # response formatter, logger
│   ├── app.js         # Express app setup
│   └── server.js      # HTTP server entrypoint
├── package.json
├── .env.example
└── README.md
```

## API Endpoints

All routes are prefixed with `/api`.

### Products
| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Categories
| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/categories` | Public |

### Cart
| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/cart` | User |
| POST | `/api/cart` | User |

### Wishlist
| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/wishlist` | User |
| POST | `/api/wishlist` | User |

### Orders
| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/orders` | User |
| POST | `/api/orders` | User |

### Auth
| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/logout` | Public |

> Cart, wishlist, reviews, and auth endpoints currently return placeholder responses until Supabase credentials are configured. Product/category/order endpoints gracefully return empty results without Supabase.

## Response Format

All endpoints return a consistent JSON envelope:

```json
{
  "success": true,
  "message": "Products retrieved",
  "data": []
}
```

Error:

```json
{
  "success": false,
  "message": "Failed to fetch products",
  "error": "details..."
}
```

## Deployment (Render)

1. Push this repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables (from `.env.example`) in the Render dashboard.
5. Deploy. Use the resulting URL as the API base for the Netlify frontend.

## Notes

- The server boots successfully even without Supabase credentials (returns empty/placeholder data). This lets you verify the scaffold before wiring the database.
- Never commit `.env`. The service role key is secret.
- See `../docs/api.md`, `../docs/database.md`, and `../docs/deployment.md` for full documentation.