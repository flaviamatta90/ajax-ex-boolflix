// start
$(document).ready(
  function (){

  // var generiche
    var url = "https://api.themoviedb.org/3/search/";
    var search = "";

    // chiamata api
    function getData(type, search){
      $.ajax(
      {
        url: url + type,
        "data" : {
          "api_key": "a6adae1843502c7becfac80b53ca41ac",
          "query" : search,
          "language" :"it-IT"
        },
        "method": "GET",
        "success": function (data, stato) {
          if(data.total_results > 0){
          print(type, data.results);
          } else {
            notFound(type);
          }
        },
        error: function (error) {
        alert("E' avvenuto un errore. " + errore);
        }
      });
    }
    // /chiamata api

    // template Handlebars + oggetti
    function print(type, results){

      var source = $("#entry-template").html();
      var template = Handlebars.compile(source);

      for (var i = 0; i < results.length; i++){

        if(results[i].length == 0){
          alert("Non sono stati produtti risultati per questa ricerca")
        }

        var vote = rightVote(results[i].vote_average);
        var language = flag(results[i].original_language);

        if(results[i].poster_path == null ){
          var poster = "img/no_poster.png";
        }else{
          var poster = "https://image.tmdb.org/t/p/w342" + results[i].poster_path;
        };

        var context = {
          "poster" : poster,
          "title": results[i].title || results[i].name,
          "original-name": results[i].original_title || results[i].original_name,
          "language": language,
          "vote": vote,
          "type": type,
          "overview" : results[i].overview,
        };

        var html = template(context);

        if (type == "movie"){
          $("#movie").append(html);
        } else {
          $("#tvshow").append(html);
        }
      }
    }
    // /template Handlebars + oggetti

    // funzione nel caso in cui la ricerca non produca risulatati
    function notFound(type){
      if (type == "movie"){
        $("#movie").append(html);
      } else if (type == "tv"){
        $("#tvshow").append(html);
      };

      var source = $("#not-found-template").html();
      var template = Handlebars.compile(source);
      var html = template();
  }

  // keypress
    $('#cerca').keyup(function(event){
      if (event.which==13) {
        ricerca();
      }
    });

    // button
    $(".clicca").click(
      function(){
       ricerca();
     });
   // /button

   // ricerca generica
   function ricerca() {
     var searchAll = $('#cerca').val();
     resetSearch();
     getData("movie", searchAll);
     getData("tv", searchAll);
   }
   // ricerca generica

  // pulizia del contenuto
  function resetSearch() {
    $("#movie").html("");
    $("#tvshow").html("");
    $("#cerca").val("");
  };
  // pulizia del contenuto

   // voto trasformato in stelle
   function rightVote(vote) {
      var newVote = Math.ceil(vote / 2);
      var star = "";

      for(var i = 1; i <= 5; i++) {
        if (i <= newVote){
          star += "<i class='fas fa-star'></i>";
        } else {
          star += "<i class='far fa-star'></i>";
        }
      }
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

     // mouseenter show description; mouseleave show img
     $(document).on({
       mouseenter:function(){
         $(this).find('img.poster').hide();
         $(this).find('.behind-img').show()
       },
       mouseleave:function(){
         $(this).find('img.poster').show();
         $(this).find('.behind-img').hide()
       }
     },".template");
     // /mouseenter show description; mouseleave show img

     // animate background
     $(".background-container").show();
     $(".logo").animate({
        fontSize: '15em'}, 2000);
     setTimeout(function() { $(".background-container").hide();

     $(".all-container").show();
   }, 3000);
   // /animate background


  });
