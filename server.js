require("dotenv").config();
var express = require("express");
var methodOverride = require("method-override");
var expressValidator = require("express-validator"); // https://express-validator.github.io/docs/
var exphbs = require("express-handlebars");
var cookieParser = require("cookie-parser");
var session = require("express-session");
// var SequelizeStore = require('connect-session-sequelize')(session.Store);
var passport = require("passport");
// var LocalStrategy = require("passport-local").Strategy;
var flash = require("connect-flash");

// Removed Dependencies
// bodyParser Removed because is Deprecated since express 4.0
// https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4
// var bodyParser = require("body-parser");

// Database Set Up and Models Importing.
var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware Set Up
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());

// bodyParser Removed because is Deprecated since express 4.0
// https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(bodyParser.text());
// app.use(bodyParser.json({
//   type: "application/vnd.api+json"
// }));

// Set up Static Files Directory
// http://localhost:3000/css will map to public/css
app.use(express.static("public"));
// Validator
// https://express-validator.github.io/docs/
app.use(expressValidator());

// Method Overrride
// https://github.com/expressjs/method-override
app.use(methodOverride("_method"));

// Handlebars Setup
// https://handlebarsjs.com/
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Cookie Parser Middleware
app.use(cookieParser());

// Session Middleware
// https://github.com/expressjs/session
app.use(
  session({
    secret: "user secret",
    // store: new SequelizeStore({
    //   db: db.sequelize
    // }),
    cookie: {
      maxAge: 180 * 60 * 1000
    },
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize()); //initializes the session
app.use(passport.session()); //tells passport to be in charge of the session

// Connect Flash
// https://github.com/jaredhanson/connect-flash
app.use(flash());

// Global Vars
app.use((request, response, next) => {
  response.locals.success_msg = request.flash("success_msg");
  response.locals.error_msg = request.flash("error_msg");
  response.locals.error = request.flash("error");
  response.locals.user = request.user || null;
  next();
});

// Routes
require("./routes/authRoutes.js")(app);
require("./routes/apiRoutes")(app, process.env.OMBD_API_KEY);
require("./routes/htmlRoutes")(app);

// If running a test, set syncOptions.force to true
// clearing the `testdb`
var syncOptions = {
  force: false
};
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;