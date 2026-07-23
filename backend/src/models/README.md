# Models Directory

This directory is reserved for data models / schemas.

Since this backend uses **Supabase PostgreSQL** as the database, schema definitions are managed in your Supabase project (via the SQL Editor or migrations), not in code files.

## Usage

- Use this folder for any JS helpers that map or validate Supabase rows (optional).
- Define the actual tables in Supabase. See `docs/database.md` for the recommended schema.

## Example

```js
// models/productModel.js (optional)
const Product = {
  fields: ['id', 'name', 'slug', 'price', 'category', 'image', 'description', 'stock', 'created_at']
};
module.exports = Product;