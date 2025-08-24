import React, { useState } from 'react';
import './Climate.css';

const clear_icon = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
const cloud_icon = "https://cdn-icons-png.flaticon.com/512/414/414825.png";
const drizzle_icon = "https://cdn-icons-png.flaticon.com/512/414/414974.png";
const rain_icon = "https://cdn-icons-png.flaticon.com/512/414/414974.png";
const snow_icon = "https://cdn-icons-png.flaticon.com/512/414/414968.png";
const humidity_icon = "https://cdn-icons-png.flaticon.com/512/728/728093.png";
const wind_icon = "https://cdn-icons-png.flaticon.com/512/553/553416.png";

const allIcons = {
  "01d": clear_icon,
  "01n": clear_icon,
  "02d": cloud_icon,
  "02n": cloud_icon,
  "03d": cloud_icon,
  "03n": cloud_icon,
  "04d": drizzle_icon,
  "04n": drizzle_icon,
  "09d": rain_icon,
  "09n": rain_icon,
  "10d": rain_icon,
  "10n": rain_icon,
  "13d": snow_icon,
  "13n": snow_icon,
};

function getGradient(temp) {
  if (temp === '') return '#1169ecff';
  if (temp < 10) return '#0872beff';
  if (temp < 25) return '#a2d4c5';
  return '#6f9cb8ff';
}

function Climate() {
  const [city, setCity] = useState('');
  const [weather, setWeatherData] = useState({
    temperature: '',
    location: '',
    humidity: '',
    windspeed: '',
    icon: clear_icon
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async (city) => {
    if (!city) return;
    setLoading(true);
    setError('');
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=94bbb9dd54f81d3c23b66a54c203cdb1&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        setError('City not found');
        setLoading(false);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon
      });
    } catch (error) {
      setError("Error fetching weather data");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search(city);
    }
  };

  // const bgColor = getGradient(weather.temperature);

  return (
    <div className="simple-bg">
      <div className="simple-card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={() => search(city)}>Search</button>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="weather-info">
            <img className="weather-icon" src={weather.icon} alt="weather icon" />
            <p className="temperature">
              {weather.temperature !== '' ? `${weather.temperature}°C` : '--'}
            </p>
            <p className="location">
              {weather.location || 'Enter a city to get weather'}
            </p>
            <div className="extra-info" style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
              <div className="humidity" style={{ textAlign: 'center', color: '#000000ff' }}>
                <img src={humidity_icon} alt="humidity" style={{ width: '28px', display: 'block', margin: '0 auto' }} />
                <div>{weather.humidity !== '' ? `${weather.humidity}%` : '--'}</div>
                <span>Humidity</span>
              </div>
              <div className="wind" style={{ textAlign: 'center', color: '#000000ff' }}>
                <img src={wind_icon} alt="wind" style={{ width: '28px', display: 'block', margin: '0 auto' }} />
                <div>{weather.windspeed !== '' ? `${weather.windspeed} m/s` : '--'}</div>
                <span>Wind</span>
              </div>
            </div>
            {error && <div style={{ color: 'red', marginTop: '16px' }}>{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Climate;
