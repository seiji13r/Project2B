# Project2 <!-- omit in toc --> 

- [Development Checklist](#development-checklist)

# Development Checklist

* [x] Project Starter Copied.
* [x] Project master branch Protected.
* [x] Project Collaborators set up.
* [x] Travis Service enabled in the Project.
* [ ] Project Deployed in Heroku.
* [x] Local Project Database `project2_db` created.
* [ ] `config/config.json` updated with Development
* [ ] `models/example.js` removed.
* [x] Project Model Files `models/user.js` `models/movie.js` `models/usermovie.js` created.
* [ ] `views/layouts/main.handlebars` edited to add Bootstrap and Main Look and Feel.
* [ ] Add the `moviesearch` Route to `route/htmlRoutes.js`
* [ ] Add the  template `moviesearch.handlebars` to `views` with an input for the Movie Title to search.
* [ ] Add the `frontend_movies.js` file to `public/js` and reference it in `views/layouts/main.handlebars`
* [ ] Create the Handler of Submit button in frontend_movies.js.
* [ ] Create the `/api/moviesearch` Post route in `route/apiRoutes.js`.
* [ ] Update server.js to pass the OMBD key to the apiRoutes
* [ ] Install `request` package to call the OMBD API inside.
* [ ] Build the routines in `frontend_movies.js` to draw the movies in screen when searched and add the buttons.
* [ ] Create the routes for the buttons `Movie Seen` and `Movie To Watch`
* [ ] Create a common routine that search for the Movie and Add it locally in the Movie Model.
* [ ] Update the common routine to build the entry in UserMovies Model.