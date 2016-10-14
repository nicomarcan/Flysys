function displayError(errorcode, errormsg) {
  var errorstr = $("#error_message_"+errorcode).html();
  var errorel = $.parseHTML(errorstr);
  $(errorel).children(".error_description").text(errormsg);
  return errorel;
}

color_scheme = [
  "#ff6f31",
  "#ff9f02",
  "#ffcf02",
  "#99cc00",
  "#88b131"
];

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

function addGlobalScoreBar(name, score) {
  var ret = "<li class=\"collection-item score_list_element\" style='background-color: #f5f4f3;'>";
  var color_i = parseInt((score + 1) / 2) - 1;
  ret += "<div class=\" col s6 \" style=\"font-size:14px; color: #4c4c4c;font-weight: bolder;\">";
  ret += name;
  ret += "</div>";
  ret += "<div class =\"col s6 \" >"
  ret += "<div class =\"progress star_progress \" >";
  ret += "<div class=\"determinate\" style=\"width: " + parseInt(score * 10) + "%; background-color: "+color_scheme[color_i]+"\"></div>";
  ret += "</div></div>";
  return ret;


}
function addScoreBar(name, score) {
  var ret = "<li class=\"collection-item score_list_element\">";
  var color_i = parseInt( (score + 1) / 2) - 1;
  ret += "<div class=\" col s6 \" style=\"font-size:14px; color: #6b6b6b\">";
  ret += name;
  ret += "</div>";
  ret += "<div class =\"col s6 \" >"
  ret += "<div class =\"progress star_progress \" >";
  ret += "<div class=\"determinate\" style=\"width: " + parseInt(score) + "0%; background-color: "+color_scheme[color_i]+"\"></div>";
  ret += "</div></div>";
  return ret;
}
function addScores(scores) {
  var ret = "<div class='col s12' style=\"margin:10px auto auto auto\"> \
             <ul class=\"collection\">";
  ret += addGlobalScoreBar("Global", scores.overall);
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
  var com = "<div class=\"col s12\" style=\"margin:10px auto auto auto;\">";
  com += comment.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  com += "</div>";
  return com;
}

function addRecomendation(yes_recommend) {
  var rec = "";
  if (yes_recommend) {
    rec += "<div class='col s12'> \
            <div style=\"color: green; font-size:22px; float:right;\" > \
              <i class='material-icons tiny'> \
                thumb_up \
              </i> \
              RECOMIENDA \
            </div> \
            </div>";
  }
  else {
    rec += "<div class='col s12'> \
            <div style=\"color: red; font-size:22px; float:right;\" > \
              <i class='material-icons tiny'> \
                thumb_down \
              </i> \
              NO RECOMIENDA \
            </div> \
            </div>";
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

function addFlightNumber(airline_id, number) {
  var com = "<div class=\"flight_number\" style='font-size: 32px;color: black;font-weight: lighter;' >";
  com += "<a class='flight_number_link' href='./reviews_flights.html?airline_id="+ airline_id+"&flight_number="+ number +"'>"
  com += "Vuelo "+ number;
  com += "</a>"
  com += "</div>";
  return com;
}

function createReviewCard(review) {
  var el = "<div class=\" card-panel row hoverable clickable \">";
  el += "<div class=\"col s4\">";
  el += addFlightNumber(review.flight.airline.id, review.flight.number)
  el += "<div class='divider'></div>";
  el += addComment(review.comments);
  el += "</div>"
  el += "<div class='col s8'>";
  el += addRecomendation(review.yes_recommend);
  el += addScores(review.rating);
  el += "</div>";
  return el;
}

$(document).ready(function() {

  var airlines = []
  $('select').material_select();
  /*
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
  */


  $.ajax({
    type: 'GET',
    url: 'http://hci.it.itba.edu.ar/v1/api/misc.groovy',
    jsonp: 'callback',
    dataType: 'jsonp',
    data: {
      method: 'getairlines'
    },
    success: function(response) {
      var airline_data = response.airlines;
      var ret = [];
      for (var i=0; i<response.total; i++) {
        //ret[airline_data[i].name] = airline_data[i].logo;
        ret.push(airline_data[i].name);
        airlines[airline_data[i].name.toLowerCase()] = airline_data[i].id;
      }
      blood_airlines = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				local: ret
      });

      $('input#airline_search.typeahead').typeahead(
							{
									minLength: 1,
									highlight: true
							},
						// {
						// 		name: 'Aeropuertos',
						// 		source: blood_aeropuertos,
						// 		limit: 2,
						// },
							{
									name: 'Aerolineas',
									limit: 3,
									source: blood_airlines
							}
			);
    }

  });

  $("form#airline_search_form").submit(function(event) {
    var search_info = $("input#airline_search").typeahead('val').toLowerCase();
    if (airlines[search_info] != undefined) {
      $("input#airline_search_id").val(airlines[search_info]);
      return true;
    }
    return false;
  });
})
