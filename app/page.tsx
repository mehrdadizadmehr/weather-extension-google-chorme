"use client";

import { useState } from "react";
import axios from "axios";
import { WiDaySunny, WiCloudy, WiStrongWind, WiHumidity, WiBarometer, WiSunrise, WiSunset } from "react-icons/wi"; // Import weather-related icons

// Interface to define the structure of the weather data we expect from the API
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

// Interface to define the structure of the city data from GeoDB API
interface CityData {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

// Helper function to convert a UNIX timestamp into a more readable time format (e.g., for sunrise/sunset)
const convertTimestampToTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function Home() {
  const [city, setCity] = useState(""); // State for the city input
  const [citySuggestions, setCitySuggestions] = useState<CityData[]>([]); // State for city suggestions dropdown with typed CityData
  const [weather, setWeather] = useState<WeatherData | null>(null); // State to store fetched weather data
  const [loading, setLoading] = useState(false); // Loading state for fetching weather data
  const [error, setError] = useState<string | null>(null); // Error state if API request fails
  const [citySelected, setCitySelected] = useState(false); // Boolean to track if a city has been selected
  const [isSearching, setIsSearching] = useState(false); // State to track if the user is searching for a new city

  // Function to fetch city suggestions as the user types in the input field
  const fetchCitySuggestions = async (name: string) => {
    try {
      // Fetch city suggestions from our API based on the entered name
      const response = await axios.get(`/api/cities?name=${name}`);
      setCitySuggestions(response.data); // Update citySuggestions with data from API
    } catch (error) {
      setError("Failed to fetch city suggestions."); // Set error state if the request fails
    }
  };

  // Function to fetch weather data once a city has been selected (using the city's latitude and longitude)
  const fetchWeather = async (lat: number, lon: number, cityName: string) => {
    setLoading(true); // Set loading state to true while fetching
    setError(null); // Clear any previous errors
    try {
      // Fetch weather data using the selected city's lat/lon
      const response = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
      setWeather(response.data); // Store the fetched weather data
      setCity(cityName); // Update the input field to show the selected city
      setCitySelected(true); // Set citySelected to true, which moves the input box to the top
      setIsSearching(false); // Stop searching when a city is selected
    } catch {
      setError("Failed to fetch weather data."); // Set error state if the request fails
    } finally {
      setLoading(false); // Stop the loading state after the fetch completes
    }
  };

  // Event handler for when the user types into the city input field
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCity(name); // Update the city input state with the typed value
    setIsSearching(true); // Start searching mode when the user types
    if (name.length > 2) {
      fetchCitySuggestions(name); // Fetch city suggestions only if the input length is greater than 2
    } else {
      setCitySuggestions([]); // Clear suggestions if input length is too short
    }
  };

  // Handle what happens when the user selects a city from the dropdown
  const handleCitySelect = (lat: number, lon: number, name: string) => {
    setCitySuggestions([]); // Clear suggestions once a city is selected
    fetchWeather(lat, lon, name); // Fetch the weather data using the selected city's coordinates
  };

  return (
    <div className="p-4 flex flex-col items-center justify-start min-h-screen glassmorphism">
      {/* Display the label prompting the user to enter a city */}
     {/*  <label className="text-lg mb-2 text-gray-700">Please enter a city:</label> */}

      {/* Input box for entering the city name */}
      <div className={`search-box ${citySelected ? 'move-to-top' : 'centered'}`}>
        <input
          type="text"
          value={city}
          onChange={handleCityChange} // Trigger the handleCityChange function on each keystroke
          placeholder="Enter city"
          className="border p-2 rounded text-lg w-full max-w-md glassmorphism"
        />

        {/* Display a list of city suggestions based on the input if there are suggestions */}
        {citySuggestions.length > 0 && (
          <ul className="border rounded mt-2 p-2 suggestion-box w-full max-w-md text-lg glassmorphism z-50 bg-white">
            {citySuggestions.map((city) => (
              <li
                key={city.id}
                className="cursor-pointer hover:bg-gray-100 p-2"
                onClick={() => handleCitySelect(city.latitude, city.longitude, city.name)} // Handle city selection and pass lat/lon
              >
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hide the rest of the content when user is searching */}
      {!isSearching && (
        <div className="content mt-20">
          {loading && <p className="text-gray-700 text-lg">Loading...</p>} {/* Show a loading message while fetching data */}
          {error && <p className="text-red-500 text-lg">{error}</p>} {/* Show any error messages */}

          {/* Display the selected city and temperature after the user selects a city */}
          {citySelected && weather && (
            <div className="text-center mt-8 mb-4">
              <h2 className="text-3xl font-bold">{weather.city}</h2>
              <p className="text-xl">{weather.temperature}°C</p>
            </div>
          )}

          {/* Weather data boxes, each displaying different pieces of weather information */}
          {weather && (
            <div className="weather-display mt-6 grid grid-cols-2 gap-1 w-full max-w-sm">
              <div className="weather-box">
                <WiDaySunny size={24} />
                <p className="title">Weather:</p>
                <p className="value">{weather.description}</p>
              </div>
              <div className="weather-box">
                <WiStrongWind size={24} />
                <p className="title">Wind Speed:</p>
                <p className="value">{weather.windSpeed} m/s</p>
              </div>
              <div className="weather-box">
                <WiHumidity size={24} />
                <p className="title">Humidity:</p>
                <p className="value">{weather.humidity}%</p>
              </div>
              <div className="weather-box">
                <WiBarometer size={24} />
                <p className="title">Pressure:</p>
                <p className="value">{weather.pressure} hPa</p>
              </div>
              <div className="weather-box">
                <WiCloudy size={24} />
                <p className="title">Visibility:</p>
                <p className="value">{weather.visibility / 1000} km</p>
              </div>
              <div className="weather-box">
                <WiSunrise size={24} />
                <p className="title">Sunrise:</p>
                <p className="value">{convertTimestampToTime(weather.sunrise)}</p>
              </div>
              <div className="weather-box">
                <WiSunset size={24} />
                <p className="title">Sunset:</p>
                <p className="value">{convertTimestampToTime(weather.sunset)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
