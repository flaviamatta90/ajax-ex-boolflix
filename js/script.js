// start
$(document).ready(
  function (){

    // chiamata api film
    var url = "https://api.themoviedb.org/3/search";
    var search = "";

    function chiamataFilm(search) {
    $.ajax(
      {
        url: url+ "/movie",
        "data" : {
          "api_key": "a6adae1843502c7becfac80b53ca41ac",
          "query" : search,
          "language" :"it-IT"
        },

        "method": "GET",
        "success": function (data, stato) {
          print("film", data.results);
        },
        error: function (richiesta, stato, errori) {
        alert("E' avvenuto un errore. " + errore);
        }
      });
    };

    function chiamataTv(search){
      $.ajax(
      {
        url: url+ "/tv",
        "data" : {
          "api_key": "a6adae1843502c7becfac80b53ca41ac",
          "query" : search,
          "language" :"it-IT"
        },

        "method": "GET",
        "success": function (data, stato) {
          print("serie-tv", data.results);
        },
        error: function (richiesta, stato, errori) {
        alert("E' avvenuto un errore. " + errore);
        }
      });
    };
      // /chiamata api film

    // template Handlebars + oggetti
    function print(type, results){

      var source = $("#entry-template").html();
      var template = Handlebars.compile(source);

      for (var i = 0; i < results.length; i++){

        var vote = rightVote(results[i].vote_average);
        var language = flag(results[i].original_language);
        // var poster = results[i].poster_path;


        var context = {
          "title": results[i].title || results[i].name,
          "original-name": results[i].original_title || results[i].original_name,
          "language": language,
          "vote": vote,
          "type": type,
          "poster" : results[i].poster_path,
          "overview" : results[i].overview
        };

        var html = template(context);

        // img
        if(results[i].poster_path == null ){
          var url = "img/no-image.svg";
        }else{
          var url = "https://image.tmdb.org/t/p/w185" + results[i].poster_path;
        };
        // /img

        if (type == "film"){
          $("#movie").append(html);
        } else {
          $("#tvshow").append(html);

        }

      }
    }
    // /template Handlebars + oggetti

    // ricerca film
    // keypress
      $('#cerca').keyup(function(event){
        if (event.which==13) {
          var search = $('#cerca').val();
          $("#movie").html("");
          $("#cerca").val("");
          chiamataFilm(search);
          chiamataTv(search);
        }
      });

      // button
      $(".clicca").click(
        function(){
          var search = $('#cerca').val();
          $("#movie").html("");
          $("#cerca").val("");
          chiamataFilm(search);
          chiamataTv(search);
       });
     // /ricerca film


     // voto trasformato in stelle
     function rightVote(vote) {
        var newVote = Math.ceil(vote / 2);

        var fullStar = "<i class='fas fa-star'></i>";
        var emptyStar = "<i class='far fa-star'></i>";;
        var star = "";

        for(var i = 1; i <= 5; i++) {
          if (i <= newVote){
            star += fullStar;
          } else {
            star += emptyStar;
          }
        }
        // for (var i = 1; i < newVote; i++) {
        //   star += fullStar;
        // }
        // for (var i = 0; i < (5 - newVote); i++) {
        //   star += emptyStar;
        // }
        return star;
      }
     // /voto trasformato in stelle


     // lingua trasformata in bandiera
      var bandiereImg = ["en","it","es","de","fr","chn","us","rus","ja","bra"];

       function flag(language){
        if (bandiereImg.includes(language)) {
          return "<img class='flag' src='img/"+ language +".svg'>";
        }
        else{
          return language;
        }
      };
       // /lingua trasformata in bandiera

  });
