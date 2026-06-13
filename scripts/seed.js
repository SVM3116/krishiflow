const { supabase } = require('../services/supabaseClient');
const { FALLBACK_CROP_PAIRS } = require('../services/cropService');
const LOCAL_PEST_RULES = require('../data/pestRules');

const seedDatabase = async () => {
  console.log('Starting KrishiFlow AI database seeding...');

  // Check if Supabase client is initialized with actual values
  const isConfigured = 
    process.env.SUPABASE_URL && 
    process.env.SUPABASE_URL !== 'https://your-supabase-project.supabase.co' &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your_supabase_service_role_key';

  if (!isConfigured) {
    console.error('\x1b[31m%s\x1b[0m', 'ERROR: Supabase URL or Service Role Key is not configured in .env file.');
    console.log('Please follow Section 8 and Section 9 of the Implementation Plan:');
    console.log('1. Create a project on supabase.com');
    console.log('2. Run the table creation SQL in Supabase SQL Editor');
    console.log('3. Copy your project URL & service_role key to .env');
    console.log('4. Run this seed script again: npm run seed');
    process.exit(1);
  }

  try {
    // 1. Seed Crop Pairs
    console.log('\n[1/2] Seeding crop_pairs table...');
    
    // Clear existing crop pairs
    const { error: deleteCropErr } = await supabase
      .from('crop_pairs')
      .delete()
      .neq('crop_id', 'none_sentinel'); // Delete all rows safely

    if (deleteCropErr) {
      console.warn('Note: Could not delete old crop_pairs (might be table is empty or doesn\'t exist):', deleteCropErr.message);
    } else {
      console.log('Cleared existing crop_pairs records.');
    }

    // Insert 8 traditional crop pairs
    const { data: insertedCrops, error: insertCropErr } = await supabase
      .from('crop_pairs')
      .insert(FALLBACK_CROP_PAIRS)
      .select();

    if (insertCropErr) {
      throw new Error(`Failed to insert crop pairs: ${insertCropErr.message}`);
    }

    console.log(`\x1b[32mSuccessfully seeded ${insertedCrops.length} crop pairs in database!\x1b[0m`);

    // 2. Seed Pest Rules
    console.log('\n[2/2] Seeding pest_rules table...');
    
    // Clear existing pest rules
    const { error: deletePestErr } = await supabase
      .from('pest_rules')
      .delete()
      .neq('pest_name', 'none_sentinel');

    if (deletePestErr) {
      console.warn('Note: Could not delete old pest_rules:', deletePestErr.message);
    } else {
      console.log('Cleared existing pest_rules records.');
    }

    // Insert pest rules
    const { data: insertedPests, error: insertPestErr } = await supabase
      .from('pest_rules')
      .insert(LOCAL_PEST_RULES)
      .select();

    if (insertPestErr) {
      throw new Error(`Failed to insert pest rules: ${insertPestErr.message}`);
    }

    console.log(`\x1b[32mSuccessfully seeded ${insertedPests.length} pest detection rules in database!\x1b[0m`);
    console.log('\n\x1b[32mDatabase seeding completed successfully. KrishiFlow AI is ready!\x1b[0m\n');
    process.exit(0);
  } catch (err) {
    console.error('\n\x1b[31mSeeding failed with error:\x1b[0m', err.message || err);
    console.log('Make sure you have created the tables in Supabase SQL editor using the SQL schemas in Section 9 of the implementation plan.');
    process.exit(1);
  }
};

seedDatabase();
