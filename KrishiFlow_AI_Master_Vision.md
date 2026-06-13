# KrishiFlow AI: Master Project Vision Document
## Traditional Farming Intelligence Platform for Continuous Income
**Hackathon Target Date**: June 10–13, 2026

---

## 1. Executive Summary & Tagline
> **"From Seasonal Harvests to Continuous Income."**

Most modern digital agriculture systems focus purely on maximizing yield per harvest. However, this model keeps farmers financially vulnerable: they invest heavily for months, receive income only once or twice a year, face high market oversupply risk, and have abandoned age-old traditional farming knowledge.

**KrishiFlow AI** shifts the focus from yield optimization to **Continuous Cash Flow Optimization**. It combines traditional intercropping knowledge, staggered cultivation scheduling, and modern market saturation forecasting into an intelligent agricultural planner. The system divides a farmer's land into optimized zones, suggests ancient companion crop combinations, offsets sowing dates, and provides a weekly calendar showing expected monthly cash flow.

---

## 2. Core Problem & Solution

### The Current Agricultural Realities
* **Problem 1: Seasonal Income vs. Daily Expenses.** Farmers receive cash once in 3 to 6 months, but they must buy food, pay school fees, and purchase inputs daily.
* **Problem 2: Market Saturation & Price Crashes.** If all farmers in a region plant tomato simultaneously in June, supply skyrockets in September, causing local market prices to collapse.
* **Problem 3: Loss of Heritage Soil Wisdom.** Monoculture (growing a single crop) depletes soil nutrients, increases pest susceptibility, and makes farmers dependent on expensive chemical fertilizers.
* **Problem 4: Inefficient Resource Load.** Sowing and harvesting a single crop all at once creates massive labor bottlenecks and high water requirements.

### The KrishiFlow Solution
Instead of asking *"What single crop should I grow?"*, KrishiFlow answers:
> **"What combination of crops should I grow, where on my farm, and when should I sow them to generate stable, monthly income while rebuilding soil health?"**

---

## 3. User Journey & Product Workflow

1. **Step 1: Land Parameters Input**
   * The farmer uploads their farm size (e.g., 1 to 5 acres), location/district (e.g., Belagavi), soil type (e.g., Red Soil), water availability (e.g., Medium), and working budget (e.g., ₹50,000).
2. **Step 2: Land Zoning & Staggered Division**
   * The land is split into 3 to 6 cultivation zones (e.g., Zone A, B, and C). Sowing dates are offset by 30 to 45 days.
3. **Step 3: Companion Crop Recommendations**
   * The engine queries a traditional pairing database to recommend dual crop layers (e.g., Jowar + Pigeon Pea, Tomato + Marigold).
4. **Step 4: Continuous Income Calendar Simulation**
   * The platform builds a visual 12-month calendar comparison. It graphs KrishiFlow's smooth monthly income against the huge, volatile spike of traditional monoculture.
5. **Step 5: Traditional Farming Intelligence Dashboard**
   * Farmers receive actionable insights:
     * **Grandfather Mode**: A toggle that renders scientific recommendations in the warm, folklore voice of a seasoned village elder.
     * **3-Year Rotation Planner**: Recommends soil-rebuilding rotation crops (e.g., groundnut to fix nitrogen in year 2).
     * **Water Management Advisor**: Recommends farm ponds (Krishi Hondas) or contour bunding based on local water conditions.
     * **Heritage Organic Fertilizers**: Calculates exact quantities of Jeevamrutha and compost needed for the farm size.
     * **Pollinator & Border Crop Planner**: Details sunflower/marigold row border layouts.

---

## 4. Platform Architecture & Data Schema

### Technology Stack
* **Frontend**: React (Vite) + TypeScript + Tailwind CSS (Aesthetic glassmorphic styling, Recharts visualization, Lucide icons).
* **Backend**: Node.js + Express.js API server (handles farm planning logic, weather proxy, and crop suitability ranking).
* **Database & Auth**: Supabase (PostgreSQL database for farm plans, built-in Supabase Auth with metadata for Name and Mobile Number).

### Database Schema (`farm_plans`)
```sql
CREATE TABLE farm_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    farm_name VARCHAR NOT NULL,
    land_area NUMERIC(5,2) NOT NULL,
    district VARCHAR NOT NULL,
    state VARCHAR NOT NULL,
    soil_type VARCHAR NOT NULL,
    water_availability VARCHAR NOT NULL,
    season VARCHAR NOT NULL,
    budget INTEGER NOT NULL,
    plan_data JSONB NOT NULL, -- Full frontend-compatible JSON document
    
    -- Backend specific searchable metrics
    annual_income INTEGER NOT NULL,
    num_income_months INTEGER NOT NULL,
    stability_score NUMERIC(5,2) NOT NULL,
    sustainability_score NUMERIC(5,2) NOT NULL,
    biodiversity_score NUMERIC(5,2) NOT NULL,
    risk_score NUMERIC(5,2) NOT NULL,
    total_score NUMERIC(5,2) NOT NULL,
    traditional_wisdom TEXT
);
```

---

## 5. The Decision Matrix (AI Scoring Formula)
To prevent the system from blindly recommending high-profit/high-risk monocultures, plans are evaluated using a balanced composite scoring engine:

$$\text{Final Score} = 35\% \text{ Expected Profit} + 25\% \text{ Income Stability} + 20\% \text{ Sustainability} + 10\% \text{ Biodiversity} + 10\% \text{ Risk Reduction}$$

* **Expected Profit (35%)**: Compares annual yield value to local crop pricing benchmarks.
* **Income Stability (25%)**: Scores based on the spread of harvesting cycles across the 12-month calendar.
* **Sustainability (20%)**: Evaluates nitrogen fixation, chemical fertilizer avoidance, and soil wear.
* **Biodiversity (10%)**: Measures the number of overlapping species and presence of pollinator boundaries.
* **Risk Reduction (10%)**: Measures resilience against pest outbreaks and water stress.

---

## 6. MVP Development Roadmap (72-Hour Plan)

### Day 1: Authentication & Form Layout
* Set up Supabase SignUp/SignIn with Full Name, 10-digit Indian Mobile Number, Email, and Password.
* Build the farm parameter configuration form (District, Area, Soil, Water, Budget, Season).
* Setup database tables and RLS (Row Level Security) policies so users only see their own saved plans.

### Day 2: Analytics, Algorithms & Staggered Timelines
* Implement backend planning algorithm that dynamically zones land and offset crop sowing schedules.
* Write the companion crop pairing database.
* Connect Recharts to show the comparison between KrishiFlow monthly income and monoculture spikes.

### Day 3: Traditional Intelligence Dashboard & Polish
* Add the **Grandfather Mode** toggle to render ancestral folk voice lines.
* Implement the **3-Year Crop Rotation Planner** and the **Natural Fertility Calculator** (compost, cow dung, Jeevamrutha).
* Build the manual pest diagnostic scanner and local weather proxy.
* Finalize styling, transition animations, and PDF export function.

---

## 7. Pitch Presentation & Demo Script

### The Hook (First 30 Seconds)
> *"Judges, let's meet Ramesh. Ramesh owns 1 acre of land in Belagavi. Every year, he plants Tomato on his entire acre. In June, he spends all his money. In September, he harvests. But so do ten thousand other farmers. Ramesh's tomatoes crash to ₹2 per kg. He makes a loss, receives zero income for the next six months, and falls into debt. This is not a yield problem; this is a cash flow problem. Ramesh doesn't need to grow more tomatoes; he needs a Continuous Income System. Meet KrishiFlow AI."*

### The Demo Highlights
1. **Show User Authentication**: Ramesh logs in securely. His saved plans are safe and isolated.
2. **Create a Plan**: Ramesh enters his 1-acre farm details. The system divides it into Zone A, B, and C.
3. **Show the Income Calendar**: Point to the Recharts graph. Show how the massive red spike (monoculture) is flattened into steady, predictable monthly green bars (KrishiFlow plan).
4. **Trigger Grandfather Mode**: Toggle Grandfather Mode. Point out how the system transforms technical terms into warm, regional guidance like: *"My child, grow Tomato alongside Marigold. The bright flower will call the honeybees, while its roots drive away the worms..."*
5. **Show Sustainability Metrics**: Show the 3-year crop rotation chart, organic compost calculations, and biodiversity score. Ramesh now has a sustainable roadmap for three years.

### Winning Closing Statement
> *"Modern agricultural technology teaches farmers how to maximize yield per harvest. KrishiFlow AI teaches farmers how to secure stable income across the entire year. By marrying ancient companion farming wisdom with modern predictive planning, we turn farming from a high-risk gamble into a sustainable, continuous income ecosystem. Thank you."*
