'use strict';

const axios = require('axios');

let cache = {};

async function getMovies(request, response, next) {
  try {
    let searchQuery = request.query.query;

    let key = `${searchQuery}-Photo`;

    if (cache[key] && (Date.now() - cache[key].timestamp) < 8.64e+7) {
      console.log('Movie Cache hit');

      response.status(200).send(cache[key].data);
    } else {
      console.log('Movie Cache miss');

      let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}&language=en-US&page=1&include_adult=false`;

      let movieResults = await axios.get(url);

      let dataToSend = movieResults.data.results.map(movie => new Movies(movie));

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

class Movies {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.overview = movieObj.overview;
    this.average_votes = movieObj.vote_average;
    this.total_votes = movieObj.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${movieObj.poster_path}`;
    this.popularity = movieObj.popularity;
    this.released_on = movieObj.release_date;
  }
}

module.exports = getMovies;
