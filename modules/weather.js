'use strict';

const axios = require('axios');

let cache = {};

async function getWeather(request, response, next) {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let key = `lat: ${lat} lon:${lon}- Weather`;

    // 24 Hour Cache Reset
    if (cache[key] && (Date.now() - cache[key].timestamp) < 8.64e+7) {
      console.log('Weather Cache hit');

      response.status(200).send(cache[key].data);
    } else {
      console.log('Weather Cache miss');

      let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;

      let weatherResults = await axios.get(url);

      // let dataToGroom = data.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());
      let dataToSend = weatherResults.data.data.map(day => new Forecast(day));

      cache[key] = {
        data: dataToSend,
        timestamp: Date.now()
      };

      response.status(200).send(dataToSend);
    }


  } catch (error) {
    next(error);
  }
}

class Forecast {
  constructor(cityObj) {
    this.date = cityObj.datetime;
    this.description = cityObj.weather.description;
  }
}

module.exports = getWeather;
