var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    if (req.user) {
      db.Movie.findAll({
        // attributes: ["Title"],
        include: [
          {
            model: db.User,
            where: {
              id: req.user.id
            },
            through: {
              attributes: ["isSeenAlready", "wannaWatch"]
              // where: { id: req.user.id }
            }
          }
        ]
      }).then(function(dbMovies) {
        res.render("index", {
          msg: "Welcome!",
          movies: dbMovies
        });
        // res.json(dbMovies);
      });
    } else {
      res.render("index");
    }
  });

  // Load moviesearch page
  app.get("/moviesearch/", function(req, res) {
    res.render("moviesearch", {
      msg: "Search Movie"
    });
  });

  // Test Query All
  app.get("/movieslocalall", function(req, res) {
    db.Movie.findAll({}).then(function(dbMovies) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbMovies
      });
    });
  });

  // Test Query All
  app.get("/moviematches", function(req, res) {
    db.Movie.findAll({
      attributes: ["Title", "Year"],
      include: [
        {
          model: db.User,
          required: true,
          attributes: ["name", "username", "email"],
          through: {
            attributes: ["isSeenAlready", "wannaWatch"],
            where: { wannaWatch: true }
          }
        }
      ]
    }).then(function(dbMovies) {
      dbMovies2 = dbMovies.filter(function(elem){
        return elem.Users.length > 1;
      });
      res.render("moviematch", {
        msg: "Movie Matches!",
        movies: dbMovies2
      });
      // res.json(dbMovies2);
    });
  });

  app.get("/api/movies", function(req, res) {
    db.Movie.findAll({}).then(function(dbMovies) {
      res.json(dbMovies);
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
