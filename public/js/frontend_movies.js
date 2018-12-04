// Get references to page elements
var $movieTitle = $("#movie-search");
var $movieSearchContainer = $("#movie-search-container");

// // The API object contains methods for each kind of request we'll make
var API = {
  movieSearch: function(movie){
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/moviesearch",
      data: JSON.stringify(movie)
    });
  },
  movieSeen: function(movieuser){
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/movieseen",
      data: JSON.stringify(movieuser)
    });
  },
  movieToWatch: function(movieuser){
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/movietowatch",
      data: JSON.stringify(movieuser)
    });
  },
};

//  Function to handle the submit
var handleMovieSearchSubmit = function() {
  event.preventDefault();

  var movie = {
    title: $movieTitle.val().trim()
  };

  if (!movie.title) {
    alert("You must enter a Movie Title!");
    return;
  }

  API.movieSearch(movie).then(function(response) {
    // console.log(response);
    if (response.Search) {
      response.Search.forEach(function(movie, index, arr) {
        // console.log(movie);
        var imgMovieDiv = $("<div>");
        imgMovieDiv.addClass("img-movie-div");
        var movieIMG = $("<img>");
        movieIMG.addClass("img-movie-poster");
        movieIMG.attr("src", movie.Poster);
        movieIMG.attr("alt", movie.Title);

        var addAlreadySeenBtn = $("<button>");
        addAlreadySeenBtn.text("Seen Already");
        addAlreadySeenBtn.addClass("btn btn-primary add-already-seen");
        addAlreadySeenBtn.attr("data-imdbid", movie.imdbID);

        var addWannaWatchBtn = $("<button>");
        addWannaWatchBtn.text("WannaWatch");
        addWannaWatchBtn.addClass("btn btn-secondary add-wanna-watch");
        addWannaWatchBtn.attr("data-imdbid", movie.imdbID);

        movieIMG.appendTo(imgMovieDiv);
        addAlreadySeenBtn.appendTo(imgMovieDiv);
        addWannaWatchBtn.appendTo(imgMovieDiv);

        imgMovieDiv.appendTo($movieSearchContainer);
      });
    }
  });

  $movieTitle.val("");
  $movieSearchContainer.empty();
};

// Handle Button of Movie Already Seen
var handleMovieSeen = function(){
  // console.log("MovieSeenClicked");
  // console.log($(this));
  // console.log($(this).data("imdbid"));
  event.preventDefault();

  var movieuser = {
    imdbID: $(this).data("imdbid"),
    user: "toDefine"
  };

  API.movieSeen(movieuser).then(function(response) {
    console.log(response);
  });
};

// Handle Button of Movie To Watch
var handleMovieToWatch = function(){
  // console.log("MovieToWatch");
  // console.log($(this));
  // console.log($(this).data("imdbid"));
  
  event.preventDefault();

  var movieuser = {
    imdbID: $(this).data("imdbid"),
    user: "toDefine"
  };

  API.movieToWatch(movieuser).then(function(response) {
    console.log(response);
  });
};

// // Add event listeners to the submit and delete buttons
$(document).on("click", ".btn-search", handleMovieSearchSubmit);
$(document).on("click", ".add-already-seen", handleMovieSeen);
$(document).on("click", ".add-wanna-watch", handleMovieToWatch);
