const weatherService = require('../services/weatherService');
const responseUtils = require('../utils/responseUtils');

/**
 * Handle GET /api/weather and GET /api/weather/:district requests
 */
const getWeatherByDistrict = async (req, res) => {
  try {
    // Check both path param (backend) and query param (frontend)
    const district = req.params.district || req.query.district;

    if (!district) {
      return responseUtils.error(res, 'District parameter is required.', 400);
    }

    const weatherData = await weatherService.getWeatherData(district);

    // Map weather data to the exact format the frontend expects:
    // array of 5 days: { day: string, temp: number, rain: number, icon: string, condition: string }
    const weatherIcons = {
      "sunny": "☀️",
      "clear sky": "☀️",
      "partly cloudy": "⛅",
      "few clouds": "⛅",
      "scattered clouds": "⛅",
      "broken clouds": "☁️",
      "cloudy": "☁️",
      "overcast clouds": "☁️",
      "light rain": "🌦️",
      "moderate rain": "🌦️",
      "heavy rain": "🌧️",
      "rain": "🌧️",
      "drizzle": "🌦️"
    };

    const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const startDayIdx = new Date().getDay();

    const mappedWeather = weatherData.forecast.map((f, i) => {
      const dayName = shortDays[(startDayIdx + i) % 7];
      const condClean = f.condition.toLowerCase();
      
      let icon = "☀️";
      for (const [key, val] of Object.entries(weatherIcons)) {
        if (condClean.includes(key)) {
          icon = val;
          break;
        }
      }

      return {
        day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayName,
        temp: f.temp,
        rain: condClean.includes("rain") || condClean.includes("drizzle") ? 10 : 0,
        icon: icon,
        condition: f.condition
      };
    });

    const responsePayload = {
      weather: mappedWeather,
      advisory: weatherData.farming_advisory
    };

    // Return merged response (flat root for frontend, and success/data wrapper for test diagnostics)
    return res.status(200).json({
      ...responsePayload,
      success: true,
      data: {
        ...weatherData,
        ...responsePayload
      }
    });
  } catch (error) {
    console.error('Error in weatherController.getWeatherByDistrict:', error);
    return responseUtils.error(res, 'Failed to fetch weather forecast details.', 500);
  }
};

module.exports = {
  getWeatherByDistrict
};
