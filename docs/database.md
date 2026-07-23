# Luxora Database Schema

The Luxora backend uses **Supabase PostgreSQL**. Tables are created in your Supabase project via the SQL Editor or migrations. The recommended schema is below.

> Run these in the Supabase SQL Editor. Replace `luxora` bucket name if you prefer a different storage bucket.

---

## Tables

### categories
```sql
create table if not exists categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text unique not null,
  image text,
  created_at timestamptz default now()
);
```

### products
```sql
create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null default 0,
  compare_at_price numeric(10,2),
  category text,                    -- references categories.name (or slug)
  brand text,
  image text,                       -- main image URL (Supabase Storage)
  images jsonb default '[]',        -- gallery
  rating numeric(2,1) default 0,
  reviews_count int default 0,
  stock int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists products_category_idx on products(category);
create index if not exists products_slug_idx on products(slug);
```

### reviews
```sql
create table if not exists reviews (
  id bigint generated always as identity primary key,
  product_id bigint references products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  rating int check (rating between 1 and 5) not null,
  comment text,
  created_at timestamptz default now()
);

create index if not exists reviews_product_idx on reviews(product_id);
```

### orders
```sql
create table if not exists orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  status text default 'pending',     -- pending, paid, shipped, delivered, cancelled
  total numeric(10,2) not null default 0,
  shipping_address jsonb,
  payment_method text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists orders_user_idx on orders(user_id);
```

### order_items
```sql
create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id bigint references orders(id) on delete cascade,
  product_id bigint references products(id) on delete set null,
  quantity int not null default 1,
  price numeric(10,2) not null,
  created_at timestamptz default now()
);

create index if not exists order_items_order_idx on order_items(order_id);
```

### cart
```sql
create table if not exists cart (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  product_id bigint references products(id) on delete cascade,
  quantity int not null default 1,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

create index if not exists cart_user_idx on cart(user_id);
```

### wishlist
```sql
create table if not exists wishlist (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  product_id bigint references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

create index if not exists wishlist_user_idx on wishlist(user_id);
```

### profiles (optional, mirrors auth.users)
```sql
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text default 'customer',     -- customer | admin
  created_at timestamptz default now()
);
```

---

## Storage

Create a public storage bucket named `luxora` for product images:

```sql
insert into storage.buckets (id, name, public)
values ('luxora', 'luxora', true)
on conflict (id) do nothing;
```

Storage policies (example for public read):

```sql
create policy "Public read access"
on storage.objects for select
using (bucket_id = 'luxora');
```

---

## Row Level Security (RLS)

Enable RLS and add policies. Example for `products` (public read, admin write):

```sql
alter table products enable row level security;

create policy "Public can view products"
  on products for select
  using (is_active = true);

create policy "Admins can manage products"
  on products for all
  using (exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  ));
```

Repeat similar policies for `categories`, `reviews`, `cart`, `wishlist`, and `orders` (user-scoped).

---

## Notes

- Auth users live in `auth.users` (managed by Supabase). Use `profiles` for app-specific fields like `name` and `role`.
- The Express backend reads/writes via the service role key (server-side), which bypasses RLS. Always keep the service role key on the server only.
- Frontend clients should use the anon key (subject to RLS).