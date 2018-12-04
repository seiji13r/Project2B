// var alert = require('alert');

// import alert from 'alert-node';
// var swal = require('swal');

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var db = require("../models");
var bcrypt = require("bcryptjs");
// var path = require("path");

module.exports = function(app) {
  // landing page
  app.get("/", (request, response) => {
    response.render("landing");
  });

  // app.get('/home', isLoggedIn, (request, response) => {
  //     // db.User.findAll({}).then((result) => {
  //     //     var progObject = {
  //     //         usuarios: result
  //     //     };
  //     response.render('index', progObject);
  // });

  // });

  app.post(
    "/login",
    passport.authenticate("local-signIn", {
      successRedirect: "/home",
      failureRedirect: "/",
      failureFlash: true
    })
  );

  app.get("/logout", isLoggedIn, (request, response, next) => {
    request.logout();
    request.flash("success_msg", "You are logged out");
    response.redirect("/");
  });

  // User Registration Route
  app.post("/users/register", (request, response) => {
    let name = request.body.name;
    let username = request.body.username;
    let email = request.body.email;
    let password = request.body.password;
    // let password2 = request.body.password2;
    // let program = request.body.workouts;

    request.checkBody("name", "Name is required").notEmpty();
    request.checkBody("email", "Email is required").notEmpty();
    request.checkBody("email", "Email is not valid").isEmail();
    request.checkBody("username", "username is required").notEmpty();
    request.checkBody("password", "Password is required").notEmpty();
    request
      .checkBody("password2", "Passwords do not match")
      .equals(request.body.password);

    let errors = request.validationErrors();
    if (errors) {
      // response.redirect('/', {
      //     errors: errors
      // // });
      // response.redirect('/', {
      //     errors: errors
      // });

      request.flash("error_msg", "Please fill out all the fields");
      response.redirect("/");
    } else {
      let salt = bcrypt.genSaltSync(10);
      let hashedPassword = bcrypt.hashSync(password, salt);
      db.User.create({
        name: name,
        username: username,
        password: hashedPassword,
        salt: salt,
        email: email
        // ProgramId: program
      }).then(user => {
        passport.authenticate("local-signIn", {
          failureRedirect: "/",
          successRedirect: "/"
        })(request, response);
        request.flash("success_msg", "You are registered and can now login");
      });
    }
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
