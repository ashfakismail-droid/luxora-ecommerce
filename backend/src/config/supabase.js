const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate configuration with useful error messages
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[supabase] Configuration error: SUPABASE_URL and SUPABASE_ANON_KEY are required.'
  );
}
if (supabaseUrl && !supabaseServiceRoleKey) {
  console.error(
    '[supabase] Configuration warning: SUPABASE_SERVICE_ROLE_KEY is missing — admin (privileged) operations will fail.'
  );
}

// Check if Supabase is configured
const isConfigured = !!(supabaseUrl && supabaseAnonKey);

// Public client (for auth, limited access)
const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin client (for privileged operations)
const supabaseAdmin = (isConfigured && supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

module.exports = {
  supabase,
  supabaseAdmin,
  isConfigured
};
