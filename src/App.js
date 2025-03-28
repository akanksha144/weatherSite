import React, { useState } from "react";
import './App.css';
import axios from "axios";

const API_KEY = "1a00a278b646414484dbb3c8c79718eb"; // Replace with your OpenWeather API key
const API_URL = "https://api.openweathermap.org/data/2.5";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const currentWeather = await axios.get(
        `${API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(currentWeather.data);
      
      const forecastData = await axios.get(
        `${API_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setForecast(forecastData.data.list.filter((_, index) => index % 8 === 0)); // Get daily forecast
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
      setForecast([]);
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div>
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p><b>Temperature:</b> {weather.main.temp}°C</p>
          <p>{weather.weather[0].description}</p>
          <p><b>Humidity:</b> {weather.main.humidity}%</p>
        </div>
      )}
<hr></hr>
      {forecast.length > 0 && (
        <div>
          <h2><u>5-Day Forecast</u></h2>
          {forecast.map((day, index) => (
            <div key={index}>
              <p><b>Date:</b> {new Date(day.dt * 1000).toLocaleDateString()}</p>
              <p><b>Temp:  </b>{day.main.temp}°C</p>
              <p>{day.weather[0].description}</p>
              <hr></hr>
            </div>
          ))}
          
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
