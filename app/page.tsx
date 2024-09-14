"use client";

import { useState } from "react";
import axios from "axios";
import { WiDaySunny, WiCloud, WiRain, WiStrongWind } from "react-icons/wi";  // Icons for weather conditions

// Define the structure for the weather data
interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
}

// Define the structure for the city data
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
  const [weather, setWeather] = useState<WeatherData | null>(null);  // Weather data state
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state

  // Fetch city suggestions from the API
  const fetchCitySuggestions = async (name: string) => {
    try {
      const response = await axios.get(`/api/cities?name=${name}`);
      setCitySuggestions(response.data.data as City[]);  // Cast response to City[]
    } catch (error) {
      setError("Failed to fetch city suggestions.");
    }
  };

  // Fetch weather data from the API using latitude and longitude
  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
      setWeather(response.data as WeatherData);  // Cast response to WeatherData
    } catch {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle city input change and fetch suggestions
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
    fetchWeather(lat, lon);
  };

  // Function to get the correct weather icon based on the weather code
  const getWeatherIcon = (weathercode: number) => {
    switch (weathercode) {
      case 0:
        return <WiDaySunny size={50} />;
      case 1:
        return <WiCloud size={50} />;
      case 2:
        return <WiRain size={50} />;
      default:
        return <WiStrongWind size={50} />;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Weather App</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* Input field for city search */}
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Enter city"
        className="border p-2 rounded"
      />

      {/* City suggestions dropdown */}
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

      {/* Display weather information */}
      {weather && (
        <div>
          <p>Temperature: {weather.current_weather.temperature}°C</p>
          <p>Windspeed: {weather.current_weather.windspeed} km/h</p>
          <p>Weather: {getWeatherIcon(weather.current_weather.weathercode)}</p>
        </div>
      )}
    </div>
  );
}
