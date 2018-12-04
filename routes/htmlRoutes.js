var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    if (req.user) {
      var userid = req.user.id;
      db.Movie.findAll({
        include: [
          {
            model: db.User,
            // attributes: ["MovieImdbID", "UserId"],
            through: {
              attributes: ["MovieImdbID", "UserId"],
              where: { UserId: userid }
            }
          }
        ]
      }).then(function(dbMovies) {
        res.render("index", {
          msg: "Welcome!",
          examples: dbMovies
        });
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

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};