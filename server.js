require("dotenv").config();
// var express = require("express");
// var exphbs = require("express-handlebars");
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressValidator = require('express-validator');
var exphbs = require("express-handlebars");
var cookieParser = require('cookie-parser')
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');


var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
  type: "application/vnd.api+json"
}));
app.use(expressValidator());
// handle bars //
app.use(express.static(process.cwd() + "/public"));
app.use(methodOverride("_method"));
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Static directory
app.use(express.static("./public"));
app.use(cookieParser());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.use(session({
  secret: "user secret",
  // store: new SequelizeStore({
  //   db: db.sequelize
  // }),
  cookie: {
    maxAge: 180 * 60 * 1000
  },
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize()); //initializes the session
app.use(passport.session()); //tells passport to be in charge of the session

app.use(flash());

// Global Vars
app.use( (request, response, next) => {
  response.locals.success_msg = request.flash('success_msg');
  response.locals.error_msg = request.flash('error_msg');
  response.locals.error = request.flash('error');
  response.locals.user = request.user || null;
  next();
});


// Routes
require("./routes/auth.js")(app);
require("./routes/apiRoutes")(app, process.env.OMBD_API_KEY);
require("./routes/htmlRoutes")(app);

var syncOptions = {
  force: false
};

// If running a test, set syncOptions.force to true
// clearing the `testdb`
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