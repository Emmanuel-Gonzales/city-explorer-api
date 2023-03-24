'use srict';

console.log('helloo world');

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const { request, response } = require('express');

// let data = require('./data/weather.json');

// *** app === server
const app = express();


// ****** MIDDLEWARE - CORS
app.use(cors());


// PORT THAT SERVER WILL RUN ON
const PORT = process.env.PORT || 3001;


app.listen(PORT, () => console.log(`Running on port ${PORT}`));

// ****** ENDPOINTS ****

app.get('/', (request, response) => {
  response.status(200).send('Welcome to me Server');
});

app.get('/hello', (request, response) => {
  console.log(request.query);
  let userfirstName = request.query.firstName;
  let userlastName = request.query.lastName;

  response.status(200).send(`Hello ${userfirstName} ${userlastName}! Welcome to my Website`);
});

app.get('/weather', async(request, response, next) => {
  try{
    let lat = request.query.lat;
    let lon = request.query.lon;

    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`;

    let weatherResults = await axios.get(url);

    // let dataToGroom = data.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());
    let dataToSend = weatherResults.data.data.map(day => new Forecast(day));

    response.status(200).send(dataToSend);
  } catch(error){
    next(error);
  }
});

class Forecast {
  constructor(cityObj){
    this.date = cityObj.datetime;
    this.description = cityObj.weather.description;
  }
}

app.get('/movies', async(request, response, next) => {
  try {
    let searchQuery = request.query.query;

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}&language=en-US&page=1&include_adult=false`;

    let movieResults = await axios.get(url);

    let dataToSend = movieResults.data.results.map(movie => new Movies(movie));

    response.status(200).send(dataToSend);
  } catch (error) {
    next(error);
  }

});

class Movies {
  constructor(movieObj){
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.average_votes = movieObj.vote_average;
    this.total_votes = movieObj.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`;
    this.popularity = movieObj.popularity;
    this.released_on = movieObj.release_date;
  }
}

// *** Catch All
app.get('*', (request, response) => {
  response.status(404).send('Page does not exsist');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});
