var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    if (req.user) {
      var userid = req.user.id;
      // db.Movie.findAll({
      //   include: [
      //     {
      //       model: db.User,
      //       // attributes: ["MovieImdbID", "UserId"],
      //       through: {
      //         attributes: ["MovieImdbID", "UserId"],
      //         where: { UserId: userid }
      //       }
      //     }
      //   ]
      db.Movie.findAll({
        // attributes: ["Title"],
        include: [{
          model: db.User,
          where: {
            id: req.user.id
          },
          through: {
            attributes: ["isSeenAlready", "wannaWatch"]
            // where: { id: req.user.id }
          }
        }]
      }).then(function (dbMovies) {
        console.log(dbMovies);
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

  // Test Query All
  app.get("/api/movies", function (req, res) {
    db.Movie.findAll({}).then(function (dbMovies) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbMovies
      });
    });
  });

  // Load moviesearch page
  app.get("/moviesearch/", function (req, res) {
    res.render("moviesearch", {
      msg: "Search Movie"
    });
  });

  // app.get("/allmmovies", function (req, res) {
  //   db.Movie.findAll({}).then(function (dbMovies) {
  //     res.json(dbMovies);
  //   });
  // });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};