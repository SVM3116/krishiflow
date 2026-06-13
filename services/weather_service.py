import os
import httpx
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

DISTRICT_TO_CITY = {
    'belagavi': 'Belgaum',
    'dharwad': 'Dharwad',
    'haveri': 'Haveri',
    'gadag': 'Gadag',
    'vijayapura': 'Bijapur',
    'raichur': 'Raichur',
    'bellary': 'Bellary',
    'koppal': 'Koppal',
    'davangere': 'Davangere',
    'shimoga': 'Shimoga',
    'hassan': 'Hassan',
    'mysore': 'Mysore',
    'mandya': 'Mandya',
    'tumkur': 'Tumkur',
    'kolar': 'Kolar',
    'chitradurga': 'Chitradurga',
    'hubli': 'Hubli'
}

def get_city_name(district: str) -> str:
    if not district:
        return 'Belgaum'
    clean = district.lower().strip()
    return DISTRICT_TO_CITY.get(clean, district.capitalize())

def generate_advisory(temp: float, humidity: float, forecast_list: list) -> str:
    # 1. Check for rain in next 3 days (first 24 items of 3-hourly forecast covers 3 days)
    rain_expected = False
    for item in forecast_list[:24]:
        weather_details = item.get('weather', [{}])[0]
        desc = weather_details.get('description', '').lower()
        main = weather_details.get('main', '').lower()
        if 'rain' in desc or 'drizzle' in desc or 'rain' in main:
            rain_expected = True
            break
            
    if rain_expected:
        return 'Rain expected in the coming days — ideal conditions for sowing and transplanting. Reduce irrigation for the week.'
        
    # 2. High temperatures (> 35C)
    if temp > 35:
        return 'High temperatures forecast — ensure adequate irrigation especially for newly planted zones. Consider mulching to retain soil moisture.'
        
    # 3. High humidity (> 80%)
    if humidity > 80:
        return 'High humidity levels — monitor crops closely for early signs of fungal disease. Improve air circulation between plant rows if possible.'
        
    # 4. Monsoon season check (June to September)
    current_month = datetime.now().month # 1-12
    if 6 <= current_month <= 9:
        return 'Monsoon season conditions — monitor waterlogging in low-lying areas. Good time for Kharif sowing if soil moisture is adequate.'
        
    return 'Weather conditions are favorable for farming activities. Continue regular irrigation and field monitoring schedule.'

def get_mock_weather(district: str) -> dict:
    city = get_city_name(district)
    
    forecast = []
    weather_descriptions = ['scattered clouds', 'few clouds', 'clear sky', 'light rain', 'broken clouds']
    
    for i in range(5):
        d = datetime.now() + timedelta(days=i)
        date_str = d.strftime('%Y-%m-%d')
        forecast.append({
            'date': date_str,
            'temp': 26 + (i % 3),
            'condition': weather_descriptions[i]
        })
        
    current_temp = 28
    current_humidity = 65
    
    mock_forecast_raw = [
        {'weather': [{'description': f['condition'], 'main': 'Rain' if 'rain' in f['condition'] else 'Clouds'}]}
        for f in forecast
    ]
    
    advisory = generate_advisory(current_temp, current_humidity, mock_forecast_raw)
    
    return {
        'location': city,
        'temperature': current_temp,
        'feels_like': 30,
        'condition': 'Partly Cloudy',
        'condition_main': 'Clouds',
        'humidity': current_humidity,
        'wind_speed': 12,
        'icon_code': '03d',
        'forecast': forecast,
        'farming_advisory': advisory,
        'is_mock': True
    }

async def get_weather_data(district: str) -> dict:
    api_key = os.getenv('OPENWEATHERMAP_API_KEY')
    if not api_key or api_key == 'your_openweathermap_api_key':
        logger.info(f"Using mock weather for {district} (API Key not configured)")
        return get_mock_weather(district)
        
    city = get_city_name(district)
    
    try:
        async with httpx.AsyncClient() as client:
            # 1. Fetch current weather
            current_url = f"https://api.openweathermap.org/data/2.5/weather?q={city},IN&units=metric&appid={api_key}"
            current_res = await client.get(current_url)
            
            if current_res.status_code != 200:
                logger.warning(f"Weather API returned status {current_res.status_code} for {city}, falling back to mock")
                return get_mock_weather(district)
                
            # 2. Fetch forecast
            forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city},IN&units=metric&appid={api_key}"
            forecast_res = await client.get(forecast_url)
            
            if forecast_res.status_code != 200:
                logger.warning(f"Forecast API returned status {forecast_res.status_code} for {city}, falling back to mock")
                return get_mock_weather(district)
                
            current_data = current_res.json()
            forecast_data = forecast_res.json()
            
            # Group 3-hourly forecast by date
            daily_group = {}
            for item in forecast_data.get('list', []):
                date_str = item['dt_txt'].split(' ')[0]
                if date_str not in daily_group:
                    daily_group[date_str] = []
                daily_group[date_str].append(item)
                
            # Extract midday readings for 5 days
            forecast = []
            sorted_dates = sorted(list(daily_group.keys()))[:5]
            for date in sorted_dates:
                readings = daily_group[date]
                # Try finding 12:00:00, or pick middle one
                midday_reading = None
                for r in readings:
                    if '12:00:00' in r.get('dt_txt', ''):
                        midday_reading = r
                        break
                if not midday_reading:
                    midday_reading = readings[len(readings) // 2]
                    
                forecast.append({
                    'date': date,
                    'temp': round(midday_reading['main']['temp']),
                    'condition': midday_reading['weather'][0]['description']
                })
                
            current_temp = round(current_data['main']['temp'])
            current_humidity = current_data['main']['humidity']
            advisory = generate_advisory(current_temp, current_humidity, forecast_data.get('list', []))
            
            return {
                'location': current_data['name'],
                'temperature': current_temp,
                'feels_like': round(current_data['main']['feels_like']),
                'condition': current_data['weather'][0]['description'],
                'condition_main': current_data['weather'][0]['main'],
                'humidity': current_humidity,
                'wind_speed': current_data['wind']['speed'],
                'icon_code': current_data['weather'][0]['icon'],
                'forecast': forecast,
                'farming_advisory': advisory,
                'is_mock': False
            }
            
    except Exception as e:
        logger.error(f"Error querying OpenWeatherMap API: {str(e)}, falling back to mock")
        return get_mock_weather(district)
