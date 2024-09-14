import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Hardcoded GeoDB Cities API Key
const GEODB_API_KEY = '442a536873mshcaf678adba00c39p121814jsnd0e426b2b702';  // Replace with your actual API key

// City data interface for GeoDB API response
interface CityData {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cityName = searchParams.get('name');

  // Check if the city name was provided
  if (!cityName) {
    return NextResponse.json({ error: 'City name is required' }, { status: 400 });
  }

  // Increase the limit of city suggestions from 5 to 10 (or any number you want)
  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${cityName}&limit=10`;

  try {
    // Make the request to GeoDB API
    const response = await axios.get(url, {
      headers: {
        'X-RapidAPI-Key': GEODB_API_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
      },
    });

    // Extract the city data from the response and specify the expected type
    const cities: CityData[] = response.data.data.map((city: any) => ({
      id: city.id,
      name: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
    }));

    // Return the list of cities
    return NextResponse.json(cities);
  } catch (error: unknown) {
    // Log the error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching city data:', errorMessage);
    
    // Return a 500 error if the request fails
    return NextResponse.json({ error: 'Failed to fetch city data' }, { status: 500 });
  }
}
