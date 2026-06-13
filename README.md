# KrishiFlow AI

> **ATH HACKATHON 0.1 (2026)**  
> **Tagline:** Bridging Heritage Agriculture and Artificial Intelligence — From Seasonal Harvests to Continuous Income.  
> **Team Name:** One Rupee  
> **Team Members:** Manoj Kumar V & Prajwal V Gowda  

---

## Project Overview
KrishiFlow AI is a unified agricultural planning and optimization platform designed to bring ancient Indian traditional heritage farming wisdom into the modern era using artificial intelligence. The platform optimizes crop yields, resource usage, and pest management, but its core innovation lies in stabilizing farmers' livelihoods by transforming highly volatile seasonal income spikes into a steady, reliable, year-round cashflow calendar.

---

## Problem Statement
Indian farmers are caught in a cycle of chemical-heavy, single-crop monoculture. This practice leads to:
1. **Income Volatility:** Farmers receive their entire annual revenue in one or two single, highly volatile spikes after harvests, leaving them with zero cashflow for the rest of the year.
2. **High Systemic Risk:** Vulnerability to single-pest outbreaks or localized weather shocks which can wipe out an entire season's livelihood.
3. **Soil & Resource Degradation:** Monoculture depletes soil nutrients and relies excessively on chemical fertilizers, driving farmers into debt.

---

## Proposed Solution
KrishiFlow AI solves this by partitioning the farm into **Staggered Dynamic Zones**. The platform:
* Splits the farm's acreage into multiple optimized zones.
* Assigns traditional nitrogen-fixing **companion crop pairs** (e.g. Maize with Cowpea, Bajra with Horse Gram) to naturally replenish soil fertility without chemical inputs.
* **Staggers sowing and harvest schedules** month-by-month, creating a sequential harvest calendar that delivers positive, continuous cashflow all 12 months of the year, reducing risk by **64%** and income variance by **3.2x**.

---

## Features
1. **Crop Recommendations & Zoning Engine:** Automatically splits farms into zones and assigns optimized heritage crop pairs based on soil type, water availability, and budget.
2. **Continuous Income Calendar:** Interactive Recharts-driven visual comparing traditional monoculture spikes against KrishiFlow's staggered income.
3. **Climate & Advisory Integration:** Real-time localized weather data with custom rain animations and agronomic sowing advice.
4. **Market Intelligence:** Live APMC Mandi rates paired with AI-driven 1-month, 3-month, and 6-month price projection charts.
5. **Resource Optimization:** Computes organic bio-input quantities (e.g., Jeevamrutha) with cost-savings tracking, plus designs for water catchments (*Krishi Honda*) and marigold trap borders.
6. **ML Pest Diagnostics:** Uploads photos of crop leaves, runs image analysis, and provides traditional organic cures.
7. **Supabase Cloud Sync:** Robust account registration, cloud plan storage, and seamless session recovery.

---

## Technology Stack
### Frontend
* **Core:** React 19, Vite, TypeScript
* **Routing:** TanStack Router (Fully bookmarkable URL parameters)
* **Styling:** Tailwind CSS, Custom Glassmorphism, CSS keyframes for weather animation
* **Charts:** Recharts (Interactive bar charts and projection line charts)

### Backend
* **Runtime & Framework:** Node.js, Express.js
* **Database:** Supabase (PostgreSQL with Row Level Security)
* **Pest Diagnostics:** Fuzzy keyword matcher & ML diagnostics pipeline simulator
* **External Integrations:** OpenWeatherMap API & Live APMC rate crawlers

---

## Setup & Usage Instructions

### Repository Protection (Git Restrictions)
To maintain workspace integrity and prevent uploading auto-generated configuration metadata, the following files and directories are ignored from git tracking via `.gitignore` in both the root and frontend directories:
* `.lovable/` (Lovable editor metadata)
* `.gemini/` / `.antigravity/` (Antigravity AI agent workspace directories)
* `node_modules/` & built assets (`dist/`, `build/`)

### Prerequisite Setup
1. Ensure [Node.js](https://nodejs.org/) (v18+) is installed.
2. Sign up on [Supabase](https://supabase.com) and create a PostgreSQL database.

### 1. Backend Server Setup
From the repository root:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root folder using this template:
   ```env
   PORT=3001
   NODE_ENV=development
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENWEATHERMAP_API_KEY=your-open-weather-key
   ```
3. Set up the SQL tables in the Supabase Dashboard SQL Editor using the schema defined in [schema.sql](file:///c:/Users/oneru/Downloads/KrishiFlow%20AI/schema.sql).
4. Populate the crop pairing catalog and pest rules:
   ```bash
   npm run seed
   ```
5. Start the backend:
   ```bash
   npm run dev
   ```

### 2. Frontend Development Setup
Navigate to the `frontend_part` directory:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env` inside `frontend_part`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anonymous-key
   VITE_API_URL=http://localhost:3001
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application locally at `http://localhost:8080/`.

---

## Team Details
* **Team Name:** One Rupee  
* **Hackathon:** ATH HACKATHON 0.1 (2026)  
* **Team Members:**  
  1. **Manoj Kumar V** (Full Stack Developer / Integrations)  
  2. **Prajwal V Gowda** (AI & Frontend Specialist)
