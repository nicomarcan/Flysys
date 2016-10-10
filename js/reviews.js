function displayError(errorcode, errormsg) {
  var errorstr = $("#error_message_"+errorcode).html();
  var errorel = $.parseHTML(errorstr);
  $(errorel).children(".error_description").text(errormsg);
  return errorel;
}

function parseGET() {
  var ret = {};
  var arr = location.search.substr(1).split("&");
  var tmp = [];
  for (var i = 0; i < arr.length; i++ ) {
    tmp = arr[i].split("=");
    ret[tmp[0]] = tmp[1];
  }
  return ret;
}
function updateFlightInfoCard(info) {
  var airline = info.status.airline;
  $("img#info_airline_logo").attr("src", airline.logo);
  $("#info_airline_name").text(airline.name);
  $("#info_airline_code").text(airline.id);
  $("a#airline_breadcrumb").text(airline.name);
  $("a#airline_breadcrumb").attr("href","./reviews_airlines.html?airline_id="+airline.id);
  $("#info_flight_number").text(info.status.number);
  $("a#flight_breadcrumb").text("Vuelo " +info.status.number);
  var departing_airport = info.status.departure.airport;
  var arriving_airport = info.status.arrival.airport;
  $("#info_departing_airport").text(departing_airport.description);
  $("#info_arriving_airport").text(arriving_airport.description);

}
function addScoreBar(name, score) {
  var ret = "<li class=\"collection-item score_list_element\">";
  ret += "<div class=\" col s6 \" style=\"font-size:14px; color: #6b6b6b\">";
  ret += name;
  ret += "</div>";
  ret += "<div class =\"col s6 \" >"
  ret += "<div class =\"progress star_progress four_stars\">";
  ret += "<div class=\"determinate\" style=\"width: " + score + "0%\" ></div>";
  ret += "</div></div>";
  return ret;
}
function addScores(scores) {
  var ret = "<div class=\"col s7\" style=\"margin:10px auto auto auto\"> \
             <ul class=\"collection\">";
  ret += addScoreBar("Global", scores.overall);
  ret += addScoreBar("Amabilidad", scores.friendliness);
  ret += addScoreBar("Comida", scores.food);
  ret += addScoreBar("Puntualidad", scores.punctuality);
  ret += addScoreBar("Programa de pasajeros frecuentes", scores.mileage_program);
  ret += addScoreBar("Confort", scores.comfort);
  ret += addScoreBar("Relacion precio/calidad", scores.quality_price);
  ret += "</ul></div>";
  return ret;
}
function addComment(comment) {
  var com = "<div class=\"col s5\" style=\"margin:10px auto auto auto;\"> \
            <div class = \" divider\"> </div>";
  com += comment.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  com += "</div>";
  return com;
}

function addRecomendation(yes_recommend) {
  var rec = "";
  if (yes_recommend) {
    rec += "<span style=\"color: green; font-size:22px;float:right;\" > RECOMIENDA</span>";
  }
  else {
    rec += "<span style=\"color: red; font-size:22px;float:right;\" > NO RECOMIENDA</span>";
  }
  return rec;
}

function addGrade(score) {
  var grade = score / 2;
  var i = 0;
  var res = "&nbsp&nbsp";
  for (; i < grade; i++) {
    res += "<i class=\"tiny material-icons\"> grade</i>";
  }
  for (; i < 5; i++) {
    res += "<i class=\"tiny material-icons grey-text text-lighten-1\" > grade</i>";
  }
  return res;
}

function addTitle(comments) {
  var com = "<span class=\"review_title\" >";
  var arr = comments.split('\n');
  if (arr.length > 0) {
    com += arr[0].split(0,20);
  }
  com += "</span>";
  return com;
}

function createReviewCard(review) {
  var el = "<div class=\" card-panel row hoverable clickable \">";
  el += "<div class=\"col s12\">";
  el += addTitle(review.comments);
  el += addGrade(review.rating.overall);
  el += addRecomendation(review.yes_recommend);
  el += "</div>"
  el += addComment(review.comments);
  el += addScores(review.rating);
  el += "</div>";
  return el;
}

$(document).ready(function() {
  var airlines = []
  $.ajax({
    url: "http://hci.it.itba.edu.ar/v1/api/misc.groovy",
    jsonp: "callback",
    dataType: "jsonp",
    data: {
      method: "getairlines"
    },
    success: function(response) {
      var airline_data = response.airlines;
      var ret = [];
      for (var i=0; i<response.total; i++) {
        ret[airline_data[i].name] = airline_data[i].logo;
        airlines[airline_data[i].name.toLowerCase()] = airline_data[i].id;
      }
      $("input#airline_search").autocomplete({
        data :  ret,
        select: function(event, ui) {
          $("input#airline_search").val(ui.item.value);
          $("form#airline_search_form").submit();
          return false;
        }
      });
      $("ul.autocomplete-content.dropdown-content").css("position","absolute").css("width", "100%");
    }
  });
  $("form#airline_search_form").submit(function(event) {
    var search_info = $("input#airline_search").val().toLowerCase();
    if (airlines[search_info] != undefined) {
      $("input#airline_search_id").val(airlines[search_info]);
      return true;
    }
    return false;
  });
})
