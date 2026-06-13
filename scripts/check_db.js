const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function checkDB() {
  try {
    const { data, error } = await supabase
      .rpc('get_table_columns', { table_name: 'farm_plans' }); // We can use direct SQL since we don't have rpc by default, but let's query a fake select and print the error or query auth.users metadata

    // Let's do a direct select with user_id and see if it exists
    const { data: cols, error: colErr } = await supabase
      .from('farm_plans')
      .select('id, plan_data, user_id')
      .limit(1);

    if (colErr) {
      console.log('Error selecting user_id:', colErr.message);
    } else {
      console.log('Successfully selected user_id column!');
    }

    const { data: allData, error: allErr } = await supabase
      .from('farm_plans')
      .select('*')
      .limit(1);

    if (allErr) {
      console.error('Error selecting *:', allErr.message);
    } else {
      console.log('All columns in farm_plans:');
      if (allData.length > 0) {
        console.log(Object.keys(allData[0]));
      } else {
        console.log('Table is empty, but query succeeded.');
      }
    }
  } catch (err) {
    console.error('Crashed:', err);
  }
}

checkDB();
