var db = require("../models");
var request = require("request");

module.exports = function(app, ombdKey) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({
      where: { id: req.params.id }
    }).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Search Movies
  app.post("/api/moviesearch", function(req, res) {
    var movie = req.body;
    var entryUrl =
      "https://www.omdbapi.com/?s=" +
      movie.title +
      "&type=movie&apikey=" +
      ombdKey;

    request(entryUrl, function(error, response, body) {
      if (error === null) {
        res.send(JSON.parse(body));
      } else {
        res.json(error);
      }
    });
  });

  // Movie Seen
  app.post("/api/movieseen", function(req, res) {
    processMovie(req, res, ombdKey, "seen");
  });

  // Movie Want To Watch
  app.post("/api/movietowatch", function(req, res) {
    processMovie(req, res, ombdKey, "towatch");
  });
};

function processMovie(req, res, ombdKey, opt) {
  var movieImdbID = req.body.imdbID;
  var user = req.body.user;
  // console.log(req.body);
  var entryUrl =
    "https://www.omdbapi.com/?i=" + movieImdbID + "&apikey=" + ombdKey;
  // console.log(entryUrl);
  request(entryUrl, function(error, response, body) {
    if (error === null) {
      var movie = JSON.parse(body);
      db.Movie.findOrCreate({
        where: { imdbID: movie.imdbID },
        defaults: {
          Title: movie.Title,
          Year: movie.Year,
          Rated: movie.Rated,
          Released: movie.Released,
          Runtime: movie.Runtime,
          Genre: movie.Genre,
          Writer: movie.Writer,
          Actors: movie.Actors,
          Plot: movie.Plot,
          Language: movie.Language,
          Country: movie.Country,
          Awards: movie.Awards,
          Poster: movie.Poster,
          Genre: movie.Genre
        }
      }).spread(function(dbMovie, created) {
        res.json(dbMovie);
      });
    } else {
      res.json(error);
    }
  });
}

// imdbID: movie.imdbID,
// Title: movie.Title,
// Year: movie.Year,
// Rated: movie.Rated,
// Released: movie.Released,
// Runtime: movie.Runtime,
// Genre: movie.Genre,
// Writer: movie.Writer,
// Actors: movie.Actors,
// Plot: movie.Plot,
// Language: movie.Language,
// Country: movie.Country,
// Awards: movie.Awards,
// Poster: movie.Poster,
// Genre:  movie.Genre,
