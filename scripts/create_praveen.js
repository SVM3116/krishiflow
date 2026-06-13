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

async function createPraveen() {
  const email = 'praveen@gmail.com';
  const password = 'password123';
  
  console.log(`Creating user ${email} with admin client...`);
  try {
    const { data: { user }, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Praveen',
        phone: '8792738258'
      }
    });
    
    if (error) {
      console.error('Error creating user:', error.status, error.message);
    } else {
      console.log('User created successfully:', user.id);
    }
  } catch (err) {
    console.error('Crashed:', err);
  }
}

createPraveen();
