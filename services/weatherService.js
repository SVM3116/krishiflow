const axios = require('axios');
require('dotenv').config();

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// District mapping from Karnataka districts to OpenWeatherMap city queries
const DISTRICT_TO_CITY = {
  belagavi: 'Belgaum',
  dharwad: 'Dharwad',
  haveri: 'Haveri',
  gadag: 'Gadag',
  vijayapura: 'Bijapur',
  raichur: 'Raichur',
  bellary: 'Bellary',
  koppal: 'Koppal',
  davangere: 'Davangere',
  shimoga: 'Shimoga',
  hassan: 'Hassan',
  mysore: 'Mysore',
  mandya: 'Mandya',
  tumkur: 'Tumkur',
  kolar: 'Kolar',
  chitradurga: 'Chitradurga',
  hubli: 'Hubli'
};

/**
 * Get OpenWeatherMap city name from Karnataka district
 */
const getCityName = (district) => {
  if (!district) return 'Belgaum';
  const cleanDistrict = district.toLowerCase().trim();
  return DISTRICT_TO_CITY[cleanDistrict] || district;
};

/**
 * Compile the farming advisory text based on weather parameters
 */
const generateAdvisory = (currentTemp, currentHumidity, forecastList) => {
  // 1. Check for rain in the next 3 days
  // OpenWeatherMap forecast lists 3-hourly intervals. The first 24 items cover 3 days.
  const next3DaysForecast = forecastList.slice(0, 24);
  const rainExpected = next3DaysForecast.some(item => {
    const desc = item.weather[0].description.toLowerCase();
    const main = item.weather[0].main.toLowerCase();
    return desc.includes('rain') || desc.includes('drizzle') || main.includes('rain');
  });

  if (rainExpected) {
    return 'Rain expected in the coming days — ideal conditions for sowing and transplanting. Reduce irrigation for the week.';
  }

  // 2. High temperatures (> 35C)
  if (currentTemp > 35) {
    return 'High temperatures forecast — ensure adequate irrigation especially for newly planted zones. Consider mulching to retain soil moisture.';
  }

  // 3. High humidity (> 80%)
  if (currentHumidity > 80) {
    return 'High humidity levels — monitor crops closely for early signs of fungal disease. Improve air circulation between plant rows if possible.';
  }

  // 4. Monsoon season check (June to September)
  const currentMonth = new Date().getMonth(); // 0 = Jan, 5 = June, 8 = Sept
  if (currentMonth >= 5 && currentMonth <= 8) {
    return 'Monsoon season conditions — monitor waterlogging in low-lying areas. Good time for Kharif sowing if soil moisture is adequate.';
  }

  // 5. Default favorable advisory
  return 'Weather conditions are favorable for farming activities. Continue regular irrigation and field monitoring schedule.';
};

/**
 * Generate mock weather details for district
 */
const getMockWeather = (district) => {
  const city = getCityName(district);
  
  // Create realistic mock forecast dates
  const forecast = [];
  const weatherDescriptions = ['scattered clouds', 'few clouds', 'clear sky', 'light rain', 'broken clouds'];
  
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    forecast.push({
      date: dateStr,
      temp: 26 + (i % 3), // 26, 27, 28, 26, 27
      condition: weatherDescriptions[i]
    });
  }

  const currentTemp = 28;
  const currentHumidity = 65;
  const mockForecastRaw = forecast.map(f => ({
    weather: [{ description: f.condition, main: f.condition.includes('rain') ? 'Rain' : 'Clouds' }]
  }));

  const advisory = generateAdvisory(currentTemp, currentHumidity, mockForecastRaw);

  return {
    location: city,
    temperature: currentTemp,
    feels_like: 30,
    condition: 'Partly Cloudy',
    condition_main: 'Clouds',
    humidity: currentHumidity,
    wind_speed: 12,
    icon_code: '03d',
    forecast: forecast,
    farming_advisory: advisory,
    is_mock: true
  };
};

/**
 * Fetch live weather and forecast for district
 * @param {string} district - Name of district
 * @returns {Promise<object>} Simplified weather object
 */
const getWeatherData = async (district) => {
  // If API key is missing or is placeholder, immediately use mock data
  if (!OPENWEATHERMAP_API_KEY || OPENWEATHERMAP_API_KEY === 'your_openweathermap_api_key') {
    console.log(`Using mock weather for ${district} (API Key not configured)`);
    return getMockWeather(district);
  }

  const city = getCityName(district);

  try {
    // 1. Fetch current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
    const currentRes = await axios.get(currentUrl);

    // 2. Fetch 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;
    const forecastRes = await axios.get(forecastUrl);

    const currentData = currentRes.data;
    const forecastData = forecastRes.data;

    // Group 3-hourly forecast by date
    const dailyGroup = {};
    forecastData.list.forEach(item => {
      const dateStr = item.dt_txt.split(' ')[0]; // YYYY-MM-DD
      if (!dailyGroup[dateStr]) {
        dailyGroup[dateStr] = [];
      }
      dailyGroup[dateStr].push(item);
    });

    // Extract midday reading (or closest to it) for each of the 5 days starting today
    const forecast = Object.keys(dailyGroup).slice(0, 5).map(date => {
      const list = dailyGroup[date];
      // Search for the 12:00:00 reading
      const midDay = list.find(item => item.dt_txt.includes('12:00:00')) || list[Math.floor(list.length / 2)];
      return {
        date,
        temp: Math.round(midDay.main.temp),
        condition: midDay.weather[0].description
      };
    });

    const currentTemp = Math.round(currentData.main.temp);
    const currentHumidity = currentData.main.humidity;
    
    // Compile advisory based on live parameters
    const advisory = generateAdvisory(currentTemp, currentHumidity, forecastData.list);

    return {
      location: currentData.name,
      temperature: currentTemp,
      feels_like: Math.round(currentData.main.feels_like),
      condition: currentData.weather[0].description,
      condition_main: currentData.weather[0].main,
      humidity: currentHumidity,
      wind_speed: currentData.wind.speed,
      icon_code: currentData.weather[0].icon,
      forecast: forecast,
      farming_advisory: advisory,
      is_mock: false
    };
  } catch (err) {
    console.error(`Error querying OpenWeatherMap API for ${city}, falling back to mock data:`, err.message);
    return getMockWeather(district);
  }
};

module.exports = {
  getWeatherData
};
