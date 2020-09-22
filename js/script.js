// start
$(document).ready(
  function (){

    var searchMovies = "Ritorno al futuro";
    $.ajax(
    {
      url: "https://api.themoviedb.org/3/search/movie",
      "data" : {
        "api_key": "a6adae1843502c7becfac80b53ca41ac",
        "query" : searchMovies,
        "language" :"it-IT"
      },

      "method": "GET",
      "success": function (data, stato) {
        renderMovie(data.results);
      },
      // error: function (richiesta, stato, errori) {
      // alert("E' avvenuto un errore. " + errore);
      // }
    });

    function renderMovie(movies){
      // console.log(movies);

      var source = $("#entry-template").html();
      var template = Handlebars.compile(source);


      for (var i = 0; i < movies.length; i++){

        var context = {
          "title": movies[i].title,
          "original-tile": movies[i].original_title,
          "language": movies[i].original_language,
          "vote": movies[i].vote_average
        };

        var html = template(context);

        $("#movie").append(html);

    }
      }




  });
