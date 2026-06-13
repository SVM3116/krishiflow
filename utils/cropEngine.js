/**
 * KrishiFlow AI - Crop Optimization and Cashflow Planning Engine
 * Multi-district Karnataka support: Belagavi, Bengaluru, Shivamogga, Kalaburagi
 *
 * Each region has agronomically accurate crop combinations, sow/harvest timings,
 * and revenue benchmarks per acre based on Karnataka APMC and ICAR data.
 */

/**
 * Calculates the optimized 365-day farming layout and cashflow matrix.
 *
 * @param {number} landArea          - Total farm land area in acres
 * @param {string} soilType          - "Black" or "Red"
 * @param {string} waterAvailability - "High" or "Low"
 * @param {string} region            - "belagavi" | "bengaluru" | "shivamogga" | "kalaburagi"
 * @returns {object} Completely structured farming plan JSON response
 */
function calculateCropPlan(landArea, soilType, waterAvailability, region) {
  // 1. Sanitize inputs
  const area = Math.max(0.5, parseFloat(landArea) || 1.0);
  const normalizedSoil = (soilType && soilType.toLowerCase().includes("black")) ? "Black" : "Red";
  const normalizedWater = (waterAvailability && waterAvailability.toLowerCase().includes("low")) ? "Low" : "High";
  const normalizedRegion = (region || "belagavi").toLowerCase().trim();

  // Helper to determine number of zones based on area
  const determineNumZones = (a) => {
    if (a <= 1.0) return 3;
    if (a < 2.0) return 4;
    if (a < 5.0) return 5;
    return 6;
  };
  const numZones = determineNumZones(area);
  const zoneArea = parseFloat((area / numZones).toFixed(2));

  // Water yield modifier
  const waterFactor = normalizedWater === "High" ? 1.0 : 0.70;

  // Expense ratio 40-45% of gross revenue
  let expenseRatio = 0.40;
  if (normalizedSoil === "Red") expenseRatio += 0.02;
  if (normalizedWater === "Low") expenseRatio += 0.03;
  expenseRatio = Math.max(0.40, Math.min(0.45, expenseRatio));

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. REGIONAL CROP CATALOGS
  //    All revenues are base per-acre values (before waterFactor scaling).
  //    Sow and harvest months are full names for the 12-month cashflow matrix.
  // ─────────────────────────────────────────────────────────────────────────────

  const REGIONAL_CATALOGS = {

    // ── BELAGAVI — Northern Transitional Zone ────────────────────────────────
    // Dominant soils: Deep Black cotton (Vertisols), Red loamy
    // Rainfall: 700–900 mm. Crops: Sugarcane, Jowar, Cotton, Groundnut, Bajra
    belagavi: {
      Black: {
        ZoneA: {
          kharif: { crop: "Sugarcane + Soyabean (Intercrop)", baseRevenuePerAcre: 140000, sow: "June",     harvest: "October"  },
          rabi:   { crop: "Rabi Ratoon + Wheat",              baseRevenuePerAcre: 90000,  sow: "November", harvest: "February" },
          zaid:   { crop: "Green Gram + Cover Crop",          baseRevenuePerAcre: 30000,  sow: "March",    harvest: "May"      }
        },
        ZoneB: {
          kharif: { crop: "Jowar + Pigeon Pea",               baseRevenuePerAcre: 65000,  sow: "June",     harvest: "September" },
          rabi:   { crop: "Chickpea + Linseed",               baseRevenuePerAcre: 40000,  sow: "November", harvest: "January"   },
          zaid:   { crop: "Fodder Maize + Cowpea",            baseRevenuePerAcre: 25000,  sow: "March",    harvest: "April"     }
        },
        ZoneC: {
          kharif: { crop: "Cotton + Groundnut",               baseRevenuePerAcre: 95000,  sow: "June",     harvest: "August"   },
          rabi:   { crop: "Wheat + Mustard",                  baseRevenuePerAcre: 45000,  sow: "November", harvest: "December" },
          zaid:   { crop: "Sunflower + Sesame",               baseRevenuePerAcre: 35000,  sow: "March",    harvest: "May"      }
        }
      },
      Red: {
        ZoneA: {
          kharif: { crop: "Bajra + Pigeon Pea",               baseRevenuePerAcre: 50000,  sow: "June",     harvest: "October"  },
          rabi:   { crop: "Horse Gram + Cover Crop",          baseRevenuePerAcre: 28000,  sow: "November", harvest: "February" },
          zaid:   { crop: "Cowpea + Sunnhemp",                baseRevenuePerAcre: 22000,  sow: "March",    harvest: "May"      }
        },
        ZoneB: {
          kharif: { crop: "Maize + Field Beans",              baseRevenuePerAcre: 70000,  sow: "June",     harvest: "September" },
          rabi:   { crop: "Safflower + Organic Cover",        baseRevenuePerAcre: 32000,  sow: "November", harvest: "January"   },
          zaid:   { crop: "Vegetables (Coriander/Mint)",      baseRevenuePerAcre: 45000,  sow: "March",    harvest: "April"     }
        },
        ZoneC: {
          kharif: { crop: "Groundnut + Sesame",               baseRevenuePerAcre: 60000,  sow: "June",     harvest: "August"   },
          rabi:   { crop: "Finger Millet (Ragi)",             baseRevenuePerAcre: 38000,  sow: "November", harvest: "December" },
          zaid:   { crop: "Summer Cover + Dhaincha",          baseRevenuePerAcre: 20000,  sow: "March",    harvest: "May"      }
        }
      }
    },

    // ── BENGALURU — Southern Dry Zone ───────────────────────────────────────
    // Dominant soils: Red loamy (Alfisols), clayey pockets
    // Rainfall: 800–900 mm. Crops: Ragi, Tomato, Potato, Groundnut, Maize, Mulberry
    bengaluru: {
      Black: {
        ZoneA: {
          kharif: { crop: "Maize + Field Beans",              baseRevenuePerAcre: 75000,  sow: "June",     harvest: "September" },
          rabi:   { crop: "Potato + Tomato",                  baseRevenuePerAcre: 95000,  sow: "November", harvest: "February"  },
          zaid:   { crop: "Watermelon + Bhendi",              baseRevenuePerAcre: 60000,  sow: "March",    harvest: "May"       }
        },
        ZoneB: {
          kharif: { crop: "Soybean + Cowpea",                 baseRevenuePerAcre: 65000,  sow: "June",     harvest: "October"  },
          rabi:   { crop: "Sunflower + Mustard",              baseRevenuePerAcre: 48000,  sow: "November", harvest: "January"  },
          zaid:   { crop: "Cluster Beans + Amaranth",         baseRevenuePerAcre: 40000,  sow: "March",    harvest: "April"    }
        },
        ZoneC: {
          kharif: { crop: "Groundnut + Niger Seed",           baseRevenuePerAcre: 58000,  sow: "June",     harvest: "August"   },
          rabi:   { crop: "Onion + Garlic",                   baseRevenuePerAcre: 80000,  sow: "November", harvest: "December" },
          zaid:   { crop: "Summer Vegetables (Gourd)",        baseRevenuePerAcre: 45000,  sow: "March",    harvest: "May"      }
        }
      },
      Red: {
        ZoneA: {
          kharif: { crop: "Ragi + Cowpea",                    baseRevenuePerAcre: 38000,  sow: "June",     harvest: "October"  },
          rabi:   { crop: "Potato + Tomato",                  baseRevenuePerAcre: 85000,  sow: "November", harvest: "February" },
          zaid:   { crop: "Watermelon + Bhendi",              baseRevenuePerAcre: 55000,  sow: "March",    harvest: "May"      }
        },
        ZoneB: {
          kharif: { crop: "Maize + Field Beans",              baseRevenuePerAcre: 68000,  sow: "June",     harvest: "September" },
          rabi:   { crop: "Sunflower + Mustard",              baseRevenuePerAcre: 42000,  sow: "November", harvest: "January"   },
          zaid:   { crop: "Cluster Beans + Amaranth",         baseRevenuePerAcre: 38000,  sow: "March",    harvest: "April"     }
        },
        ZoneC: {
          kharif: { crop: "Groundnut + Castor",               baseRevenuePerAcre: 55000,  sow: "June",     harvest: "August"   },
          rabi:   { crop: "Onion + Garlic",                   baseRevenuePerAcre: 72000,  sow: "November", harvest: "December" },
          zaid:   { crop: "Summer Vegetables (Gourd)",        baseRevenuePerAcre: 40000,  sow: "March",    harvest: "May"      }
        }
      }
    },

    // ── SHIVAMOGGA — Malnad / High-Rainfall Zone ─────────────────────────────
    // Dominant soils: Laterite (treated as Red), Red loamy forest margins
    // Rainfall: 1,500–2,000 mm. Crops: Paddy, Arecanut, Banana, Ginger, Pepper, Maize
    shivamogga: {
      Black: {
        ZoneA: {
          kharif: { crop: "Paddy (Sona Masuri) + Sesamum",   baseRevenuePerAcre: 65000,  sow: "June",     harvest: "November" },
          rabi:   { crop: "Potato + Tomato",                  baseRevenuePerAcre: 90000,  sow: "December", harvest: "February" },
          zaid:   { crop: "Banana + Turmeric",                baseRevenuePerAcre: 80000,  sow: "March",    harvest: "May"      }
        },
        ZoneB: {
          kharif: { crop: "Maize + Cowpea",                   baseRevenuePerAcre: 70000,  sow: "June",     harvest: "October"  },
          rabi:   { crop: "Ginger + Turmeric",                baseRevenuePerAcre: 110000, sow: "December", harvest: "February" },
          zaid:   { crop: "Groundnut + Summer Vegetables",    baseRevenuePerAcre: 55000,  sow: "March",    harvest: "April"    }
        },
        ZoneC: {
          kharif: { crop: "Groundnut + Niger Seed",           baseRevenuePerAcre: 58000,  sow: "June",     harvest: "September" },
          rabi:   { crop: "Ragi + Horsegram",                 baseRevenuePerAcre: 40000,  sow: "December", harvest: "January"   },
          zaid:   { crop: "Summer Paddy + Vegetables",        baseRevenuePerAcre: 60000,  sow: "March",    harvest: "May"       }
        }
      },
      Red: {
        ZoneA: {
          kharif: { crop: "Paddy (Sona Masuri) + Sesamum",   baseRevenuePerAcre: 60000,  sow: "June",     harvest: "November" },
          rabi:   { crop: "Arecanut Maint. + Black Pepper",  baseRevenuePerAcre: 140000, sow: "December", harvest: "February" },
          zaid:   { crop: "Banana + Turmeric",               baseRevenuePerAcre: 75000,  sow: "March",    harvest: "May"      }
        },
        ZoneB: {
          kharif: { crop: "Maize + Cowpea",                  baseRevenuePerAcre: 62000,  sow: "June",     harvest: "October"  },
          rabi:   { crop: "Ginger + Turmeric",               baseRevenuePerAcre: 105000, sow: "December", harvest: "February" },
          zaid:   { crop: "Groundnut + Summer Vegetables",   baseRevenuePerAcre: 50000,  sow: "March",    harvest: "April"    }
        },
        ZoneC: {
          kharif: { crop: "Groundnut + Niger Seed",          baseRevenuePerAcre: 52000,  sow: "June",     harvest: "September" },
          rabi:   { crop: "Ragi + Horsegram",                baseRevenuePerAcre: 36000,  sow: "December", harvest: "January"   },
          zaid:   { crop: "Summer Paddy + Vegetables",       baseRevenuePerAcre: 55000,  sow: "March",    harvest: "May"       }
        }
      }
    },

    // ── KALABURAGI — Hyderabad-Karnataka Zone ────────────────────────────────
    // Dominant soils: Deep Black cotton (Vertisols), Mixed black
    // Rainfall: 600–750 mm (low). Crops: Tur Dal, Cotton, Jowar, Chickpea, Soybean, Sunflower
    kalaburagi: {
      Black: {
        ZoneA: {
          kharif: { crop: "Tur Dal (Pigeon Pea) + Cotton",   baseRevenuePerAcre: 110000, sow: "June",     harvest: "October"  },
          rabi:   { crop: "Chickpea + Linseed",              baseRevenuePerAcre: 55000,  sow: "October",  harvest: "January"  },
          zaid:   { crop: "Sunflower + Sesame",              baseRevenuePerAcre: 38000,  sow: "March",    harvest: "May"      }
        },
        ZoneB: {
          kharif: { crop: "Jowar + Green Gram",              baseRevenuePerAcre: 60000,  sow: "June",     harvest: "September" },
          rabi:   { crop: "Safflower + Wheat",               baseRevenuePerAcre: 45000,  sow: "October",  harvest: "December"  },
          zaid:   { crop: "Fodder Sorghum + Cowpea",         baseRevenuePerAcre: 28000,  sow: "March",    harvest: "April"     }
        },
        ZoneC: {
          kharif: { crop: "Soybean + Sesame",                baseRevenuePerAcre: 72000,  sow: "June",     harvest: "August"   },
          rabi:   { crop: "Rabi Jowar + Mustard",            baseRevenuePerAcre: 40000,  sow: "October",  harvest: "November" },
          zaid:   { crop: "Groundnut + Summer Vegetables",   baseRevenuePerAcre: 35000,  sow: "March",    harvest: "May"      }
        }
      },
      Red: {
        ZoneA: {
          kharif: { crop: "Tur Dal (Pigeon Pea) + Bajra",   baseRevenuePerAcre: 55000,  sow: "June",     harvest: "October"  },
          rabi:   { crop: "Chickpea + Coriander",           baseRevenuePerAcre: 42000,  sow: "October",  harvest: "January"  },
          zaid:   { crop: "Sunflower + Sesame",             baseRevenuePerAcre: 32000,  sow: "March",    harvest: "May"      }
        },
        ZoneB: {
          kharif: { crop: "Jowar + Horsegram",              baseRevenuePerAcre: 45000,  sow: "June",     harvest: "September" },
          rabi:   { crop: "Safflower + Linseed",            baseRevenuePerAcre: 32000,  sow: "October",  harvest: "December"  },
          zaid:   { crop: "Fodder Sorghum + Cowpea",        baseRevenuePerAcre: 22000,  sow: "March",    harvest: "April"     }
        },
        ZoneC: {
          kharif: { crop: "Groundnut + Sesame",             baseRevenuePerAcre: 50000,  sow: "June",     harvest: "August"   },
          rabi:   { crop: "Rabi Jowar + Mustard",           baseRevenuePerAcre: 32000,  sow: "October",  harvest: "November" },
          zaid:   { crop: "Summer Vegetables + Cover Crop", baseRevenuePerAcre: 28000,  sow: "March",    harvest: "May"      }
        }
      }
    }
  };

  // 4. Select the correct regional catalog (fallback: belagavi)
  const regionCatalog = REGIONAL_CATALOGS[normalizedRegion] || REGIONAL_CATALOGS.belagavi;
  const soilCatalog = regionCatalog[normalizedSoil];
  const zonesOutput = [];

  let totalGrossRevenue = 0;
  let totalExpenses = 0;

  // 5. Process zones
  const zoneLetters = ["A", "B", "C", "D", "E", "F"];
  for (let idx = 0; idx < numZones; idx++) {
    const letter = zoneLetters[idx] || "A";
    const zoneId = `Zone${["A", "B", "C"][idx % 3]}`;
    
    // Deep clone the base configuration
    let cropConfig = JSON.parse(JSON.stringify(soilCatalog[zoneId]));
    
    // If it's a repeated zone (D, E, F), vary the crops and base revenue slightly
    if (idx >= 3) {
      const companionReplacements = {
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

      ["kharif", "rabi", "zaid"].forEach(seasonKey => {
        const season = cropConfig[seasonKey];
        if (season) {
          // Adjust base revenue by a stable offset (-8% to +8%)
          const variationFactor = 0.92 + ((idx * 7 + season.baseRevenuePerAcre) % 15) / 100;
          season.baseRevenuePerAcre = Math.round(season.baseRevenuePerAcre * variationFactor);

          // Find and replace companion crops
          Object.keys(companionReplacements).forEach(original => {
            if (season.crop.includes(original)) {
              season.crop = season.crop.replace(original, companionReplacements[original]);
            }
          });
        }
      });
    }

    const zoneSeasons = {};

    ["kharif", "rabi", "zaid"].forEach(seasonKey => {
      const cropInfo = cropConfig[seasonKey];
      const grossRev = parseFloat((cropInfo.baseRevenuePerAcre * zoneArea * waterFactor).toFixed(2));
      let exp = parseFloat((grossRev * expenseRatio).toFixed(2));
      let profit = parseFloat((grossRev - exp).toFixed(2));

      // Floor: net profit can never drop below 15% of gross revenue
      const minProfitMargin = parseFloat((grossRev * 0.15).toFixed(2));
      profit = Math.max(profit, minProfitMargin);
      exp = parseFloat((grossRev - profit).toFixed(2));

      zoneSeasons[seasonKey] = {
        crop:         cropInfo.crop,
        sowMonth:     cropInfo.sow,
        harvestMonth: cropInfo.harvest,
        grossRevenue: parseFloat(grossRev.toFixed(2)),
        expenses:     parseFloat(exp.toFixed(2)),
        netProfit:    parseFloat(profit.toFixed(2))
      };

      totalGrossRevenue += grossRev;
      totalExpenses += exp;
    });

    zonesOutput.push({
      id:        `Zone ${letter}`,
      areaAcres: parseFloat(zoneArea.toFixed(2)),
      seasons:   zoneSeasons
    });
  }

  // 6. Global totals
  totalGrossRevenue = parseFloat(totalGrossRevenue.toFixed(2));
  totalExpenses = parseFloat(totalExpenses.toFixed(2));
  const totalNetProfit = parseFloat((totalGrossRevenue - totalExpenses).toFixed(2));
  const netProfitMarginPercent = totalGrossRevenue > 0
    ? parseFloat(((totalNetProfit / totalGrossRevenue) * 100).toFixed(2))
    : 0;

  // 7. 12-Month Dynamic Cashflow Matrix (rotated from current month)
  const ALL_MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const currentMonthIdx = new Date().getMonth(); // 0=Jan … 11=Dec
  const MONTHS = [];
  for (let i = 0; i < 12; i++) {
    MONTHS.push(ALL_MONTHS[(currentMonthIdx + i) % 12]);
  }

  const monthlyCashflow = MONTHS.map(month => ({
    month,
    revenue: 0,
    expenses: 0,
    netProfit: 0,
    harvests: [],
    zoneBreakdown: zonesOutput.reduce((acc, z) => {
      acc[z.id] = { revenue: 0, expenses: 0, netProfit: 0 };
      return acc;
    }, {})
  }));

  // 8. Distribute financial cycles into months
  // Filter: skip any season whose harvest falls BEFORE its sow in the rotated calendar
  // (land was empty when the plan started — no crops from previous cycles)
  zonesOutput.forEach(zone => {
    ["kharif", "rabi", "zaid"].forEach(seasonKey => {
      const sd = zone.seasons[seasonKey];
      const sowIdx     = MONTHS.indexOf(sd.sowMonth);
      const harvestIdx = MONTHS.indexOf(sd.harvestMonth);

      // If sow month is not in the future window, skip this season's sow/harvest
      const skipHarvest = sowIdx === -1 || (harvestIdx !== -1 && harvestIdx < sowIdx);

      // Sowing month: 30% of expenses
      if (sowIdx !== -1) {
        const expVal = parseFloat((sd.expenses * 0.30).toFixed(2));
        monthlyCashflow[sowIdx].expenses += expVal;
        monthlyCashflow[sowIdx].zoneBreakdown[zone.id].expenses += expVal;
      }

      // Mid-season: 10% of expenses (month after sowing)
      if (sowIdx !== -1) {
        const midIdx = (sowIdx + 1) % 12;
        const expVal = parseFloat((sd.expenses * 0.10).toFixed(2));
        monthlyCashflow[midIdx].expenses += expVal;
        monthlyCashflow[midIdx].zoneBreakdown[zone.id].expenses += expVal;
      }

      // Harvest month: 60% expenses + 100% revenue
      if (!skipHarvest && harvestIdx !== -1) {
        const expVal = parseFloat((sd.expenses * 0.60).toFixed(2));
        monthlyCashflow[harvestIdx].revenue  += sd.grossRevenue;
        monthlyCashflow[harvestIdx].expenses += expVal;
        monthlyCashflow[harvestIdx].harvests.push(`${zone.id} (${sd.crop})`);
        monthlyCashflow[harvestIdx].zoneBreakdown[zone.id].revenue  += sd.grossRevenue;
        monthlyCashflow[harvestIdx].zoneBreakdown[zone.id].expenses += expVal;
      }
    });
  });

  // 9. Finalize monthly net profits
  monthlyCashflow.forEach(m => {
    m.revenue  = parseFloat(m.revenue.toFixed(2));
    m.expenses = parseFloat(m.expenses.toFixed(2));
    m.netProfit = parseFloat((m.revenue - m.expenses).toFixed(2));
    Object.keys(m.zoneBreakdown).forEach(zoneId => {
      const zb = m.zoneBreakdown[zoneId];
      zb.revenue   = parseFloat(zb.revenue.toFixed(2));
      zb.expenses  = parseFloat(zb.expenses.toFixed(2));
      zb.netProfit = parseFloat((zb.revenue - zb.expenses).toFixed(2));
    });
  });

  // 10. Composite agronomic scores
  let bioScore  = 85 + (normalizedSoil === "Black" ? 6 : 0) + (normalizedWater === "High" ? 4 : -5);
  let sustScore = 88 + (normalizedSoil === "Black" ? 3 : 0) + (normalizedWater === "Low"  ? -5 : 0);
  let riskScore = 93 + (normalizedSoil === "Black" ? 3 : 0) + (normalizedWater === "High" ?  2 : 0);
  bioScore  = Math.max(75, Math.min(98, bioScore));
  sustScore = Math.max(80, Math.min(95, sustScore));
  riskScore = Math.max(90, riskScore);

  return {
    input: {
      landArea:          parseFloat(area.toFixed(2)),
      soilType:          normalizedSoil,
      waterAvailability: normalizedWater,
      region:            normalizedRegion
    },
    totals: {
      grossRevenue:         totalGrossRevenue,
      totalExpenses:        totalExpenses,
      netProfit:            totalNetProfit,
      profitMarginPercent:  netProfitMarginPercent
    },
    zones:          zonesOutput,
    monthlyCashflow: monthlyCashflow,
    scores: {
      biodiversity_score:        parseFloat(bioScore.toFixed(2)),
      sustainability_score:       parseFloat(sustScore.toFixed(2)),
      risk_diversification_score: parseFloat(riskScore.toFixed(2))
    }
  };
}

module.exports = { calculateCropPlan };
