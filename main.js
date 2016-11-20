function findMovies(Name)
{
  if (Name.length>0)
  {
    var data="";

    return data;
  }else{
      return new Error("Error");
  }
}

$(document).ready(function(){
  $("#startSearch").on('click', function(){
      findMovies($("#mvName").val());
  });
});
