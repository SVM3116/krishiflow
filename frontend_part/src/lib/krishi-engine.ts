import type { FarmInput, FarmPlan, MonthlyIncome, Zone } from "./krishi-types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const DEMO_INPUT: FarmInput = {
  farmName: "Manoj's Model Farm",
  landArea: 15,
  district: "Belagavi",
  state: "Karnataka",
  soilType: "Red",
  water: "Low",
  season: "Kharif",
  budget: 1500000,
};

export const KA_DISTRICTS = [
  "Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar","Chikkamagaluru",
  "Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Hassan",
  "Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur",
  "Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir",
];

export const STATES = ["Karnataka","Maharashtra","Tamil Nadu","Andhra Pradesh","Telangana","Kerala"];

function isDemo(input: FarmInput) {
  return input.farmName.toLowerCase().includes("ravi") && input.district === "Belagavi";
}

function getRegion(district: string): string {
  const d = (district || "").toLowerCase().trim();
  if (d.includes("belagavi") || d.includes("belgavi") || d.includes("belgaum")) return "belagavi";
  if (d.includes("bengaluru") || d.includes("bangalore") || d.includes("bangaluru")) return "bengaluru";
  if (d.includes("shivamogga") || d.includes("shimoga") || d.includes("shivamoga")) return "shivamogga";
  if (d.includes("kalaburagi") || d.includes("gulbarga") || d.includes("kalburgi") || d.includes("kalaburgi")) return "kalaburagi";
  return "belagavi"; // default fallback
}

export function buildPlan(input: FarmInput): FarmPlan {
  const acres = Math.max(0.5, input.landArea || 1.0);
  const soil = input.soilType.toLowerCase().includes("black") ? "Black" : "Red";
  const water = input.water.toLowerCase().includes("low") ? "Low" : "High";

  const numZones = acres <= 1.0 ? 3 : acres < 2.0 ? 4 : acres < 5.0 ? 5 : 6;
  const zoneArea = parseFloat((acres / numZones).toFixed(2));
  const waterFactor = water === "High" ? 1.0 : 0.70;
  
  let expenseRatio = 0.40;
  if (soil === "Red") expenseRatio += 0.02;
  if (water === "Low") expenseRatio += 0.03;
  expenseRatio = Math.max(0.40, Math.min(0.45, expenseRatio));

  const region = getRegion(input.district);

  const REGIONAL_CATALOGS: Record<string, Record<string, Record<string, Record<string, { crop: string; baseRev: number; sow: string; harvest: string }>>>> = {
    // ── BELAGAVI — Northern Transitional Zone ────────────────────────────────
    belagavi: {
      Black: {
        ZoneA: {
          kharif: { crop: "Sugarcane + Soyabean (Intercrop)", baseRev: 140000, sow: "Jun", harvest: "Oct" },
          rabi:   { crop: "Rabi Ratoon + Wheat",              baseRev: 90000,  sow: "Nov", harvest: "Feb" },
          zaid:   { crop: "Green Gram + Cover Crop",          baseRev: 30000,  sow: "Mar", harvest: "May" }
        },
        ZoneB: {
          kharif: { crop: "Jowar + Pigeon Pea",               baseRev: 65000,  sow: "Jun", harvest: "Sep" },
          rabi:   { crop: "Chickpea + Linseed",               baseRev: 40000,  sow: "Nov", harvest: "Jan" },
          zaid:   { crop: "Fodder Maize + Cowpea",            baseRev: 25000,  sow: "Mar", harvest: "Apr" }
        },
        ZoneC: {
          kharif: { crop: "Cotton + Groundnut",               baseRev: 95000,  sow: "Jun", harvest: "Aug" },
          rabi:   { crop: "Wheat + Mustard",                  baseRev: 45000,  sow: "Nov", harvest: "Dec" },
          zaid:   { crop: "Sunflower + Sesame",               baseRev: 35000,  sow: "Mar", harvest: "May" }
        }
      },
      Red: {
        ZoneA: {
          kharif: { crop: "Bajra + Pigeon Pea",               baseRev: 50000,  sow: "Jun", harvest: "Oct" },
          rabi:   { crop: "Horse Gram + Cover Crop",          baseRev: 28000,  sow: "Nov", harvest: "Feb" },
          zaid:   { crop: "Cowpea + Sunnhemp",                baseRev: 22000,  sow: "Mar", harvest: "May" }
        },
        ZoneB: {
          kharif: { crop: "Maize + Field Beans",              baseRev: 70000,  sow: "Jun", harvest: "Sep" },
          rabi:   { crop: "Safflower + Organic Cover",        baseRev: 32000,  sow: "Nov", harvest: "Jan" },
          zaid:   { crop: "Vegetables (Coriander/Mint)",      baseRev: 45000,  sow: "Mar", harvest: "Apr" }
        },
        ZoneC: {
          kharif: { crop: "Groundnut + Sesame",               baseRev: 60000,  sow: "Jun", harvest: "Aug" },
          rabi:   { crop: "Finger Millet (Ragi)",             baseRev: 38000,  sow: "Nov", harvest: "Dec" },
          zaid:   { crop: "Summer Cover + Dhaincha",          baseRev: 20000,  sow: "Mar", harvest: "May" }
        }
      }
    },
    // ── BENGALURU — Southern Dry Zone ───────────────────────────────────────
    bengaluru: {
      Black: {
        ZoneA: {
          kharif: { crop: "Maize + Field Beans",              baseRev: 75000,  sow: "Jun", harvest: "Sep" },
          rabi:   { crop: "Potato + Tomato",                  baseRev: 95000,  sow: "Nov", harvest: "Feb" },
          zaid:   { crop: "Watermelon + Bhendi",              baseRev: 60000,  sow: "Mar", harvest: "May" }
        },
        ZoneB: {
          kharif: { crop: "Soybean + Cowpea",                 baseRev: 65000,  sow: "Jun", harvest: "Oct" },
          rabi:   { crop: "Sunflower + Mustard",              baseRev: 48000,  sow: "Nov", harvest: "Jan" },
          zaid:   { crop: "Cluster Beans + Amaranth",         baseRev: 40000,  sow: "Mar", harvest: "Apr" }
        },
        ZoneC: {
          kharif: { crop: "Groundnut + Niger Seed",           baseRev: 58000,  sow: "Jun", harvest: "Aug" },
          rabi:   { crop: "Onion + Garlic",                   baseRev: 80000,  sow: "Nov", harvest: "Dec" },
          zaid:   { crop: "Summer Vegetables (Gourd)",        baseRev: 45000,  sow: "Mar", harvest: "May" }
        }
      },
      Red: {
        ZoneA: {
          kharif: { crop: "Ragi + Cowpea",                    baseRev: 38000,  sow: "Jun", harvest: "Oct" },
          rabi:   { crop: "Potato + Tomato",                  baseRev: 85000,  sow: "Nov", harvest: "Feb" },
          zaid:   { crop: "Watermelon + Bhendi",              baseRev: 55000,  sow: "Mar", harvest: "May" }
        },
        ZoneB: {
          kharif: { crop: "Maize + Field Beans",              baseRev: 68000,  sow: "Jun", harvest: "Sep" },
          rabi:   { crop: "Sunflower + Mustard",              baseRev: 42000,  sow: "Nov", harvest: "Jan" },
          zaid:   { crop: "Cluster Beans + Amaranth",         baseRev: 38000,  sow: "Mar", harvest: "Apr" }
        },
        ZoneC: {
          kharif: { crop: "Groundnut + Castor",               baseRev: 55000,  sow: "Jun", harvest: "Aug" },
          rabi:   { crop: "Onion + Garlic",                   baseRev: 72000,  sow: "Nov", harvest: "Dec" },
          zaid:   { crop: "Summer Vegetables (Gourd)",        baseRev: 40000,  sow: "Mar", harvest: "May" }
        }
      }
    },
    // ── SHIVAMOGGA — Malnad / High-Rainfall Zone ─────────────────────────────
    shivamogga: {
      Black: {
        ZoneA: {
          kharif: { crop: "Paddy (Sona Masuri) + Sesamum",   baseRev: 65000,  sow: "Jun", harvest: "Nov" },
          rabi:   { crop: "Potato + Tomato",                  baseRev: 90000,  sow: "Dec", harvest: "Feb" },
          zaid:   { crop: "Banana + Turmeric",                baseRev: 80000,  sow: "Mar", harvest: "May" }
        },
        ZoneB: {
          kharif: { crop: "Maize + Cowpea",                   baseRev: 70000,  sow: "Jun", harvest: "Oct" },
          rabi:   { crop: "Ginger + Turmeric",                baseRev: 110000, sow: "Dec", harvest: "Feb" },
          zaid:   { crop: "Groundnut + Summer Vegetables",    baseRev: 55000,  sow: "Mar", harvest: "Apr" }
        },
        ZoneC: {
          kharif: { crop: "Groundnut + Niger Seed",           baseRev: 58000,  sow: "Jun", harvest: "Sep" },
          rabi:   { crop: "Ragi + Horsegram",                 baseRev: 40000,  sow: "Dec", harvest: "Jan" },
          zaid:   { crop: "Summer Paddy + Vegetables",        baseRev: 60000,  sow: "Mar", harvest: "May" }
        }
      },
      Red: {
        ZoneA: {
          kharif: { crop: "Paddy (Sona Masuri) + Sesamum",   baseRev: 60000,  sow: "Jun", harvest: "Nov" },
          rabi:   { crop: "Arecanut Maint. + Black Pepper",  baseRev: 140000, sow: "Dec", harvest: "Feb" },
          zaid:   { crop: "Banana + Turmeric",               baseRev: 75000,  sow: "Mar", harvest: "May" }
        },
        ZoneB: {
          kharif: { crop: "Maize + Cowpea",                  baseRev: 62000,  sow: "Jun", harvest: "Oct" },
          rabi:   { crop: "Ginger + Turmeric",               baseRev: 105000, sow: "Dec", harvest: "Feb" },
          zaid:   { crop: "Groundnut + Summer Vegetables",   baseRev: 50000,  sow: "Mar", harvest: "Apr" }
        },
        ZoneC: {
          kharif: { crop: "Groundnut + Niger Seed",          baseRev: 52000,  sow: "Jun", harvest: "Sep" },
          rabi:   { crop: "Ragi + Horsegram",                baseRev: 36000,  sow: "Dec", harvest: "Jan" },
          zaid:   { crop: "Summer Paddy + Vegetables",       baseRev: 55000,  sow: "Mar", harvest: "May" }
        }
      }
    },
    // ── KALABURAGI — Hyderabad-Karnataka Zone ────────────────────────────────
    kalaburagi: {
      Black: {
        ZoneA: {
          kharif: { crop: "Tur Dal (Pigeon Pea) + Cotton",   baseRev: 110000, sow: "Jun", harvest: "Oct" },
          rabi:   { crop: "Chickpea + Linseed",              baseRev: 55000,  sow: "Oct", harvest: "Jan" },
          zaid:   { crop: "Sunflower + Sesame",              baseRev: 38000,  sow: "Mar", harvest: "May" }
        },
        ZoneB: {
          kharif: { crop: "Jowar + Green Gram",              baseRev: 60000,  sow: "Jun", harvest: "Sep" },
          rabi:   { crop: "Safflower + Wheat",               baseRev: 45000,  sow: "Oct", harvest: "Dec" },
          zaid:   { crop: "Fodder Sorghum + Cowpea",         baseRev: 28000,  sow: "Mar", harvest: "Apr" }
        },
        ZoneC: {
          kharif: { crop: "Soybean + Sesame",                baseRev: 72000,  sow: "Jun", harvest: "Aug" },
          rabi:   { crop: "Rabi Jowar + Mustard",            baseRev: 40000,  sow: "Oct", harvest: "Nov" },
          zaid:   { crop: "Groundnut + Summer Vegetables",   baseRev: 35000,  sow: "Mar", harvest: "May" }
        }
      },
      Red: {
        ZoneA: {
          kharif: { crop: "Tur Dal (Pigeon Pea) + Bajra",   baseRev: 55000,  sow: "Jun", harvest: "Oct" },
          rabi:   { crop: "Chickpea + Coriander",           baseRev: 42000,  sow: "Oct", harvest: "Jan" },
          zaid:   { crop: "Sunflower + Sesame",             baseRev: 32000,  sow: "Mar", harvest: "May" }
        },
        ZoneB: {
          kharif: { crop: "Jowar + Horsegram",              baseRev: 45000,  sow: "Jun", harvest: "Sep" },
          rabi:   { crop: "Safflower + Linseed",            baseRev: 32000,  sow: "Oct", harvest: "Dec" },
          zaid:   { crop: "Fodder Sorghum + Cowpea",        baseRev: 22000,  sow: "Mar", harvest: "Apr" }
        },
        ZoneC: {
          kharif: { crop: "Groundnut + Sesame",             baseRev: 50000,  sow: "Jun", harvest: "Aug" },
          rabi:   { crop: "Rabi Jowar + Mustard",           baseRev: 32000,  sow: "Oct", harvest: "Nov" },
          zaid:   { crop: "Summer Vegetables + Cover Crop", baseRev: 28000,  sow: "Mar", harvest: "May" }
        }
      }
    }
  };

  const regionCatalog = REGIONAL_CATALOGS[region] || REGIONAL_CATALOGS["belagavi"];
  const soilCatalog = regionCatalog[soil];

  const zones: Zone[] = [];
  const recommendations: CropRecommendation[] = [];
  const timeline: TimelineItem[] = [];

  let totalGrossRevenue = 0;
  let totalExpenses = 0;

  // Hoist calendar helpers so the timeline harvest filter inside the zones loop can use them
  const startMonthIdx = new Date().getMonth();
  const shortMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const zoneLetters = ["A", "B", "C", "D", "E", "F"];
  const colorsCycle = ["primary", "success", "accent"] as const;

  // Generate physical zones with nested seasons
  for (let idx = 0; idx < numZones; idx++) {
    const letter = zoneLetters[idx];
    const zoneId = `Zone${["A", "B", "C"][idx % 3]}` as "ZoneA" | "ZoneB" | "ZoneC";
    
    // Deep clone the base configuration
    let cropConfig = JSON.parse(JSON.stringify(soilCatalog[zoneId]));

    // If it's a repeated zone (D, E, F), vary the crops and base revenue slightly
    if (idx >= 3) {
      const companionReplacements: Record<string, string> = {
        "Soyabean (Intercrop)": "Cowpea (Intercrop)",
        "Soyabean": "Cowpea",
        "Wheat": "Chickpea",
        "Cover Crop": "Sunnhemp",
        "Pigeon Pea": "Horsegram",
        "Linseed": "Mustard",
        "Cowpea": "Organic Mulch",
        "Groundnut": "Sesame",
        "Mustard": "Coriander",
        "Sesame": "Niger Seed",
        "Tomato": "Chilli",
        "Amaranth": "Spinach",
        "Garlic": "Coriander"
      };

      (["kharif", "rabi", "zaid"] as const).forEach(seasonKey => {
        const season = cropConfig[seasonKey];
        if (season) {
          // Adjust base revenue by a stable offset (-8% to +8%)
          const variationFactor = 0.92 + ((idx * 7 + season.baseRev) % 15) / 100;
          season.baseRev = Math.round(season.baseRev * variationFactor);

          // Find and replace companion crops
          Object.keys(companionReplacements).forEach(original => {
            if (season.crop.includes(original)) {
              season.crop = season.crop.replace(original, companionReplacements[original]);
            }
          });
        }
      });
    }

    const seasonsInfo: any = {};
    const zoneEvents: any[] = [];

    (["kharif", "rabi", "zaid"] as const).forEach(seasonKey => {
      const cropInfo = cropConfig[seasonKey];
      const grossRev = parseFloat((cropInfo.baseRev * zoneArea * waterFactor).toFixed(2));
      let exp = parseFloat((grossRev * expenseRatio).toFixed(2));
      let profit = parseFloat((grossRev - exp).toFixed(2));

      // 15% safety profit clamp
      const minProfit = parseFloat((grossRev * 0.15).toFixed(2));
      profit = Math.max(profit, minProfit);
      exp = parseFloat((grossRev - profit).toFixed(2));

      totalGrossRevenue += grossRev;
      totalExpenses += exp;

      // Extract primary and companion crop names
      let primary = cropInfo.crop;
      let companion = "Companion";
      if (cropInfo.crop.includes(" + ")) {
        const parts = cropInfo.crop.split(" + ");
        primary = parts[0];
        companion = parts[1];
      } else if (cropInfo.crop.includes(" (")) {
        const parts = cropInfo.crop.split(" (");
        primary = parts[0];
        companion = parts[1].replace(")", "");
      } else {
        if (cropInfo.crop === "Rabi Ratoon") companion = "Sugarcane Stubble";
        else if (cropInfo.crop === "Green Gram Cover") companion = "Organic Mulch";
        else if (cropInfo.crop === "Chickpea (Chana)") {
          primary = "Chickpea";
          companion = "Chana";
        }
        else if (cropInfo.crop === "Fodder Maize") companion = "Fodder Cowpea";
        else if (cropInfo.crop === "Wheat") companion = "Mustard Border";
        else if (cropInfo.crop === "Sunflower") companion = "Coriander Border";
        else if (cropInfo.crop === "Horse Gram") companion = "Cover Crop";
        else if (cropInfo.crop === "Cowpea") companion = "Organic Mulch";
        else if (cropInfo.crop === "Safflower") companion = "Organic Cover";
        else if (cropInfo.crop === "Vegetables (Mint/Coriander)") {
          primary = "Vegetables";
          companion = "Mint/Coriander";
        }
        else if (cropInfo.crop === "Finger Millet (Ragi)") {
          primary = "Finger Millet";
          companion = "Ragi";
        }
        else if (cropInfo.crop === "Summer Cover Crops") companion = "Sunnhemp";
      }

      seasonsInfo[seasonKey] = {
        cropPair: [primary, companion],
        plantingMonth: cropInfo.sow,
        harvestMonths: [cropInfo.harvest],
        expectedIncome: profit,
        expectedRevenue: grossRev,
        expectedExpense: exp
      };

      // Timeline items — only show seasons that can actually be planted & harvested
      // from today's empty-land starting point (harvestIdx must be STRICTLY after sowIdx)
      const sowIdx     = (shortMonths.indexOf(cropInfo.sow)     - startMonthIdx + 12) % 12;
      const harvestIdx = (shortMonths.indexOf(cropInfo.harvest) - startMonthIdx + 12) % 12;

      if (harvestIdx > sowIdx) {
        zoneEvents.push({
          month: cropInfo.sow,
          monthIdx: sowIdx,
          type: "sow",
          zone: `Zone ${letter}`,
          action: `Sow ${primary} + ${companion}`,
          detail: `Prepare soil beds, apply local organic manure and sow seed mixture.`
        });

        zoneEvents.push({
          month: cropInfo.harvest,
          monthIdx: harvestIdx,
          type: "harvest",
          zone: `Zone ${letter}`,
          action: `Harvest crops`,
          detail: `Harvest at optimum maturity and process for market sale.`
        });
      }
    });

    // Sort this zone's events chronologically by monthIdx
    zoneEvents.sort((a, b) => a.monthIdx - b.monthIdx);

    // Scan for gaps and push to timeline
    for (let i = 0; i < zoneEvents.length; i++) {
      const currentEvent = zoneEvents[i];
      timeline.push({
        month: currentEvent.month,
        zone: currentEvent.zone,
        action: currentEvent.action,
        detail: currentEvent.detail
      });

      const nextEvent = zoneEvents[(i + 1) % zoneEvents.length];
      if (currentEvent.type === "harvest" && nextEvent.type === "sow") {
        const gapMonths = (nextEvent.monthIdx - currentEvent.monthIdx + 12) % 12;
        if (gapMonths >= 2) {
          const coverSowIdx = (currentEvent.monthIdx + 1) % 12;
          const coverIncIdx = (nextEvent.monthIdx - 1 + 12) % 12;
          let detailText = `Broadcast Sunnhemp/Dhaincha seeds post-harvest to prevent weed growth, protect soil organic carbon, and fix nitrogen.`;

          if (coverIncIdx === coverSowIdx) {
            detailText += ` Plow back into soil before the next crop cycle.`;
          }

          timeline.push({
            month: shortMonths[(startMonthIdx + coverSowIdx) % 12],
            zone: `Zone ${letter}`,
            action: `Sow Green Manure (Sunnhemp/Dhaincha)`,
            detail: detailText
          });

          if (coverIncIdx !== coverSowIdx) {
            timeline.push({
              month: shortMonths[(startMonthIdx + coverIncIdx) % 12],
              zone: `Zone ${letter}`,
              action: `Incorporate Green Manure into soil`,
              detail: `Plow the green cover crop back into the soil to decompose, enriching it with organic matter and nitrogen.`
            });
          }
        }
      }
    }

    zones.push({
      id: letter,
      name: `Zone ${letter}`,
      area: zoneArea,
      color: colorsCycle[idx % colorsCycle.length],
      seasons: seasonsInfo
    });
  }

  function zName(l: string) {
    return `Zone ${l}`;
  }

  // Unique recommendations
  const seenCrops = new Set<string>();
  zones.forEach(z => {
    (["kharif", "rabi", "zaid"] as const).forEach(seasonKey => {
      const sz = z.seasons[seasonKey];
      const key = sz.cropPair.join("_");
      if (!seenCrops.has(key)) {
        seenCrops.add(key);

        const cropYields: Record<string, string> = {
          "sugarcane_soyabean": "Sugarcane 35-40 tonnes, Soyabean 8-10 qtl",
          "jowar_pigeon_pea": "Jowar 8-10 qtl, Tur 3-4 qtl",
          "cotton_groundnut": "Cotton 6-8 qtl, Groundnut 6-8 qtl",
          "bajra_pigeon_pea": "Bajra 6-8 qtl, Tur 2-3 qtl",
          "maize_beans": "Maize 18-20 qtl, Beans 15-18 qtl",
          "groundnut_sesame": "Groundnut 8-10 qtl, Sesame 2-3 qtl",
          "ratoon_sugarcane": "Ratoon Sugarcane 30 tonnes",
          "chickpea": "Chickpea 5-6 qtl",
          "wheat": "Wheat 12-15 qtl",
          "horse_gram": "Horsegram 4-5 qtl",
          "safflower": "Safflower 4-5 qtl",
          "finger_millet": "Ragi 10-12 qtl",
          "green_gram": "Green Gram 3-4 qtl",
          "fodder_maize": "Fodder 150-180 qtl",
          "sunflower": "Sunflower 5-6 qtl",
          "cowpea": "Cowpea 3-4 qtl",
          "vegetables": "Mint/Coriander 40-50 qtl",
          "summer_cover": "Green biomass 8-10 tonnes"
        };

        const cropPrices: Record<string, string> = {
          "sugarcane_soyabean": "₹3,150/tonne Sugarcane · ₹4,200/qtl Soyabean",
          "jowar_pigeon_pea": "₹2,800/qtl Jowar · ₹6,500/qtl Tur",
          "cotton_groundnut": "₹6,800/qtl Cotton · ₹5,800/qtl Groundnut",
          "bajra_pigeon_pea": "₹2,350/qtl Bajra · ₹6,500/qtl Tur",
          "maize_beans": "₹2,200/qtl Maize · ₹4,000/qtl Beans",
          "groundnut_sesame": "₹5,800/qtl Groundnut · ₹7,500/qtl Sesame",
          "ratoon_sugarcane": "₹3,150/tonne Sugarcane",
          "chickpea": "₹5,300/qtl Chickpea",
          "wheat": "₹2,400/qtl Wheat",
          "horse_gram": "₹4,200/qtl Horsegram",
          "safflower": "₹5,440/qtl Safflower",
          "finger_millet": "₹3,846/qtl Ragi",
          "green_gram": "₹7,200/qtl Green Gram",
          "fodder_maize": "₹250/qtl Fodder",
          "sunflower": "₹5,650/qtl Sunflower",
          "cowpea": "₹6,000/qtl Cowpea",
          "vegetables": "₹1,500/qtl Vegetables",
          "summer_cover": "Organic nitrogen credits"
        };

        const keyStr = sz.cropPair[0].toLowerCase().replace(/[^a-z]/g, "") + "_" + sz.cropPair[1].toLowerCase().replace(/[^a-z]/g, "");
        const matchedKey = Object.keys(cropYields).find(k => keyStr.includes(k) || k.includes(keyStr)) || "jowar_pigeon_pea";

        recommendations.push({
          crop: sz.cropPair[0],
          partner: sz.cropPair[1],
          why: "Complementary crop pairing optimized for Belagavi Northern Transitional Zone.",
          traditionalWisdom: `Traditional heritage practice native to northern Karnataka. Alternating rows of ${sz.cropPair[0]} and ${sz.cropPair[1]} improves nitrogen levels and soil organic carbon.`,
          yieldPerAcre: cropYields[matchedKey] || "Varies by zone.",
          marketPrice: cropPrices[matchedKey] || "Varies by zone."
        });
      }
    });
  });

  // Rotate calendar months based on current registration month (startMonthIdx & shortMonths already declared above)
  const calendarFullMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  
  const orderedShortMonths: string[] = [];
  const orderedFullMonths: string[] = [];
  for (let i = 0; i < 12; i++) {
    const idx = (startMonthIdx + i) % 12;
    orderedShortMonths.push(shortMonths[idx]);
    orderedFullMonths.push(calendarFullMonths[idx]);
  }

  // Build zoneBreakdown template dynamically
  const zoneBreakdownTemplate: Record<string, { revenue: number; expenses: number; netProfit: number }> = {};
  zones.forEach(z => {
    zoneBreakdownTemplate[`Zone ${z.id}`] = { revenue: 0, expenses: 0, netProfit: 0 };
  });

  // Initialize the monthly cashflow matrix with zoneBreakdowns
  const monthlyCashflow = orderedShortMonths.map(m => ({
    month: m,
    revenue: 0,
    expenses: 0,
    netProfit: 0,
    traditional: 0,
    krishiflow: 0,
    zoneBreakdown: JSON.parse(JSON.stringify(zoneBreakdownTemplate))
  }));

  // Distribute financial cycles smoothly into calendar months
  zones.forEach(zone => {
    (["kharif", "rabi", "zaid"] as const).forEach(seasonKey => {
      const seasonData = zone.seasons[seasonKey];
      const zName = `Zone ${zone.id}`; // e.g. "Zone A"
      
      // Sowing month: realize 30% of total expenses as sowing layout capital
      const sowMonth = seasonData.plantingMonth;
      const sowObj = monthlyCashflow.find(m => m.month === sowMonth);
      if (sowObj) {
        const expVal = parseFloat(((seasonData.expectedExpense || 0) * 0.30).toFixed(2));
        sowObj.expenses += expVal;
        if (sowObj.zoneBreakdown[zName]) {
          sowObj.zoneBreakdown[zName].expenses += expVal;
        }
      }

      // Mid-season maintenance: realize 10% of expenses in the following month
      const currentIdx = shortMonths.indexOf(sowMonth);
      const midMonth = shortMonths[(currentIdx + 1) % 12];
      const midObj = monthlyCashflow.find(m => m.month === midMonth);
      if (midObj) {
        const expVal = parseFloat(((seasonData.expectedExpense || 0) * 0.10).toFixed(2));
        midObj.expenses += expVal;
        if (midObj.zoneBreakdown[zName]) {
          midObj.zoneBreakdown[zName].expenses += expVal;
        }
      }

      // Harvest month: realize remaining 60% of expenses (labor/harvesting) and 100% of revenue
      const harvestMonth = seasonData.harvestMonths[0];
      const harvObj = monthlyCashflow.find(m => m.month === harvestMonth);
      if (harvObj) {
        const expVal = parseFloat(((seasonData.expectedExpense || 0) * 0.60).toFixed(2));
        harvObj.revenue += (seasonData.expectedRevenue || 0);
        harvObj.expenses += expVal;
        if (harvObj.zoneBreakdown[zName]) {
          harvObj.zoneBreakdown[zName].revenue += (seasonData.expectedRevenue || 0);
          harvObj.zoneBreakdown[zName].expenses += expVal;
        }
      }
    });
  });

  const traditionalAnnual = zones.reduce((s, z) => {
    const annualZ = (z.seasons.kharif.expectedIncome || 0) + 
                    (z.seasons.rabi.expectedIncome || 0) + 
                    (z.seasons.zaid.expectedIncome || 0);
    return s + annualZ;
  }, 0) * 0.7;

  // Finalize monthly net profits and round values cleanly
  const monthly: MonthlyIncome[] = monthlyCashflow.map(m => {
    m.revenue = parseFloat(m.revenue.toFixed(2));
    m.expenses = parseFloat(m.expenses.toFixed(2));
    m.netProfit = parseFloat((m.revenue - m.expenses).toFixed(2));
    
    Object.keys(m.zoneBreakdown).forEach(zoneKey => {
      const zb = m.zoneBreakdown[zoneKey];
      zb.revenue = parseFloat(zb.revenue.toFixed(2));
      zb.expenses = parseFloat(zb.expenses.toFixed(2));
      zb.netProfit = parseFloat((zb.revenue - zb.expenses).toFixed(2));
    });

    let traditional = 0;
    if (m.month === "Nov") {
      traditional = Math.round(traditionalAnnual * 0.85);
    } else if (m.month === "Dec") {
      traditional = Math.round(traditionalAnnual * 0.15);
    }

    return {
      month: m.month,
      traditional,
      krishiflow: Math.round(m.netProfit),
      revenue: m.revenue,
      expenses: m.expenses,
      zoneBreakdown: m.zoneBreakdown
    };
  });


  // Sort timeline chronologically starting from registration month
  timeline.sort((a, b) => {
    const aIdx = (shortMonths.indexOf(a.month) - startMonthIdx + 12) % 12;
    const bIdx = (shortMonths.indexOf(b.month) - startMonthIdx + 12) % 12;
    return aIdx - bIdx;
  });

  const annualRevenue = Math.round(totalGrossRevenue);
  const activeMonths = monthly.filter(m => m.krishiflow > 0).length;
  const netProfit = Math.round(totalGrossRevenue - totalExpenses);

  // Scores
  let bioScore = 85;
  if (soil === "Black") bioScore += 6;
  if (water === "High") bioScore += 4;
  if (water === "Low") bioScore -= 5;
  bioScore = Math.max(75, Math.min(98, bioScore));

  let sustScore = 88;
  if (soil === "Black") sustScore += 3;
  if (water === "Low") sustScore -= 5;
  sustScore = Math.max(80, Math.min(95, sustScore));

  let riskScore = 93;
  if (soil === "Black") riskScore += 3;
  if (water === "High") riskScore += 2;
  riskScore = Math.max(90, riskScore);

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    input,
    zones,
    monthly,
    totals: { annualRevenue, netProfit, activeMonths },
    scores: {
      incomeStability: riskScore,
      sustainability: sustScore,
      biodiversity: bioScore,
      riskMitigation: riskScore
    },
    recommendations,
    weather: getMockWeather(),
    advisory: "Favorable conditions for agricultural operations. Staggered cultivation preserves moisture and stabilizes yields.",
    timeline
  };
}

function buildTimeline(zones: Zone[]) {
  const items: { month: string; zone: string; action: string; detail: string }[] = [];
  zones.forEach((z) => {
    items.push({ month: z.plantingMonth, zone: z.name, action: `Sow ${z.cropPair.join(" + ")}`, detail: `Prepare 4:2 rows, apply 2 tonnes farmyard manure per acre.` });
    z.harvestMonths.forEach((hm, i) => {
      items.push({ month: hm, zone: z.name, action: `${i===0 ? "First" : "Final"} harvest — ${z.cropPair[0]}`, detail: `Hand-pick at 80% maturity. Sun-dry 3 days before milling.` });
    });
  });
  // sort by month order
  return items.sort((a,b) => MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month));
}

export function getMockWeather() {
  const conds = [
    { c: "Sunny", icon: "☀️" },
    { c: "Partly cloudy", icon: "⛅" },
    { c: "Light rain", icon: "🌦️" },
    { c: "Cloudy", icon: "☁️" },
    { c: "Sunny", icon: "☀️" },
  ];
  const days = ["Today","Tomorrow","Wed","Thu","Fri"];
  return days.map((d, i) => ({ day: d, temp: 28 + Math.round(Math.random()*4), rain: i===2 ? 12 : Math.round(Math.random()*4), icon: conds[i].icon, condition: conds[i].c }));
}

export const PEST_SYMPTOMS = [
  "Yellow leaves","Holes in leaves","White powder on leaves","Wilting plants",
  "Curled leaves","Black spots","Small flying insects","Stunted growth",
];

export function diagnosePest(symptoms: string[]) {
  if (symptoms.length === 0) return null;
  // simple mock
  const has = (s: string) => symptoms.some(x => x.toLowerCase().includes(s));
  if (has("white powder")) {
    return {
      name: "Powdery Mildew",
      confidence: 86,
      traditional: "Spray 10% cow-urine + neem leaf extract weekly. Sprinkle wood ash on affected leaves at dawn.",
      chemical: "Sulfur 80% WP @ 2g/L water, or Hexaconazole 5% EC @ 1ml/L. Re-apply after 10 days.",
    };
  }
  if (has("holes") || has("small flying")) {
    return {
      name: "Leaf-eating caterpillar / Whitefly",
      confidence: 78,
      traditional: "Set up yellow sticky traps (10/acre). Spray 5% neem seed kernel extract + soap solution at sunset.",
      chemical: "Imidacloprid 17.8% SL @ 0.3ml/L or Spinosad 45% SC @ 0.3ml/L. Rotate to prevent resistance.",
    };
  }
  if (has("yellow") || has("wilting")) {
    return {
      name: "Nitrogen deficiency / Root rot risk",
      confidence: 72,
      traditional: "Apply jeevamrutha (cow dung + jaggery ferment) 200L/acre. Improve drainage with raised bunds.",
      chemical: "Urea top-dress 25kg/acre + Trichoderma viride 2kg/acre soil drench.",
    };
  }
  return {
    name: "General stress symptoms",
    confidence: 60,
    traditional: "Foliar spray panchagavya (3%) every 10 days. Mulch with sugarcane trash.",
    chemical: "Apply balanced 19-19-19 NPK foliar @ 5g/L water. Monitor for 7 days.",
  };
}