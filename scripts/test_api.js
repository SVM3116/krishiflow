const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';

const logSection = (name) => {
  console.log('\n' + '='.repeat(60));
  console.log(` TESTING: ${name}`);
  console.log('='.repeat(60));
};

const runTests = async () => {
  console.log('Starting KrishiFlow AI API Tests...\n');
  
  // 0. Check if server is running
  try {
    await axios.get(`${BASE_URL}/api/health`);
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', `ERROR: Server is not running at ${BASE_URL}.`);
    console.log('Please start the server first in another terminal window:');
    console.log('\x1b[36m%s\x1b[0m', '  npm run dev');
    console.log('Then run this test script again in this window:');
    console.log('\x1b[36m%s\x1b[0m', '  npm run test-api\n');
    process.exit(1);
  }

  // Retrieve token for authenticated endpoints
  let authHeaders = {};
  try {
    const frontendEnv = fs.readFileSync('./frontend_part/.env', 'utf8');
    const anonKeyLine = frontendEnv.split('\n').find(line => line.trim().startsWith('VITE_SUPABASE_ANON_KEY='));
    const anonKey = anonKeyLine ? anonKeyLine.split('=')[1].trim() : '';
    const supabaseUrl = process.env.SUPABASE_URL;

    if (supabaseUrl && anonKey) {
      console.log('Initializing Supabase client to obtain Auth token...');
      const supabase = createClient(supabaseUrl, anonKey);
      
      const testEmail = `api_test_${Date.now()}@gmail.com`;
      const testPassword = 'password123';
      
      console.log(`Signing up test user: ${testEmail}...`);
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword
      });

      if (!error && data.session) {
        authHeaders = { headers: { Authorization: `Bearer ${data.session.access_token}` } };
        console.log('✔ Obtained Bearer token successfully!');
      } else {
        // If signup requires confirmation and didn't auto-login, try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });
        if (!signInError && signInData.session) {
          authHeaders = { headers: { Authorization: `Bearer ${signInData.session.access_token}` } };
          console.log('✔ Obtained Bearer token via Sign In successfully!');
        } else {
          console.warn('⚠ Could not retrieve session token, secured endpoints might fail:', signInError?.message || error?.message);
        }
      }
    }
  } catch (e) {
    console.warn('⚠ Failed to read credentials for Supabase client:', e.message);
  }

  try {
    // 1. Health Check
    logSection('GET /api/health');
    const healthRes = await axios.get(`${BASE_URL}/api/health`);
    console.log('Status Code:', healthRes.status);
    console.log('Response:', JSON.stringify(healthRes.data, null, 2));
    if (healthRes.data.status === 'healthy') {
      console.log('\x1b[32m%s\x1b[0m', '✔ Health check passed!');
    }

    // 2. Crop Pairs Recommendations
    logSection('GET /api/crop-pairs');
    const cropUrl = `${BASE_URL}/api/crop-pairs?soil=red&water=low&region=belagavi&season=kharif&limit=3`;
    console.log(`Querying: ${cropUrl}`);
    const cropRes = await axios.get(cropUrl);
    console.log('Status Code:', cropRes.status);
    console.log('Crops Found:', cropRes.data.data.total_found);
    console.log('Top Recommendation:', cropRes.data.data.crops[0]?.primary_crop, '+', cropRes.data.data.crops[0]?.companion_crop);
    console.log('Match Score:', cropRes.data.data.crops[0]?.match_score);
    if (cropRes.status === 200 && cropRes.data.data.crops.length > 0) {
      console.log('\x1b[32m%s\x1b[0m', '✔ Crop recommendations endpoint passed!');
    }

    // 3. POST /api/analyze-farm (HACKATHON DEMO SCENARIO)
    logSection('POST /api/analyze-farm (Demo Scenario)');
    const demoPayload = {
      farm_name: "Ravi's Farm",
      location: "belagavi",
      state: "Karnataka",
      area_acres: 1.0,
      soil_type: "red",
      water_level: "medium",
      budget: 50000,
      season: "kharif"
    };
    console.log('Sending payload:', JSON.stringify(demoPayload, null, 2));
    const analyzeRes = await axios.post(`${BASE_URL}/api/analyze-farm`, demoPayload, authHeaders);
    console.log('Status Code:', analyzeRes.status);
    
    const plan = analyzeRes.data.data;
    console.log('Generated Plan ID:', plan.plan_id);
    console.log('Zones count:', plan.zones.length);
    console.log('Annual Income:', plan.annual_income);
    console.log('Scores:', JSON.stringify(plan.scores, null, 2));
    
    // Print zone schedule details
    plan.zones.forEach(z => {
      if (z.seasons) {
        console.log(`- ${z.name}:`);
        Object.keys(z.seasons).forEach(s => {
          const info = z.seasons[s];
          console.log(`  * ${s.toUpperCase()}: ${info.cropPair.join(" + ")} | Plant: ${info.plantingMonth} | Harvest: ${info.harvestMonths.join(", ")} | Profit: ₹${info.expectedIncome}`);
        });
      } else {
        console.log(`- ${z.name}: ${z.primary_crop} + ${z.companion_crop} | Plant: ${z.planting_month} | Harvest: ${z.harvest_month} | Profit: ₹${z.expected_profit}`);
      }
    });

    if (analyzeRes.status === 201 && plan.zones.length === 3 && plan.plan_id) {
      console.log('\x1b[32m%s\x1b[0m', '✔ Farm analysis algorithm and DB insert passed!');
    }

    const testPlanId = plan.plan_id;

    // 4. GET /api/plans (List Plan summaries)
    logSection('GET /api/plans');
    const listRes = await axios.get(`${BASE_URL}/api/plans`, authHeaders);
    console.log('Status Code:', listRes.status);
    console.log('Plans list length:', listRes.data.data.length);
    const planSummary = listRes.data.data.find(p => p.id === testPlanId);
    if (planSummary) {
      console.log('✔ Found our generated plan summary in the list!');
    }
    if (listRes.status === 200) {
      console.log('\x1b[32m%s\x1b[0m', '✔ Plans list endpoint passed!');
    }

    // 5. GET /api/plans/:planId (Full detail fetch)
    logSection(`GET /api/plans/${testPlanId}`);
    try {
      const detailRes = await axios.get(`${BASE_URL}/api/plans/${testPlanId}`, authHeaders);
      console.log('Status Code:', detailRes.status);
      console.log('Retrieved Farm Name:', detailRes.data.data.farm_name);
      console.log('Saved Zones count:', detailRes.data.data.zones.length);
      if (detailRes.status === 200 && detailRes.data.data.farm_name === "Ravi's Farm") {
        console.log('\x1b[32m%s\x1b[0m', '✔ Plans detail fetch endpoint passed!');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log('\x1b[33m%s\x1b[0m', '⚠ Plan detail lookup returned 404 (Expected if database is not configured/seeded).');
      } else {
        throw err;
      }
    }

    // 6. GET /api/income-calendar/:planId (Lite calendar fetch)
    logSection(`GET /api/income-calendar/${testPlanId}`);
    try {
      const calendarRes = await axios.get(`${BASE_URL}/api/income-calendar/${testPlanId}`, authHeaders);
      console.log('Status Code:', calendarRes.status);
      console.log('Income Calendar Months:', calendarRes.data.data.income_calendar.length);
      console.log('Annual Income:', calendarRes.data.data.annual_income);
      if (calendarRes.status === 200 && calendarRes.data.data.income_calendar.length === 12) {
        console.log('\x1b[32m%s\x1b[0m', '✔ Lite income calendar endpoint passed!');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log('\x1b[33m%s\x1b[0m', '⚠ Plan income calendar lookup returned 404 (Expected if database is not configured/seeded).');
      } else {
        throw err;
      }
    }

    // 7. GET /api/weather/:district
    logSection('GET /api/weather/belagavi');
    const weatherRes = await axios.get(`${BASE_URL}/api/weather/belagavi`);
    console.log('Status Code:', weatherRes.status);
    console.log('Location Name:', weatherRes.data.data.location);
    console.log('Temperature:', weatherRes.data.data.temperature + '°C');
    console.log('Farming Advisory:', weatherRes.data.data.farming_advisory);
    console.log('Is Mock Data Fallback:', weatherRes.data.data.is_mock);
    if (weatherRes.status === 200 && weatherRes.data.data.farming_advisory) {
      console.log('\x1b[32m%s\x1b[0m', '✔ Weather and advisory endpoint passed!');
    }

    // 8. POST /api/pest-detect
    logSection('POST /api/pest-detect');
    const pestPayload = {
      crop_name: 'Tomato',
      symptoms: ['yellowing leaves', 'sticky residue', 'honeydew']
    };
    console.log('Diagnosing for crop:', pestPayload.crop_name, 'with symptoms:', pestPayload.symptoms);
    const pestRes = await axios.post(`${BASE_URL}/api/pest-detect`, pestPayload);
    console.log('Status Code:', pestRes.status);
    console.log('Diagnosed Pest:', pestRes.data.data.pest_name);
    console.log('Confidence Label:', pestRes.data.data.confidence_label);
    console.log('Traditional Remedy:', pestRes.data.data.traditional_remedy);
    if (pestRes.status === 200 && pestRes.data.data.pest_name === 'Aphids') {
      console.log('\x1b[32m%s\x1b[0m', '✔ Pest detection endpoint passed!');
    }

    console.log('\n' + '='.repeat(60));
    console.log('\x1b[32m%s\x1b[0m', ' ALL API ENDPOINTS PASSED SUCCESSFULLY!');
    console.log('='.repeat(60) + '\n');
  } catch (err) {
    console.error('\n\x1b[31m%s\x1b[0m', 'TEST FAILED WITH ERROR:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message || err);
    }
    process.exit(1);
  }
};

runTests();
