// start
$(document).ready(
  function (){

    var searchMovies = "";

    // chiamata api
    function chiamataFilm(searchMovies) {
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
      error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. " + errore);
      }
    });
  }
      // /chiamata api

    // template Handlebars + oggetti
    function renderMovie(movies){
      $("#movie").html("");
      var source = $("#entry-template").html();
      var template = Handlebars.compile(source);


      for (var i = 0; i < movies.length; i++){

        var context = {
          "title": movies[i].title,
          "original-title": movies[i].original_title,
          "language": movies[i].original_language,
          "vote": movies[i].vote_average
        };

        var html = template(context);

        $("#movie").append(html);

      }
    }
    // /template Handlebars + oggetti

    // ricerca film
     $('#cerca').keydown(function(event){
       if (event.which==13) {
         var search = $('#cerca').val();
         chiamataFilm(search);

         $('#cerca').val('');

       }
     });


  });
