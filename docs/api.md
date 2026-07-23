# Luxora API Documentation

Base URL (local): `http://localhost:3000/api`
Base URL (production): `https://<your-render-service>.onrender.com/api`

## Conventions

- All responses are JSON.
- Standard envelope:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

- Errors:

```json
{
  "success": false,
  "message": "Error summary",
  "error": "Details (development only)"
}
```

- Auth: send `Authorization: Bearer <token>` for protected routes. Tokens are issued by Supabase Auth via `/api/auth/login`.

---

## Health

### GET /api/health
Returns service status and whether Supabase is configured.

**Response**
```json
{
  "success": true,
  "message": "Luxora API is running",
  "timestamp": "2026-07-21T13:30:00.000Z",
  "supabaseConfigured": true
}
```

---

## Products

### GET /api/products
List all products.

**Query params (optional)**
- `category` - filter by category slug/name

**Response 200**
```json
{
  "success": true,
  "message": "Products retrieved",
  "data": [ { "id": 1, "name": "...", "price": 99.99 } ]
}
```

### GET /api/products/:id
Get a single product.

**Response 200**
```json
{
  "success": true,
  "message": "Product retrieved",
  "data": { "id": 1, "name": "...", "price": 99.99 }
}
```

### POST /api/products
Create a product. **Admin only.**

**Body**
```json
{
  "name": "Sample Product",
  "slug": "sample-product",
  "price": 99.99,
  "category": "electronics",
  "image": "https://...",
  "description": "...",
  "stock": 100
}
```

**Response 201**
```json
{
  "success": true,
  "message": "Product created",
  "data": { "id": 1 }
}
```

### PUT /api/products/:id
Update a product. **Admin only.**

**Body**: partial product fields.

**Response 200**
```json
{
  "success": true,
  "message": "Product updated",
  "data": { "id": 1, "name": "Updated" }
}
```

### DELETE /api/products/:id
Delete a product. **Admin only.**

**Response 200**
```json
{
  "success": true,
  "message": "Product deleted",
  "data": null
}
```

---

## Categories

### GET /api/categories
List all categories.

**Response 200**
```json
{
  "success": true,
  "message": "Categories retrieved",
  "data": [ { "id": 1, "name": "Electronics", "slug": "electronics" } ]
}
```

---

## Cart

### GET /api/cart
Get the current user's cart. **User auth.**

**Response 200**
```json
{
  "success": true,
  "message": "Cart retrieved",
  "data": { "items": [] }
}
```

### POST /api/cart
Add an item to the cart. **User auth.**

**Body**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Response 201**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": { "message": "Item added" }
}
```

---

## Wishlist

### GET /api/wishlist
Get the current user's wishlist. **User auth.**

**Response 200**
```json
{
  "success": true,
  "message": "Wishlist retrieved",
  "data": { "items": [] }
}
```

### POST /api/wishlist
Add an item to the wishlist. **User auth.**

**Body**
```json
{
  "product_id": 1
}
```

**Response 201**
```json
{
  "success": true,
  "message": "Item added to wishlist",
  "data": { "message": "Item added" }
}
```

---

## Orders

### GET /api/orders
List orders for the current user (or all orders for admin). **User auth.**

**Response 200**
```json
{
  "success": true,
  "message": "Orders retrieved",
  "data": [
    {
      "id": 1,
      "status": "pending",
      "total": 199.98,
      "order_items": []
    }
  ]
}
```

### POST /api/orders
Create a new order. **User auth.**

**Body**
```json
{
  "items": [
    { "product_id": 1, "quantity": 2, "price": 99.99 }
  ],
  "shipping_address": {
    "name": "John Doe",
    "line1": "...",
    "city": "...",
    "zip": "...",
    "country": "..."
  },
  "total": 199.98
}
```

**Response 201**
```json
{
  "success": true,
  "message": "Order created",
  "data": { "id": 1, "status": "pending" }
}
```

---

## Auth

### POST /api/auth/login
Authenticate a user with email/password.

**Body**
```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

**Response 200**
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "eyJhbGciOi..." }
}
```

### POST /api/auth/register
Register a new user.

**Body**
```json
{
  "email": "user@example.com",
  "password": "secret",
  "name": "John Doe"
}
```

**Response 201**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": { "user": { "id": "..." } }
}
```

### POST /api/auth/logout
Invalidate the current session.

**Response 200**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

## Users (Admin)

### GET /api/users
List all users. **Admin only.**

### GET /api/users/:id
Get a single user. **Admin only.**

---

## Reviews

### GET /api/reviews
List reviews (optionally filtered by `?product_id=`).

### POST /api/reviews
Create a review. **User auth.**

**Body**
```json
{
  "product_id": 1,
  "rating": 5,
  "comment": "Great product!"
}