-- =============================================================
-- KRISHIFLOW AI - MASTER DATABASE REBUILD SCHEMA
-- ATH Hackathon 0.1 (June 10-13, 2026)
-- Run this script in the SQL Editor of your Supabase dashboard.
-- =============================================================

-- 1. Drop existing tables to start fresh
DROP TABLE IF EXISTS farm_plans CASCADE;
DROP TABLE IF EXISTS crop_pairs CASCADE;
DROP TABLE IF EXISTS pest_rules CASCADE;

-- 2. Create the Crop Pairs table (Traditional Companion Cropping Knowledge Base)
CREATE TABLE crop_pairs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id TEXT UNIQUE NOT NULL,
    primary_crop TEXT NOT NULL,
    companion_crop TEXT NOT NULL,
    suitable_soil TEXT[] NOT NULL,
    water_requirement TEXT NOT NULL,
    regions TEXT[] NOT NULL,
    seasons TEXT[] NOT NULL,
    duration_days INTEGER NOT NULL,
    benefits TEXT[] NOT NULL,
    traditional_wisdom TEXT NOT NULL,
    revenue_per_acre INTEGER NOT NULL,
    input_cost_per_acre INTEGER NOT NULL,
    net_profit_per_acre INTEGER GENERATED ALWAYS AS (revenue_per_acre - input_cost_per_acre) STORED,
    biodiversity_score INTEGER NOT NULL,
    sustainability_score INTEGER NOT NULL,
    risk_level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create the Farm Plans table (Optimized Staggered Crop Plots)
CREATE TABLE farm_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    location TEXT NOT NULL,
    state TEXT NOT NULL,
    area_acres NUMERIC(6,2) NOT NULL,
    soil_type TEXT NOT NULL,
    water_level TEXT NOT NULL,
    budget INTEGER NOT NULL,
    season TEXT NOT NULL,
    zones JSONB NOT NULL,
    income_calendar JSONB NOT NULL,
    annual_income INTEGER NOT NULL,
    num_income_months INTEGER NOT NULL,
    stability_score NUMERIC(5,2) NOT NULL,
    sustainability_score NUMERIC(5,2) NOT NULL,
    biodiversity_score NUMERIC(5,2) NOT NULL,
    risk_score NUMERIC(5,2) NOT NULL,
    total_score NUMERIC(5,2) NOT NULL,
    traditional_wisdom TEXT,
    plan_data JSONB NOT NULL, -- Full frontend-compatible JSON document
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create the Pest Rules table (Fuzzy pest detection and diagnostics library)
CREATE TABLE pest_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_name TEXT NOT NULL,
    crop_keywords TEXT[] DEFAULT '{}'::TEXT[],
    symptom_keywords TEXT[] NOT NULL,
    pest_name TEXT NOT NULL,
    pest_type TEXT,
    severity TEXT,
    description TEXT NOT NULL,
    traditional_remedy TEXT NOT NULL,
    chemical_option TEXT,
    prevention_tips TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE crop_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pest_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_plans ENABLE ROW LEVEL SECURITY;

-- 6. Setup RLS Policies for Crop Pairs (Everyone can read, only Service Role can modify)
CREATE POLICY "Allow public read access to crop_pairs" ON crop_pairs FOR SELECT TO public USING (true);
CREATE POLICY "Allow service_role write access to crop_pairs" ON crop_pairs FOR ALL TO service_role USING (true);

-- 7. Setup RLS Policies for Pest Rules (Everyone can read, only Service Role can modify)
CREATE POLICY "Allow public read access to pest_rules" ON pest_rules FOR SELECT TO public USING (true);
CREATE POLICY "Allow service_role write access to pest_rules" ON pest_rules FOR ALL TO service_role USING (true);

-- 8. Setup RLS Policies for Farm Plans (Users can only access their own records)
CREATE POLICY "Users can read their own plans" ON farm_plans
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plans" ON farm_plans
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans" ON farm_plans
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plans" ON farm_plans
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- 9. Setup Service Role override policy for testing suite execution
CREATE POLICY "Service role has full access to farm_plans" ON farm_plans FOR ALL TO service_role USING (true);

-- 10. Force PGRST Cache Reload
NOTIFY pgrst, 'reload schema';
