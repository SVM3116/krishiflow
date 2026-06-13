const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || supabaseUrl === 'https://your-supabase-project.supabase.co') {
  console.warn('\x1b[33m%s\x1b[0m', 'WARNING: SUPABASE_URL environment variable is missing or using placeholder. Database features will fail.');
}

if (!supabaseServiceKey || supabaseServiceKey === 'your_supabase_service_role_key') {
  console.warn('\x1b[33m%s\x1b[0m', 'WARNING: SUPABASE_SERVICE_ROLE_KEY environment variable is missing or using placeholder. Database features will fail.');
}

// Create Supabase client with the service role key to bypass RLS policies on the backend
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder'
);

module.exports = {
  supabase
};
