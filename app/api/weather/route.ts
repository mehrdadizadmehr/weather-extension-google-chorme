import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Hardcode the OpenWeatherMap API key temporarily
const OPENWEATHERMAP_KEY = '06d0b212574b9c5ba4a563a2abf202f1';  // Your API key here

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cityName = searchParams.get('name');

  // Check if the city name was provided
  if (!cityName) {
    return NextResponse.json({ error: 'City name is required' }, { status: 400 });
  }

  // Construct the URL for the OpenWeatherMap API request
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OPENWEATHERMAP_KEY}&units=metric`;

  try {
    // Make the request to OpenWeatherMap
    const response = await axios.get(url);
    return NextResponse.json(response.data);  // Return the weather data as JSON
  } catch (error: any) {
    // Log the error message in the server console
    console.error('Error fetching weather data:', error.response?.data || error.message);
    
    // Return a 500 error if the request to the API fails
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
