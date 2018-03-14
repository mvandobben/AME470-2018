<html>
<head>
  <script src='asyncReq.js'></script>
  <script src='jquery-3.3.1.min.js'></script>
  <style>
    #rssBox{
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: Helvetica, Arial, sans-serif;
      float: center;
      width: 100%;
      height: 20%;
      background-color: #D6E9FE;  
    }
  
  #rssbox button{
    background-color: #008CBA; /* Blue */
    border: none;
    color: white;
    padding: 15px 30px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }
  
  #theList{
    height:55%;
    display: flex;
    flex-wrap: wrap;
      align-content: space-between;
  }
  
  #theList button{
    background: transparent;
    border: transparent;
    align-content: center;
    text-align: center;
    width:300px;
    height:300px;
  }
  
  #theList h1{
    font-size: 20px;
    font-weight: 100;
  }
  
  #theList h2{
    font-size: 15px;
    font-weight: 100;
  }
  
  #theList img{
    border: 1px solid lightgrey;
    height:200px;
    width:200px;
  }
  
    #theDetails{
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family:helvetica, arial, sans-serif;
      width: 100%;
      height: 130%;
    }
  #theDetails img{
    height:300px;
    width:300px;
  }
  
  </style>

  <script>
    /* fetching the hash inputed into the url*/
   /* app.get("#", function(url, )){
      console.log("New RSS feed request arrived")
      var url = "./getFeedData?url=" + (window.location.has.replace("#", ""));
      $(document).ready(function(){
        loadRSS(url);
    }*/
    
  function getDataFromServer() {
    var url = "https://rss.itunes.apple.com/api/v1/us/apple-music/hot-tracks/all/10/explicit.json";
    loadFile(url, function(resData){
      $("#result").val(resData);
    });
  }
  
  var currRSSData = null;
  
  function changeRSSSrc() {
    var url = "./getFeedData?url=" + (window.location.hash.replace("#",""));
    $(document).ready(function(){
        loadRSS(url);
    });
}
  function buttonCall() {
    var txt;
    var inputUrl = prompt("Enter your RSS feed URL:");
  var url = "./getFeedData?url=" + inputUrl;
    $(document).ready(function(){
        loadRSS(url);
    });
  
}
  function loadRSS(url) {
    loadFile(url, function(resData){
      currRSSData = JSON.parse(resData).feed.results;
      var markup = "";
      for(var i = 0; i < currRSSData.length; i++){
        var entry = currRSSData[i];
        var thumb = entry.artworkUrl100;
        var name = entry.name;
        var artist = entry.artistName;
        markup += "<button onclick='itemSelected(" + i + ")'><img src='" + thumb + "'><h1>" + name+ "</h1><h2>" + artist + "</h2></button>";
      }
      $("#theList").html(markup);
    });
  }
  
  function itemSelected(n) {
  var markup = "";
    var data = currRSSData[n];
    var thumb = data.artworkUrl100 || "";
    var titleDetails = data.name || "";
    var titleUrl = data.url || "";
    var artistNameDetails = data.artistName || "";
    var artistUrl = data.artistUrl || "";
    var releaseDateDetails = data.releaseDate || "";
    var genre = data.genres[0] || "";
    var copyright = data.copyright;
  
    markup += "<img src='" + thumb + "'>";
    markup += "<a href='" + titleUrl + "'><h1>" + titleDetails + "</h1></a>";
    markup += "<a href='" + artistUrl + "'><h2>" + artistNameDetails + "</h2></a>";
    markup += "<h3>" + releaseDateDetails , + genre + "<h3>";
    markup += "<h4>" + copyright + "</h4>";
  
    $("#theDetails").html(markup);
  //document.getElementById("theDetails").innerHTML = markup;
  }
  </script>

</head>

<body onload='changeRSSSrc()'>
<div id='rssBox'>
  <h1> RSS Reader </h1>
    <button onclick='buttonCall()'> Edit </button>
</div>

<div id='theList'></div>

<div id='theDetails'></div>

</body>
</html>
