'use srict';

console.log('helloo world');

const { response, request } = require('express');
const express = require('express');
require('dotenv').config();

// *** app === server
const app = express();

// PORT THAT SERVER WILL RUN ON
const PORT = process.env.PORT || 3001;


app.listen(PORT, () => console.log(`Running on port ${PORT}`));

// ****** ENDPOINTS ****

app.get('/', (request, response) => {
  response.status(200).send('Welcome to me Server');
});

// *** Catch All
app.get('*', (request, response) => {
  response.status(404).send('Page does not exsist')
});
