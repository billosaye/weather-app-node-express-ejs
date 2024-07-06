
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.render('index', { weather: null, error: null });
});

app.post('/weather', async (req, res) => {
  const location = req.body.location;

  const weatherData = await getWeather(location);

  if (weatherData.error) {
    res.render('index', { weather: null, error: 'Error fetching weather data. Please try again.' });
  } else {
    res.render('index', { weather: weatherData, error: null });
  }
});

// API Service function to fetch weather data
const getWeather = async (location) => {
  try {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    return { error: 'Error fetching weather data. Please try again.' };
  }
};

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
