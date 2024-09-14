import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const RAPIDAPI_KEY = '442a536873mshcaf678adba00c39p121814jsnd0e426b2b702';  // Replace with your actual key from RapidAPI

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cityName = searchParams.get('name');

  if (!cityName) {
    return NextResponse.json({ error: 'City name is required' }, { status: 400 });
  }

  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${cityName}&limit=5`;

  try {
    const response = await axios.get(url, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch city data' }, { status: 500 });
  }
}
