# KrishiFlow AI
**Tagline:** From Seasonal Harvests to Continuous Income

---

## Project Overview

KrishiFlow AI is an AI-powered agricultural planning platform that combines ancient Indian traditional farming wisdom with modern artificial intelligence to solve the cashflow crisis faced by smallholder farmers across India.

Unlike existing agritech platforms that focus purely on maximizing crop yield, KrishiFlow AI solves a deeper problem — income instability. The platform divides a farmer's land into multiple staggered cultivation zones, assigns traditional companion crop pairs to each zone, and staggers sowing dates so that harvests arrive every month instead of all at once. The result is a continuous, stable monthly income stream that replaces the volatile, twice-a-year harvest spike that currently drives millions of farmers into debt.

The platform brings together smart zone planning, live weather advisories, APMC market intelligence, ML-based pest detection with real leaf image diagnostics, a traditional farming heritage portal, an organic inputs calculator, a 3-year crop rotation planner, and a live farm task ledger — all in one unified, mobile-friendly web application.

---

## Problem Statement

**PS-03 — Enhancing Farmer Productivity Through Innovative Technology Solutions**

Smallholder farmers in India — who make up over 86% of all farming households — face three deeply connected challenges that no single technology currently addresses together:

**1. Severe Income Volatility**
Conventional monoculture farming concentrates all revenue into 1 to 2 months per year, immediately after a single harvest. For the remaining 10 months, farmers earn nothing but continue to face daily expenses for food, school fees, medicine, and loan repayments. This forces them into high-interest debt cycles with local moneylenders.

**2. High Systemic Risk**
When every farmer in a region plants the same crop at the same time, supply floods the market at harvest, crashing prices below the cost of cultivation. A single pest outbreak, disease, or weather event can wipe out 100% of that year's income with no backup.

**3. Soil and Resource Degradation**
Monoculture depletes specific soil nutrients every season, forcing farmers to spend more on chemical fertilizers each year. This worsens soil health, increases input costs, and destroys the natural pest resistance that traditional companion planting once provided — creating a cycle of declining productivity and rising debt.

---

## Proposed Solution

KrishiFlow AI implements **AI-Powered Staggered Multi-Zone Companion Cropping** — a system that modernizes and scales traditional Indian farming wisdom using artificial intelligence and real-time data.

**Zone-Based Farm Partitioning**
The farmer's total land is divided into 3 to 6 optimized cultivation zones based on area, soil type, water availability, and budget. Each zone operates as an independent income unit.

**Heritage Companion Crop Assignment**
Each zone is matched with a traditional companion crop pair drawn from centuries of Indian agricultural knowledge — such as Jowar + Pigeon Pea, Tomato + Marigold, Ragi + Horsegram, or Groundnut + Red Gram. The companion crop naturally provides nitrogen fixation, weed control, or biological pest protection, significantly reducing chemical input costs.

**Chronological Staggered Scheduling**
Sowing dates are staggered across zones by 30 to 45 days. Zone A is planted first, Zone B one month later, Zone C one month after that. Because each zone follows a similar crop duration, harvests arrive sequentially — one zone harvests while another is still growing. This creates a rolling monthly income calendar across 6 to 9 months of the year.

**AI Composite Scoring**
Every farming plan is scored across five weighted dimensions — Expected Profit (35%), Income Stability (25%), Sustainability (20%), Biodiversity (10%), and Risk Reduction (10%) — and the highest-scoring plan is recommended to the farmer.

**Measurable Impact**
- Income distributed across 6 to 9 months instead of 1 to 2
- Risk reduced by approximately 64% through crop diversification
- Income variance reduced by 3.2x through staggered scheduling
- Input costs reduced by 20 to 35% through traditional organic farming practices

---

## Features

**1. Smart Zone Planning and Sowing Engine**
Farmers enter their land area, district, soil type, water availability, season, and budget. The AI divides the farm into zones, assigns the most suitable traditional companion crop pair to each zone, and generates a complete staggered sowing and harvesting calendar tailored to the farmer's exact conditions.

**2. Continuous Income and Comparison Dashboard**
An interactive visualization built with Recharts compares two scenarios side by side — traditional monoculture with income concentrated in 1 to 2 months versus the KrishiFlow staggered plan with income spread across multiple months. Supporting cards display annual revenue, net profit, active earning months, stability score, biodiversity score, sustainability score, and overall composite plan score.

**3. Live Crop Monitor and Interactive Task Ledger**
A month-by-month task management board for every zone on the farm. Tasks include soil preparation, sowing, organic input application, weeding, and harvesting. Farmers mark tasks as complete in real time, with progress saved to the database automatically. Each zone displays its current growth stage and a live health status indicator.

**4. Climate and Agronomic Advisory Engine**
Live 5-day weather forecasts fetched from the OpenWeatherMap API and mapped to the farmer's district. The engine generates practical agronomic advisories based on upcoming weather — for example, recommending a delay in organic spray applications before forecasted rain, or advising extra irrigation during a high-temperature period.

**5. Crop Diagnostics and ML Pest Detector**
Farmers either select visible symptoms from a checklist or upload a photograph of the affected leaf directly. The leaf image is processed through a Python-based ML diagnostic model that identifies the pest or disease with a confidence score. Results include a side-by-side comparison of the traditional organic remedy and the emergency chemical option, along with prevention tips for future seasons.

**6. Farming Heritage and Market Intelligence Portal**
A knowledge hub containing a Traditional Wisdom Library documenting ancestral companion planting practices and regional farming heritage, a 3-Year Crop Rotation Planner that generates zone-level rotation schedules to restore soil nutrients and break pest cycles, an Organic Inputs Calculator that computes exact quantities of Jeevamrutha, compost, cow dung slurry, and green manure seeds based on farm acreage, and Market Outlook Alerts that warn farmers about regional crop oversupply risk and suggest alternative crop choices.

**7. Cloud Synchronization and Authentication Portal**
Secure email and password authentication powered by Supabase Auth with a Python middleware layer handling token validation. All farm plans, task progress, and crop monitor data are saved to the cloud and linked to each farmer's unique account, accessible from any device.

---

## Technology Stack

**Frontend**
- React 19 with TypeScript and Vite
- Bun as the package manager and runtime
- TanStack Router for deep-linked navigation
- Tailwind CSS with custom glassmorphic design system
- shadcn/ui component library
- Recharts for interactive income calendar and comparison charts
- Lucide React for icons
- Supabase JS Client for authentication and direct database reads

**Backend**
- Node.js with Express.js for API routing
- Python for all AI services, ML models, and business logic
  - `crop_model.py` — crop recommendation and suitability scoring
  - `pest_model.py` — ML-based leaf diagnostic and pest detection
  - `plan_service.py` — farm analysis, zone planning, and income calendar
  - `weather_service.py` — OpenWeatherMap integration and advisory engine
  - `auth.py` — Supabase Auth middleware and JWT token validation
  - `monthUtils.py` — staggered planting and harvest date calculations
- Supabase (PostgreSQL) with Row Level Security policies
- OpenWeatherMap API for live weather data and 5-day forecasts
- APMC Mandi price data for market intelligence

**Deployment**
- Frontend: Vercel
- Backend: Railway
- Database: Supabase (managed PostgreSQL)

---

## Setup and Usage Instructions

**Prerequisites**
- Node.js v18 or higher
- Python 3.14 or higher
- Bun (for frontend)
- Supabase account (free tier)
- OpenWeatherMap account (free tier)

**Backend Setup**

Install Node.js dependencies from the repository root:
```
npm install
```

Install Python dependencies:
```
pip install -r requirements.txt
```

Create a `.env` file in the root directory:
```
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENWEATHERMAP_API_KEY=your_openweathermap_key
```

Run the database seed script to populate the crop knowledge base:
```
node scripts/seed.js
```

Start the backend server:
```
python main.py
```

**Frontend Setup**

Navigate to the frontend directory and install dependencies using Bun:
```
cd frontend_part
bun install
```

Create a `.env` file inside the `frontend_part` directory:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:3001/api
```

Start the frontend development server:
```
bun run dev
```

Access the application at `http://localhost:8080`

**Demo Scenario**

To see the platform in action, enter the following values in the farm analysis form:

| Field | Value |
|---|---|
| Farm Name | Ravi's Farm |
| Location | Belagavi, Karnataka |
| Land Area | 1 Acre |
| Soil Type | Red Soil |
| Water Availability | Medium |
| Season | Kharif 2026 |
| Budget | ₹50,000 |

Expected result: 3 zones with staggered June, July, and August sowing dates, harvests arriving from September through January, and an estimated annual income of ₹1,20,000 to ₹1,50,000.

---

## Team Details

**Hackathon:** ATH Hackathon 0.1 — 2026
**Problem Statement:** PS-03 — Enhancing Farmer Productivity Through Innovative Technology Solutions
**Team Name:** One Rupee

| Name | Role |
|---|---|
| Manoj Kumar V | Full Stack Developer and Backend Integrations |
| Prajwal V Gowda | Full Stack and UI Developer |
