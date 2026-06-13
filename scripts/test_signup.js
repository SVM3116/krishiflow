const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const fs = require('fs');

// Read frontend .env to get anon key
const frontendEnvPath = './frontend_part/.env';
const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
const anonKeyLine = frontendEnv.split('\n').find(line => line.trim().startsWith('VITE_SUPABASE_ANON_KEY='));
const anonKey = anonKeyLine ? anonKeyLine.split('=')[1].trim() : '';

const supabaseUrl = process.env.SUPABASE_URL;

console.log('URL:', supabaseUrl);
console.log('Anon Key length:', anonKey.length);

const supabase = createClient(supabaseUrl, anonKey);

async function testSignup() {
  const email = `praveen1@gmail.com`;
  const password = 'password123';
  
  console.log(`Testing signup with ${email}...`);
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Signup Error:', error.status, error.message);
    } else {
      console.log('Signup Successful!', data.user ? data.user.id : 'No user returned');
    }
  } catch (err) {
    console.error('Caught error during signup:', err);
  }
}

testSignup();
