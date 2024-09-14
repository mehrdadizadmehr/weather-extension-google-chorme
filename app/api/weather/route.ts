import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Hardcoded OpenWeatherMap API key
const OPENWEATHERMAP_KEY = '06d0b212574b9c5ba4a563a2abf202f1';  

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  // Check if latitude and longitude are provided
  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    // OpenWeatherMap API request to fetch detailed weather information
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_KEY}&units=metric`;
    const response = await axios.get(url);

    // Extract necessary data from the API response
    const weatherData = {
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      windSpeed: response.data.wind.speed,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      visibility: response.data.visibility,
      sunrise: response.data.sys.sunrise,
      sunset: response.data.sys.sunset,
    };

    // Return the extracted weather data as JSON
    return NextResponse.json(weatherData);
    
  } catch (error: any) {
    // Log the error
    console.error('Error fetching weather data:', error.response?.data || error.message);
    
    // Return an error response
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
