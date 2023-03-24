'use srict';

console.log('helloo world');

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const getWeather = require('./modules/weather.js');
const getMovies = require('./modules/movies.js');

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
  response.status(200).send('Welcome to my Server');
});

app.get('/hello', (request, response) => {
  console.log(request.query);
  let userfirstName = request.query.firstName;
  let userlastName = request.query.lastName;

  response.status(200).send(`Hello ${userfirstName} ${userlastName}! Welcome to my Website`);
});


app.get('/weather', getWeather);


app.get('/movies', getMovies);


// *** Catch All
app.get('*', (request, response) => {
  response.status(404).send('Page does not exsist');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});
