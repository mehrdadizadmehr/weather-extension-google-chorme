"use client";

import { useState } from "react";
import axios from "axios";

// Interface for weather data
interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  windSpeed: number;
  humidity: number;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
}

// Convert UNIX timestamp to readable time
const convertTimestampToTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function Home() {
  const [city, setCity] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch city suggestions as the user types
  const fetchCitySuggestions = async (name: string) => {
    try {
      const response = await axios.get(`/api/cities?name=${name}`);
      setCitySuggestions(response.data.data);  // GeoDB Cities API returns 'data' containing cities
    } catch (error) {
      setError("Failed to fetch city suggestions.");
    }
  };

  // Fetch weather data based on selected city's latitude and longitude
  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
      setWeather(response.data);  // Update weather state with API response
    } catch {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCity(name);
    if (name.length > 2) {
      fetchCitySuggestions(name);
    } else {
      setCitySuggestions([]);
    }
  };

  // Handle city selection from suggestions
  const handleCitySelect = (lat: number, lon: number) => {
    setCitySuggestions([]);
    fetchWeather(lat, lon);  // Fetch weather using selected city's lat/lon
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen glassmorphism">
      <h1 className="text-3xl mb-8">Weather App</h1>

      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Enter city"
        className="border p-2 rounded text-lg w-full max-w-md mb-4 glassmorphism"
      />

      {/* Show city suggestions */}
      {citySuggestions.length > 0 && (
        <ul className="border rounded mt-2 p-2 suggestion-box w-full max-w-md text-lg glassmorphism">
          {citySuggestions.map((city) => (
            <li
              key={city.id}
              className="cursor-pointer hover:bg-gray-100 p-2"
              onClick={() => handleCitySelect(city.latitude, city.longitude)}  // Correctly pass lat/lon
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}

      {loading && <p className="text-gray-700 text-lg">Loading...</p>}
      {error && <p className="text-red-500 text-lg">{error}</p>}

      {/* Display weather data */}
      {weather && (
        <div className="mt-8 weather-box glassmorphism">
          <p className="text-2xl mb-4"><strong>{weather.city}</strong></p>
          <p className="text-lg">Temperature: {weather.temperature}°C</p>
          <p className="text-lg">Weather: {weather.description}</p>
          <p className="text-lg">Wind Speed: {weather.windSpeed} m/s</p>
          <p className="text-lg">Humidity: {weather.humidity}%</p>
          <p className="text-lg">Pressure: {weather.pressure} hPa</p>
          <p className="text-lg">Visibility: {weather.visibility / 1000} km</p>
          <p className="text-lg">Sunrise: {convertTimestampToTime(weather.sunrise)}</p>
          <p className="text-lg">Sunset: {convertTimestampToTime(weather.sunset)}</p>
        </div>
      )}
    </div>
  );
}
