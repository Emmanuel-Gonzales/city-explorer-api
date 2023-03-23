'use srict';

console.log('helloo world');

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios')

let data = require('./data/weather.json');

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

app.get('/weather', (request, response, next) => {
  try{
    let lat = request.query.lat;
    let lon = request.query.lot;
    let searchQuery = request.query.searchQuery;

    let dataToGroom = data.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());
    let dataToSend = new Forecast(dataToGroom);

    response.status(200).send(dataToSend);
  } catch(error){
    next(error);
  }
});

class Forecast {
  constructor(cityObj){
    this.date = cityObj.data[0].valid_date;
    this.description = cityObj.data[0].weather.description;
  }
}

// *** Catch All
app.get('*', (request, response) => {
  response.status(404).send('Page does not exsist');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});
