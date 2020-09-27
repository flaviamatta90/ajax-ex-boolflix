// var generiche
  var url = "https://api.themoviedb.org/3/";
  var genders = {
    tv: [],
    movie: []
  };

// start
$(document).ready(

  // Funzione per appendere e modificare il genere
  async function () {
  await getGenres('tv');
  await getGenres('movie');

  var genders_tv_template = Handlebars.compile($("#genders-template").html());
  var genders_tv_html = genders_tv_template({ genders: genders.tv });
  $("#genders-tv").append(genders_tv_html);

  var genders_movie_template = Handlebars.compile($("#genders-template").html());
  var genders_movie_html = genders_movie_template({ genders: genders.movie });
  $("#genders-movie").append(genders_movie_html);

  $("select.genere").change(filterGenres);
  // /Funzione per appendere e modificare il genere

  // keypress
  $('#cerca').keyup(function(event){
    if (event.which==13) {
      ricerca();
    }
  });
  // /keypress

  // button
  $(".clicca").click(
    function() {
     ricerca();
   });
  // /button

  // animate background
  $(".background-container").show();
  $(".logo").animate({fontSize: '15em'}, 2000);
  setTimeout(function() {
    $(".background-container").hide();
    $(".all-container").show();
  }, 3000);
  // /animate background

  // funzione per mostrare o nascondere un determinato tipo di genere
  function filterGenres() {
    var genderMovieSelect = $("#genders-movie select").val()
    if (genderMovieSelect != "all") {
      $("#movie .template").each(function() {
        var gid = $(this).attr("data-generi").split(',');
        if (gid.includes(genderMovieSelect)) $(this).show()
        else $(this).hide()
      });
    } else {
      $("#movie .template").show()
    }
    var genderTVSelect = $("#genders-tv select").val()
    if (genderTVSelect != "all") {
      $("#tvshow .template").each(function() {
        var gid = $(this).attr("data-generi").split(',');
        if (gid.includes(genderMovieSelect)) $(this).show()
        else $(this).hide()
      });
    } else {
      $("#tvshow .template").show()
    }
  }
  // funzione per mostrare o nascondere un determinato tipo di genere

  // funzione per reperire il genere
  function getGenres(type){
    return $.ajax(
    {
      url: url + 'genre/'+ type + "/list",
      "data" : {
        "api_key": "a6adae1843502c7becfac80b53ca41ac",
        "language" :"it-IT"
      },
      "method": "GET",
      "success": function (data, stato) {
        for (var j = 0; j < data.genres.length; j++) {
          genders[type].push({
            id: data.genres[j].id,
            name: data.genres[j].name
          })
        }
      },
      error: function (errore) {
        console.log("E' avvenuto un errore. " + errore);
      }
    });
  }
  // /funzione per reperire il genere

  // chiamata api
  function getData(type, search){
    $.ajax(
    {
      url: url + 'search/' + type,
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
      error: function (errore) {
        console.log("E' avvenuto un errore. " + errore);
      }
    });
  }
  // /chiamata api

  // template Handlebars + oggetti
  async function print(type, results){

    var source = $("#entry-template").html();
    var template = Handlebars.compile(source);

    for (var i = 0; i < results.length; i++){

      if (results[i].length == 0){
        alert("Non sono stati produtti risultati per questa ricerca")
      }

      var vote = rightVote(results[i].vote_average);
      var language = flag(results[i].original_language);

      if (results[i].poster_path == null ){
        var poster = "img/no_poster.png";
      } else {
        var poster = "https://image.tmdb.org/t/p/w342" + results[i].poster_path;
      }

      var actors = [];
      await $.ajax(
      {
        url:  `${url}${type}/${results[i].id}/credits`,
        "data" : {
          "api_key": "a6adae1843502c7becfac80b53ca41ac",
          "language" :"it-IT"
        },
        "method": "GET",
        "success": function (data, stato) {
          if (data.cast.length) {
            var max = data.cast.length = 5;
            for (var j = 0; j < max; j++) {
              actors.push(data.cast[j].name +" " + ": " + data.cast[j].character)
            }
          }
        },
        error: function (errore) {
          console.log("E' avvenuto un errore. " + errore);
        }
      })

      var movieGenres = [];
      for (var x = 0; x < results[i].genre_ids.length; x++) {
        var genderId = results[i].genre_ids[x];
        var g = genders[type].filter(function(val) { if (val.id == genderId) return val });
        movieGenres.push(g[0].name);
      }

      var context = {
        "poster" : poster,
        "title": results[i].title || results[i].name,
        "original-name": results[i].original_title || results[i].original_name,
        "language": language,
        "vote": vote,
        "type": type,
        "actors": actors.join(', '),
        "genders": movieGenres.join(', '),
        "overview": results[i].overview,
        "genres_ids": results[i].genre_ids.length ? results[i].genre_ids.join(',') : ''
      };

      var html = template(context);

      if (type == "movie"){
        $("#movie").append(html);
      } else {
        $("#tvshow").append(html);
      }

      // mouseenter show description; mouseleave show img
      $(".template").mouseenter(function(){
        $(this).find('img.poster').hide();
        $(this).find('.behind-img').show();
      });
      $(".template").on('mouseleave', function(){
         $(this).find('img.poster').show();
         $(this).find('.behind-img').hide();
      });
      // /mouseenter show description; mouseleave show img
    }
  }

  // funzione nel caso in cui la ricerca non produca risulatati
  function notFound(type){
    var source = $("#not-found-template").html();
    var template = Handlebars.compile(source);
    var html = template();

    if (type == "movie"){
      $("#movie").append(html);
    } else if (type == "tv"){
      $("#tvshow").append(html);
    }
  }
  // funzione nel caso in cui la ricerca non produca risulatati

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
    $("select.genere").val("all");
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
  function flag(language) {
    if (bandiereImg.includes(language)) {
      return "<img class='flag' src='img/"+ language +".svg'>";
    } else {
      return language;
    }
  }
   // /lingua trasformata in bandiera

})
