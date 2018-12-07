var db = require("../models");
var request = require("request");

module.exports = function(app, ombdKey) {
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

  // var trailer = videopreview(movieImdbID);
  // console.log("****************" + trailer);

  var entryUrl =
    "https://www.omdbapi.com/?i=" + movieImdbID + "&apikey=" + ombdKey;
  // console.log(entryUrl);
  request(entryUrl, function (error, response, body) {
    if (error === null) {
      var movie = JSON.parse(body);
      db.Movie.findOrCreate({
        where: {
          imdbID: movie.imdbID
        },
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
          // Preview: trailer
        }
      }).spread(function(dbMovie, created) {
        if (opt === "seen") {
          req.user.addMovie(dbMovie, {
            through: {
              isSeenAlready: true
            }
          });
        } else if (opt === "towatch") {
          req.user.addMovie(dbMovie, {
            through: {
              wannaWatch: true
            }
          });
        }
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
