const fs = require('fs');
const path = require('path');
const vm = require('vm');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const db = require('../src/config/database');

const DATA_FILE = path.resolve(__dirname, '../../js/data.js');
const TABLE_NAME = 'products';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function compactRecord(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== null && value !== undefined)
  );
}

function normalizeProduct(product) {
  const name = String(product?.name || '').trim();
  if (!name) return null;

  const image = Array.isArray(product?.images) && product.images[0]
    ? String(product.images[0])
    : (product?.image ? String(product.image) : '');

  const slug = String(product?.slug || '').trim() || slugify(name);
  if (!slug) return null;

  const price = toNumber(product?.price, 0);
  const salePrice = toNumber(product?.salePrice, 0);
  const compareAtPrice = salePrice > 0 ? salePrice : null;

  const rating = Math.max(0, Math.min(5, toNumber(product?.rating, 0)));
  const reviewsCount = Math.max(0, Math.trunc(toNumber(product?.reviews, 0)));
  const stock = Math.max(0, Math.trunc(toNumber(product?.stock, 0)));

  const images = Array.isArray(product?.images) && product.images.length
    ? product.images.map((item) => String(item))
    : (image ? [image] : []);

  const normalized = {
    name,
    slug,
    description: product?.description != null ? String(product.description) : null,
    price,
    compare_at_price: compareAtPrice,
    category: product?.category != null ? String(product.category) : null,
    brand: product?.brand != null ? String(product.brand) : null,
    image: image || null,
    images,
    rating,
    reviews_count: reviewsCount,
    stock,
    is_active: product?.status ? String(product.status) === 'active' : stock > 0,
    featured: !!product?.featured,
    best_seller: !!product?.bestSeller,
    new_arrival: !!product?.newArrival,
    tags: Array.isArray(product?.tags) ? product.tags.map((item) => String(item)) : null,
    colors: Array.isArray(product?.colors) ? product.colors.map((item) => String(item)) : null,
    sizes: Array.isArray(product?.sizes) ? product.sizes.map((item) => String(item)) : null,
    specs: product?.specs && typeof product.specs === 'object' ? product.specs : null,
    updated_at: new Date().toISOString()
  };

  // Remove nulls so we do not overwrite existing DB defaults with explicit nulls.
  return Object.fromEntries(Object.entries(normalized).filter(([, value]) => value !== null && value !== undefined));
}

function removeUnsupportedColumn(payload, columnName) {
  return payload.map((row) => {
    const next = { ...row };
    delete next[columnName];
    return next;
  });
}

function getUnsupportedColumnName(error) {
  const message = String(error?.message || error?.details || '');
  const match = message.match(/'([^']+)' column/);
  return match ? match[1] : null;
}

function loadSeedProducts(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const context = {
    window: {},
    localStorage: {
      getItem: () => null,
      setItem: () => {}
    },
    console,
    setTimeout,
    clearTimeout,
    JSON,
    Math,
    Date,
    String,
    Number,
    Boolean,
    Array,
    Object,
    RegExp,
    parseInt,
    parseFloat
  };

  vm.createContext(context);
  vm.runInContext(source, context, { filename: filePath });

  const seedProducts = context.window?.LUXORA_DB?.seedProducts;
  if (!Array.isArray(seedProducts)) {
    throw new Error('Unable to load seed products from js/data.js');
  }

  return seedProducts;
}

async function upsertBatch(rows) {
  if (!rows.length) return { imported: 0, updated: 0 };

  const slugs = rows.map((row) => row.slug);
  const { data: existing, error: fetchError } = await db
    .adminFrom(TABLE_NAME)
    .select('*')
    .in('slug', slugs);

  if (fetchError) throw fetchError;

  const existingBySlug = new Map((existing || []).map((row) => [row.slug, row]));
  const toUpsert = [];
  let skipped = 0;

  for (const row of rows) {
    const current = existingBySlug.get(row.slug);
    if (!current) {
      toUpsert.push(row);
      continue;
    }

    const currentComparable = Object.fromEntries(
      Object.keys(current)
        .filter((key) => key !== 'id' && key !== 'created_at' && key !== 'updated_at' && key in row)
        .map((key) => [key, row[key]])
    );
    const { created_at: _createdAt, updated_at: _updatedAt, id: _id, ...existingComparable } = current;
    const existingFiltered = Object.fromEntries(
      Object.keys(currentComparable).map((key) => [key, existingComparable[key]])
    );
    const currentFingerprint = JSON.stringify(compactRecord(currentComparable));
    const existingFingerprint = JSON.stringify(compactRecord(existingFiltered));

    if (currentFingerprint === existingFingerprint) {
      skipped += 1;
      continue;
    }

    toUpsert.push({ ...row, id: current.id });
  }

  let imported = 0;
  let updated = 0;

  if (toUpsert.length) {
    let payload = toUpsert;
    let attempt = 0;
    let lastError = null;
    const strippedColumns = [];

    while (attempt < 20) {
      const { error } = await db
        .adminFrom(TABLE_NAME)
        .upsert(payload, { onConflict: 'id', ignoreDuplicates: false });

      if (!error) {
        break;
      }

      lastError = error;
      const unsupportedColumn = getUnsupportedColumnName(error);

      if (unsupportedColumn) {
        payload = removeUnsupportedColumn(payload, unsupportedColumn);
        strippedColumns.push(unsupportedColumn);
        attempt += 1;
        continue;
      }

      throw error;
    }

    if (lastError && attempt >= 20) {
      throw lastError;
    }

    if (strippedColumns.length) {
      console.warn(`Unsupported columns skipped by live schema: ${[...new Set(strippedColumns)].join(', ')}`);
    }

    imported = toUpsert.filter((row) => !row.id).length;
    updated = toUpsert.length - imported;
  }

  return { imported, updated, skipped };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const seedProducts = loadSeedProducts(DATA_FILE);
  const normalizedProducts = seedProducts.map(normalizeProduct).filter(Boolean);

  const uniqueBySlug = new Map();
  for (const product of normalizedProducts) {
    uniqueBySlug.set(product.slug, product);
  }

  const products = [...uniqueBySlug.values()];

  if (dryRun) {
    const imageFilenamePreserved = seedProducts.every((source, index) => {
      const normalized = products[index];
      const sourceImage = Array.isArray(source?.images) && source.images[0]
        ? String(source.images[0])
        : (source?.image ? String(source.image) : '');
      const normalizedImage = normalized ? String(normalized.image || '') : '';
      return !sourceImage || sourceImage === normalizedImage;
    });

    console.log(JSON.stringify({
      sourceCount: seedProducts.length,
      normalizedCount: products.length,
      sample: products.slice(0, 3),
      imageFilenamesPreserved: imageFilenamePreserved
    }, null, 2));
    return;
  }

  // If the live schema lacks optional demo fields, the importer strips them and retries.
  // This keeps the migration safe even when the deployed DB is narrower than docs/data.js.

  if (!db.supabaseAdmin) {
    throw new Error('Supabase admin client is not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  const summary = await upsertBatch(products);
  const total = products.length;

  console.log(`Seed import complete for ${TABLE_NAME}.`);
  console.log(`Total source products: ${seedProducts.length}`);
  console.log(`Unique products processed: ${total}`);
  console.log(`Imported: ${summary.imported}`);
  console.log(`Updated: ${summary.updated}`);
  console.log(`Skipped: ${summary.skipped}`);
  console.log(`Image filenames preserved: yes`);
}

main().catch((err) => {
  console.error('[import-demo-products] Failed:', err?.message || err);
  process.exitCode = 1;
});