// Get references to page elements
var $movieTitle = $("#movie-search");
var $movieSearchContainer = $("#movie-search-container");

// // The API object contains methods for each kind of request we'll make
var API = {
  movieSearch: function(movie) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/moviesearch",
      data: JSON.stringify(movie)
    });
  },
  movieAdd: function(movie) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/movieadd",
      data: JSON.stringify(movie)
    });
  },
  movieSeen: function(movie) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "PUT",
      url: "api/movieseen",
      data: JSON.stringify(movie)
    });
  },
  movieToWatch: function(movie) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "PUT",
      url: "api/movietowatch",
      data: JSON.stringify(movie)
    });
  },
  movieRemove: function(movie) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "DELETE",
      url: "api/movieremove",
      data: JSON.stringify(movie)
    });
  }
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
      response.Search.forEach(function(movie) {
        // console.log(movie);
        var imgMovieDiv = $("<div>");
        imgMovieDiv.addClass("movie-div-" + movie.imdbID);
        var movieIMG = $("<img>");
        movieIMG.addClass("img-movie-poster");
        movieIMG.attr("src", movie.Poster);
        movieIMG.attr("alt", movie.Title);

        var addMovieBtn = $("<button>");
        addMovieBtn.text("Add Movie");
        addMovieBtn.addClass("btn btn-warning add-movie");
        addMovieBtn.attr("data-imdbid", movie.imdbID);

        movieIMG.appendTo(imgMovieDiv);
        addMovieBtn.appendTo(imgMovieDiv);

        imgMovieDiv.appendTo($movieSearchContainer);
      });
    }
  });

  $movieTitle.val("");
  $movieSearchContainer.empty();
};

// Handle Button Add Movie
var handleMovieAdd = function() {
  // Prevent From Post Behavior
  event.preventDefault();
  // Capture the imdbID contained in the button.
  var imdbID = $(this).data("imdbid");
  var movie = {
    imdbID: imdbID
  };

  API.movieAdd(movie).then(function(response) {
    // console.log(response);
    // Remove the Movie From the List
    $(".movie-div-" + imdbID).remove();
  });
};

// Handle Button of Movie Already Seen
var handleMovieSeen = function() {
  console.log("Movie Seen Button Clicked");
  event.preventDefault();

  var imdbID = $(this).data("imdbid");
  var spanTag = $("#" + imdbID + "_seen");
  var spanData = $("#" + imdbID + "_seen").text();
  var seenAlready;

  if (spanData === "No") {
    spanTag.text("Yes");
    seenAlready = 1;
  } else {
    spanTag.text("No");
    seenAlready = 0;
  }

  var movieuser = {
    imdbID: imdbID,
    seen: seenAlready
  };

  API.movieSeen(movieuser).then(function(response) {
    console.log(response);
  });
};

// Handle Button of Movie To Watch
var handleMovieToWatch = function() {
  // console.log("Movie Wanna Watch Button Clicked");
  event.preventDefault();

  var imdbID = $(this).data("imdbid");
  // console.log(imdbID);
  // console.log($("#"+imdbID+"_wannawatch").text());
  var spanTag = $("#" + imdbID + "_wannawatch");
  var spanData = $("#" + imdbID + "_wannawatch").text();
  var wannaWatch;

  if (spanData === "No") {
    spanTag.text("Yes");
    wannaWatch = 1;
  } else {
    spanTag.text("No");
    wannaWatch = 0;
  }

  var movie = {
    imdbID: imdbID,
    towatch: wannaWatch
  };

  API.movieToWatch(movie).then(function(response) {
    console.log(response);
  });
};

var handleMovieRemove = function() {
  console.log("Movie Remove Button Clicked");
  event.preventDefault();
  var imdbID = $(this).data("imdbid");

  var movie = {
    imdbID: imdbID
  };

  API.movieRemove(movie).then(function(response) {
    console.log(response);
    // Remove the Movie From the List
    $(".movie-div-" + imdbID).remove();
  });

}

// // Add event listeners to the submit and delete buttons
$(document).on("click", ".btn-search", handleMovieSearchSubmit);
$(document).on("click", ".add-movie", handleMovieAdd);
$(document).on("click", ".remove-movie", handleMovieRemove);
$(document).on("click", ".add-already-seen", handleMovieSeen);
$(document).on("click", ".add-wanna-watch", handleMovieToWatch);
