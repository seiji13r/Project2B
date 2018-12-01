// Get references to page elements
var $movieTitle = $("#movie-search");
// var $exampleText = $("#example-text");
// var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
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
// $exampleList.on("click", ".delete", handleDeleteBtnClick);

// var API = {
//   saveExample: function(example) {
//     return $.ajax({
//       headers: {
//         "Content-Type": "application/json"
//       },
//       type: "POST",
//       url: "api/examples",
//       data: JSON.stringify(example)
//     });
//   },
//   getExamples: function() {
//     return $.ajax({
//       url: "api/examples",
//       type: "GET"
//     });
//   },
//   deleteExample: function(id) {
//     return $.ajax({
//       url: "api/examples/" + id,
//       type: "DELETE"
//     });
//   }
// };

// // refreshExamples gets new examples from the db and repopulates the list
// var refreshExamples = function() {
//   API.getExamples().then(function(data) {
//     var $examples = data.map(function(example) {
//       var $a = $("<a>")
//         .text(example.text)
//         .attr("href", "/example/" + example.id);

//       var $li = $("<li>")
//         .attr({
//           class: "list-group-item",
//           "data-id": example.id
//         })
//         .append($a);

//       var $button = $("<button>")
//         .addClass("btn btn-danger float-right delete")
//         .text("ｘ");

//       $li.append($button);

//       return $li;
//     });

//     $exampleList.empty();
//     $exampleList.append($examples);
//   });
// };

// // handleFormSubmit is called whenever we submit a new example
// // Save the new example to the db and refresh the list
// var handleFormSubmit = function(event) {
//   event.preventDefault();

//   var example = {
//     text: $exampleText.val().trim(),
//     description: $exampleDescription.val().trim()
//   };

//   if (!(example.text && example.description)) {
//     alert("You must enter an example text and description!");
//     return;
//   }

//   API.saveExample(example).then(function() {
//     refreshExamples();
//   });

//   $exampleText.val("");
//   $exampleDescription.val("");
// };

// // handleDeleteBtnClick is called when an example's delete button is clicked
// // Remove the example from the db and refresh the list
// var handleDeleteBtnClick = function() {
//   var idToDelete = $(this)
//     .parent()
//     .attr("data-id");

//   API.deleteExample(idToDelete).then(function() {
//     refreshExamples();
//   });
// };

// // Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
// $exampleList.on("click", ".delete", handleDeleteBtnClick);
