create table if not exists wishlist (
  id bigint generated always as identity primary key,
  user_id text not null,
  product_id bigint references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

create index if not exists wishlist_user_idx on wishlist(user_id);

create table if not exists cart (
  id bigint generated always as identity primary key,
  user_id text not null,
  item_key text not null,
  product_id bigint references products(id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  variant jsonb,
  created_at timestamptz default now(),
  unique (user_id, item_key)
);

create index if not exists cart_user_idx on cart(user_id);