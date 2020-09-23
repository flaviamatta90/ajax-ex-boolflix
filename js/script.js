// start
$(document).ready(
  function (){

    // chiamata api film

    var url = "https://api.themoviedb.org/3/search";
    var searchMovies = "";

    function chiamataFilm(searchMovies) {
    $.ajax(
    {
      url: url+ "/movie",
      "data" : {
        "api_key": "a6adae1843502c7becfac80b53ca41ac",
        "query" : searchMovies,
        "language" :"it-IT"
      },

      "method": "GET",
      "success": function (data, stato) {
        renderMovies(data.results);
      },
      error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. " + errore);
      }
    });

    $.ajax(
    {
      url: url+ "/tv",
      "data" : {
        "api_key": "a6adae1843502c7becfac80b53ca41ac",
        "query" : searchMovies,
        "language" :"it-IT"
      },

      "method": "GET",
      "success": function (data, stato) {
        renderMovies(data.results);
      },
      error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. " + errore);
      }
    });

  }
      // /chiamata api film

    // template Handlebars + oggetti
    function renderMovies(movies){
      $("#movie").html("");
      var source = $("#entry-template").html();
      var template = Handlebars.compile(source);


      for (var i = 0; i < movies.length; i++){

        var vote = rightVote(movies[i].vote_average);
        var language = flag(movies[i].original_language);

        var context = {
          "title": movies[i].title,
          "name" : movies[i].name,
          "original-title": movies[i].original_title,
          "original-name": movies[i].original_name,

          "original-name" : movies[i].original_name,
          "language": language,
          "vote": vote
        };

        var html = template(context);

        $("#movie").append(html);

      }
    }
    // /template Handlebars + oggetti

    // ricerca film
    // keypress
      $('#cerca').keyup(function(event){
        if (event.which==13) {
          var search = $('#cerca').val();
          $("#cerca").val("");
          chiamataFilm(search);

        }
      });

      // button
      $(".clicca").click(
        function(){
          var search = $('#cerca').val();
          $("#cerca").val("");
          chiamataFilm(search);

       });
     // /ricerca film


     // voto trasformato in stelle
     function rightVote(vote) {
        var newVote = Math.ceil(vote / 2);

        var fullStar = '<i class=\"fas fa-star\"></i>';
        var emptyStar = '<i class=\"far fa-star\"></i>';
        var star = "";

        for (var i = 0; i < newVote; i++) {
          star += fullStar;
        }
        for (var i = 0; i < (5 - newVote); i++) {
          star += emptyStar;
        }
        return star;
      }

     // /voto trasformato in stelle


     // lingua trasformata in bandiera
      var bandiereImg = ["en","it","es","de","fr","chn","us","rus","jpn","bra"];

       function flag(language){
        if (bandiereImg.includes(language)) {
          return '<img src="img/'+ language +'.svg">';
        }
        else{
          return language;
        }
      };
       // /lingua trasformata in bandiera


  });
