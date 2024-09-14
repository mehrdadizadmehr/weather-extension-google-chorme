"use client";

import { useState } from "react";
import axios from "axios";
import { WiDaySunny, WiCloud, WiRain, WiStrongWind } from "react-icons/wi";

// Define the weather data structure
interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
}

// Define the City interface for the city suggestions
interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [city, setCity] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);  // Use the WeatherData type here
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCitySuggestions = async (name: string) => {
    try {
      const response = await axios.get(`/api/cities?name=${name}`);
      setCitySuggestions(response.data.data as City[]);
    } catch (error) {
      setError("Failed to fetch city suggestions.");
    }
  };

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
      setWeather(response.data as WeatherData);  // Cast the response to WeatherData
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

  const handleCitySelect = (lat: number, lon: number) => {
    setCitySuggestions([]);
    fetchWeather(lat, lon);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Weather App</h1>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Enter city"
        className="border p-2 rounded"
      />
      {citySuggestions.length > 0 && (
        <ul className="border rounded mt-2 p-2">
          {citySuggestions.map((city) => (
            <li
              key={city.id}
              className="cursor-pointer hover:bg-gray-200 p-1"
              onClick={() => handleCitySelect(city.latitude, city.longitude)}
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}

      {loading && <p>Loading...</p>}

      {weather && (
        <div>
          <p>Temperature: {weather.current_weather.temperature}°C</p>
          <p>Windspeed: {weather.current_weather.windspeed} km/h</p>
          <p>
            Weather:{" "}
            {weather.current_weather.weathercode === 0 ? (
              <WiDaySunny size={50} />
            ) : (
              <WiCloud size={50} />
            )}
          </p>
        </div>
      )}
    </div>
  );
}
