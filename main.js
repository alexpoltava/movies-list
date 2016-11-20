
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
    .then(function(list)
    {
      console.log(list);
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
