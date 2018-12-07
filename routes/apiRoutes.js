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

  // Return All Movies
  app.post("/api/movies", function(req, res) {
    db.Movie.findAll({}).then(function(dbMovies) {
      res.json(dbMovies);
    });
  });

  // Movie Seen
  app.post("/api/movieadd", function(req, res) {
    addMovie(req, res, ombdKey);
  });

  // Movie Seen
  app.put("/api/movieseen", function(req, res) {
    updateMovie(req, res, "seen");
  });

  // Movie Want To Watch
  app.put("/api/movietowatch", function(req, res) {
    updateMovie(req, res, "towatch");
  });

  // Remove Movie From My Movies
  app.delete("/api/movieremove", function(req, res) {
    removeMovie(req, res);
  });
};

function addMovie(req, res, ombdKey) {
  var movieImdbID = req.body.imdbID;

  var entryUrl =
    "https://www.omdbapi.com/?i=" + movieImdbID + "&apikey=" + ombdKey;
  // console.log(entryUrl);
  request(entryUrl, function(error, response, body) {
    if (error === null) {
      var movie = JSON.parse(body);
      // console.log(movie);
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
      }).spread(function(dbMovie) {
        // }).spread(function(dbMovie, created) {
        console.log("Add Action");
        req.user.addMovie(dbMovie, {
          through: {
            isSeenAlready: false,
            wannaWatch: false
          }
        });
        // Send The Response With Movie Data
        res.json(dbMovie);
      });
    } else {
      res.json(error);
    }
  });
}

function updateMovie(req, res, opt) {
  var movieImdbID = req.body.imdbID;
  db.Movie.findOne({
    where: {
      imdbID: movieImdbID
    }
  })
    .then(function(dbMovie) {
      if (opt === "seen") {
        console.log("Seen", req.body.seen);
        req.user.addMovie(dbMovie, {
          through: {
            isSeenAlready: req.body.seen
          }
        });
      } else if (opt === "towatch") {
        console.log("ToWatch", req.body.towatch);
        req.user.addMovie(dbMovie, {
          through: {
            wannaWatch: req.body.towatch
          }
        });
      }
      res.json(dbMovie);
    })
    .catch(function(error) {
      res.json(error);
    });
}

function removeMovie(req, res) {
  var movieImdbID = req.body.imdbID;
  db.Movie.findOne({
    where: {
      imdbID: movieImdbID
    }
  })
    .then(function(dbMovie) {
      req.user.removeMovie(dbMovie);
      res.json(dbMovie);
    })
    .catch(function(error) {
      res.json(error);
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
