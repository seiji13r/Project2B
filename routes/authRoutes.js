// var alert = require('alert');

// import alert from 'alert-node';
// var swal = require('swal');

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var db = require("../models");
var bcrypt = require("bcryptjs");
// var path = require("path");

module.exports = function(app) {
  // Login Route
  app.post(
    "/login",
    passport.authenticate("local-signIn", {
      successRedirect: "/",
      failureRedirect: "/",
      failureFlash: true
    })
  );

  // User Logout Route
  app.get("/logout", isLoggedIn, (request, response, next) => {
    request.logout();
    request.flash("success_msg", "You are logged out");
    response.redirect("/");
  });

  // User Registration Route
  app.post("/users/register", (request, response) => {
    // console.log(request.body);
    let name = request.body.name;
    let username = request.body.username;
    let email = request.body.email;
    let password = request.body.password;

    request.checkBody("name", "Name is required").notEmpty();
    request.checkBody("email", "Email is required").notEmpty();
    request.checkBody("email", "Email is not valid").isEmail();
    request.checkBody("username", "Username is required").notEmpty();
    request.checkBody("password", "Password is required").notEmpty();
    request
      .checkBody("password2", "Passwords do not match")
      .equals(request.body.password);

    // (node:5387) DeprecationWarning: req.validationErrors() may be removed
    // in a future version. Use req.getValidationResult() instead.
    // let errors = request.validationErrors();

    request.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        // When Validation Fails result will contain the errors.
        // result.array() will be the array containing the errors in
        // the following format:
        // {param: "name", msg: "Name is required", value: ""}
        return response.status(422).json({ errors: result.array() });
      } else {
        console.log("Validation Passed");
        // Encrypt the password with sat and hash.
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(password, salt);
        // Create The User if not already in the Database.
        // Check Logic Required
        db.User.create({
          name: name,
          username: username,
          password: hashedPassword,
          salt: salt,
          email: email
        }).then(userDB => {
          console.log(userDB);
          passport.authenticate("local-signIn", {
            failureRedirect: "/",
            successRedirect: "/"
          })(request, response);
        });
      }
      // return response.json({ message: "Registration Success" });
    });
  });

  // ******************************************************************************
  // *************************** PASSPORT CONFIG***********************************
  // ******************************************************************************

  passport.use(
    "local-signIn",
    new LocalStrategy.Strategy((username, password, done) => {
      db.User.findOne({
        where: {
          username: username
        }
      }).then(user => {
        if (!user) {
          return done(null, false, {
            message: "Unknown User"
          });
        }

        let hashedPW = bcrypt.hashSync(password, user.salt);

        if (user.password === hashedPW) {
          return done(null, user);
        }
        return done(null, false, {
          message: "Incorrect password."
        });
      });
    })
  );

  // function that allows rout access only to logged in users ///
  function isLoggedIn(request, response, next) {
    if (request.isAuthenticated()) {
      return next();
    }
    response.redirect("/");
  }

  // function that allowes rout access only to logged in users ///
  function notLoggedIn(request, response, next) {
    if (!request.isAuthenticated()) {
      return next();
    }
    response.redirect("/");
  }
  // Serialize Sessions
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  //   Deserialize Sessions
  passport.deserializeUser((user, done) => {
    db.User.findOne({
      where: {
        username: user.username
      }
    })
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
};
