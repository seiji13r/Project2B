module.exports = function (sequelize, DataTypes) {
  var Movie = sequelize.define("Movie", {
    imdbID: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    Title: {
      type: DataTypes.STRING
    },
    Year: {
      type: DataTypes.STRING
    },
    Rated: {
      type: DataTypes.STRING
    },
    Released: {
      type: DataTypes.STRING
    },
    Runtime: {
      type: DataTypes.STRING
    },
    Genre: {
      type: DataTypes.STRING
    },
    Writer: {
      type: DataTypes.TEXT
    },
    Actors: {
      type: DataTypes.TEXT
    },
    Plot: {
      type: DataTypes.TEXT
    },
    Language: {
      type: DataTypes.STRING
    },
    Country: {
      type: DataTypes.STRING
    },
    Awards: {
      type: DataTypes.STRING
    },
    Poster: {
      type: DataTypes.STRING
    },
    Genre: {
      type: DataTypes.STRING
    }
  });

  // Below we declare the association with the Users through the intermediate UserMovie table
  Movie.associate = function (models) {
    Movie.belongsToMany(models.User, {
      through: models.UserMovie
    });
  };

  return Movie;
};

// UserProject = sequelize.define('user_project', {
//   role: Sequelize.STRING
// });
// User.belongsToMany(Project, { through: UserProject });
// Project.belongsToMany(User, { through: UserProject });
// // through is required!

// user.addProject(project, { through: { role: 'manager' }});

// {
//   "Title": "Batman: The Killing Joke",
//   "Year": "2016",
//   "Rated": "R",
//   "Released": "25 Jul 2016",
//   "Runtime": "76 min",
//   "Genre": "Animation, Action, Crime, Drama, Sci-Fi, Thriller",
//   "Director": "Sam Liu",
//   "Writer": "Brian Azzarello, Brian Bolland (based on the graphic novel illustrated by), Bob Kane (Batman created by), Bill Finger (Batman created by)",
//   "Actors": "Kevin Conroy, Mark Hamill, Tara Strong, Ray Wise",
//   "Plot": "As Batman hunts for the escaped Joker, the Clown Prince of Crime attacks the Gordon family to prove a diabolical point mirroring his own fall into madness.",
//   "Language": "English",
//   "Country": "USA",
//   "Awards": "1 win & 2 nominations.",
//   "Poster": "https://m.media-amazon.com/images/M/MV5BMTdjZTliODYtNWExMi00NjQ1LWIzN2MtN2Q5NTg5NTk3NzliL2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg",
//   "Ratings": [
//   {
//   "Source": "Internet Movie Database",
//   "Value": "6.5/10"
//   },
//   {
//   "Source": "Rotten Tomatoes",
//   "Value": "42%"
//   }
//   ],
//   "Metascore": "N/A",
//   "imdbRating": "6.5",
//   "imdbVotes": "41,118",
//   "imdbID": "tt4853102",
//   "Type": "movie",
//   "DVD": "02 Aug 2016",
//   "BoxOffice": "$442,331",
//   "Production": "The Answer Studio",
//   "Website": "N/A",
//   "Response": "True"
//   }