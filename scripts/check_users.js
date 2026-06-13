const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkUsers() {
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error listing users:', error.message);
      return;
    }
    
    console.log(`Found ${users.length} users in Supabase Auth:`);
    users.forEach(u => {
      console.log(`- ID: ${u.id} | Email: ${u.email} | Confirmed: ${u.email_confirmed_at ? 'YES' : 'NO'} | Created At: ${u.created_at}`);
      console.log(`  Metadata:`, u.user_metadata);
    });
  } catch (err) {
    console.error('Crashed checking users:', err);
  }
}

checkUsers();
