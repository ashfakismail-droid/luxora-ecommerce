/**
 * Database configuration module
 * Re-exports supabase client for consistent DB access pattern
 */
const { supabase, supabaseAdmin, isConfigured } = require('./supabase');

/**
 * Query helpers - use these consistently across services
 */
const db = {
  from: (table) => supabase ? supabase.from(table) : null,
  adminFrom: (table) => supabaseAdmin ? supabaseAdmin.from(table) : null,
  auth: supabase ? supabase.auth : null,
  storage: supabase ? supabase.storage : null,
  // Expose raw clients so service-level guard checks (e.g. `if (!db.supabaseAdmin)`) work
  supabase,
  supabaseAdmin,
  isConfigured
};

module.exports = db;
