import axios from 'axios';

// Unsplash API - Get destination images
export const getDestinationImages = async (destination) => {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!apiKey) {
    console.log('⚠️  Unsplash API key not configured');
    return [];
  }

  try {
    console.log(`📸 Fetching images for: ${destination}`);
    const response = await axios.get(
      `https://api.unsplash.com/search/photos`,
      {
        params: {
          query: `${destination} travel landmark`,
          per_page: 5,
          orientation: 'landscape'
        },
        headers: {
          Authorization: `Client-ID ${apiKey}`
        }
      }
    );

    const images = response.data.results.map(img => ({
      url: img.urls.regular,
      thumbnail: img.urls.small,
      photographer: img.user.name,
      description: img.description || img.alt_description
    }));

    console.log(`✅ Found ${images.length} images`);
    return images;
  } catch (error) {
    console.error('❌ Error fetching images:', error.message);
    return [];
  }
};

// Wikipedia API - Get destination information
export const getDestinationInfo = async (destination) => {
  try {
    console.log(`📚 Fetching info for: ${destination}`);

    // Clean destination name for Wikipedia
    const searchTerm = destination.split(',')[0].trim();

    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`,
      {
        headers: {
          'User-Agent': 'TripPlanner/1.0 (rishav@example.com)'
        }
      }
    );

    const info = {
      title: response.data.title,
      description: response.data.extract,
      image: response.data.thumbnail?.source || response.data.originalimage?.source,
      url: response.data.content_urls?.desktop?.page,
      coordinates: response.data.coordinates
    };

    console.log(`✅ Got info for: ${info.title}`);
    return info;
  } catch (error) {
    console.error('❌ Error fetching destination info:', error.message);
    return {
      title: destination,
      description: `Explore the beautiful destination of ${destination}.`,
      image: null,
      url: null
    };
  }
};

// OpenWeatherMap API - Get weather forecast
export const getWeatherForecast = async (city, startDate) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.log('⚠️  OpenWeatherMap API key not configured');
    return null;
  }

  try {
    console.log(`🌤️  Fetching weather for: ${city}`);

    // Get coordinates first
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct`,
      {
        params: {
          q: city,
          limit: 1,
          appid: apiKey
        }
      }
    );

    if (!geoResponse.data.length) {
      return null;
    }

    const { lat, lon } = geoResponse.data[0];

    // Get 5-day forecast
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric'
        }
      }
    );

    const forecast = {
      city: weatherResponse.data.city.name,
      country: weatherResponse.data.city.country,
      current: {
        temp: Math.round(weatherResponse.data.list[0].main.temp),
        feels_like: Math.round(weatherResponse.data.list[0].main.feels_like),
        description: weatherResponse.data.list[0].weather[0].description,
        icon: weatherResponse.data.list[0].weather[0].icon,
        humidity: weatherResponse.data.list[0].main.humidity,
        wind_speed: weatherResponse.data.list[0].wind.speed
      },
      daily: weatherResponse.data.list.slice(0, 5).map(day => ({
        date: day.dt_txt,
        temp: Math.round(day.main.temp),
        temp_min: Math.round(day.main.temp_min),
        temp_max: Math.round(day.main.temp_max),
        description: day.weather[0].description,
        icon: day.weather[0].icon
      }))
    };

    console.log(`✅ Weather: ${forecast.current.temp}°C, ${forecast.current.description}`);
    return forecast;
  } catch (error) {
    console.error('❌ Error fetching weather:', error.message);
    return null;
  }
};

// Google Places API - Get place details (optional, requires API key)
export const getPlaceDetails = async (placeName) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.log('⚠️  Google Maps API key not configured');
    return null;
  }

  try {
    // Search for place
    const searchResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`,
      {
        params: {
          input: placeName,
          inputtype: 'textquery',
          fields: 'place_id,name,geometry,formatted_address,photos',
          key: apiKey
        }
      }
    );

    if (!searchResponse.data.candidates.length) {
      return null;
    }

    const place = searchResponse.data.candidates[0];

    return {
      name: place.name,
      address: place.formatted_address,
      location: place.geometry.location,
      placeId: place.place_id
    };
  } catch (error) {
    console.error('❌ Error fetching place details:', error.message);
    return null;
  }
};

// Enrich destination data with external APIs
export const enrichDestinationData = async (destination) => {
  console.log(`\n🌍 Enriching data for: ${destination}`);

  try {
    // Fetch all data in parallel
    const [images, info, weather] = await Promise.all([
      getDestinationImages(destination),
      getDestinationInfo(destination),
      getWeatherForecast(destination.split(',')[0])
    ]);

    return {
      destination,
      images,
      info,
      weather,
      enrichedAt: new Date()
    };
  } catch (error) {
    console.error('❌ Error enriching destination data:', error);
    return {
      destination,
      images: [],
      info: null,
      weather: null
    };
  }
};
