
var crteateTable = function (list){
console.log(list);
var table = $("<table></table>").appendTo("#container");
var headerRow = $("<tr></tr>").appendTo(table);
$("<th></th>").text("ID").appendTo(headerRow);
$("<th></th>").text("Adult").appendTo(headerRow);
$("<th></th>").text("Original Title").appendTo(headerRow);
$("<th></th>").text("Language").appendTo(headerRow);
$("<th></th>").text("Popularity Index").appendTo(headerRow);
$("<th></th>").text("Votes Count").appendTo(headerRow);
$("<th></th>").text("Rating").appendTo(headerRow);
$("<th></th>").text("Release Date").appendTo(headerRow);

  for (i=0; i<list.length; i++)
  {
    var row = $("<tr></tr>").appendTo(table);
    $("<td></td>").text(list[i].id).appendTo(row);
    $("<td></td>").text(list[i].adult).appendTo(row);
    $("<td></td>").text(list[i].original_title).appendTo(row);
    $("<td></td>").text(list[i].original_language).appendTo(row);
    $("<td></td>").text(list[i].popularity).appendTo(row);
    $("<td></td>").text(list[i].vote_count).appendTo(row);
    $("<td></td>").text(list[i].vote_average).appendTo(row);
    $("<td></td>").text(list[i].release_date).appendTo(row);
  }
}

function findMovies(Name)
{
  if (Name.length>0)
  {
    var settings = {
      "mode": "cors",
      "method": "GET",
      "headers": {}
    }
    var url = "https://api.themoviedb.org/3/search/movie?language=en-US&api_key=c9f5652c46506832ccafded5a8f020e5";
    url+=("&query=" + Name);

    fetch(url, settings)
    .then(function (response) {
      if(response.status == 200)
      {
        return response.json();
      }
      else{
          return new Error("Unexpected error");
      }
    })
    .then(function(response)
    {
      crteateTable(response.results);
    });
  }else{
      return new Error("Empty search string");
  }
}

$(document).ready(function(){
  $("#startSearch").on('click', function(){
      findMovies($("#mvName").val());
  });
});
