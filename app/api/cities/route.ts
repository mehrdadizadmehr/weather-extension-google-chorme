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

  if (!cityName) {
    return NextResponse.json({ error: 'City name is required' }, { status: 400 });
  }

  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${cityName}&limit=10`;

  try {
    // Make the request to GeoDB API
    const response = await axios.get(url, {
      headers: {
        'X-RapidAPI-Key': GEODB_API_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
      },
    });

    // Define the structure of the cities based on the response type
    const cities: CityData[] = response.data.data.map((city: {
      id: number;
      name: string;
      country: string;
      latitude: number;
      longitude: number;
    }) => ({
      id: city.id,
      name: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
    }));

    return NextResponse.json(cities);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching city data:', errorMessage);

    return NextResponse.json({ error: 'Failed to fetch city data' }, { status: 500 });
  }
}
