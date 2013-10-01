var KEY = "AIzaSyDZeRhva5hPAP7JHzk6-iD6wZhCKj1guaU"; //My private key USE WITH CAREFULLY AND DONT DISTRIBUTE
var BASE = "https://www.googleapis.com/youtube/v3"; //We use version three of the google API

$(document).ready(function() {

  // getting users
  $("#findUserForm").on('submit', function(e){
    e.preventDefault();

    var username = $('#username').val();
    console.log('username' + username);

    var idSearchURL = BASE + "/search?part=snippet&order=date&type=channel&key=" + KEY + "&maxResults=5&q=" + username;

    $.ajax({
      type:'GET',
      url: idSearchURL,
      success: showUsers,
      error: error,
      dataType: 'jsonp'
    });

  });

  $('#trailFinder').on('submit', function(e){
  	e.preventDefault(); //atm let's not reload the page
      
    var searchterm = $('#searchterm').val();

    console.log("searchterm: " + searchterm);
  	
  	/*Performing the google search*/
  	//Parameters
  	var part = "snippet"; //include more information e.g. preview pictures
  	var order = "date"; //ordering (date, rating, relevance, title, videoCount or viewCount)
  	var type = "playlist"; //type of videos (channel, playlist or video)
  	var maxResults = 5; //Max. results to fetch [1-50]
  	var method = "search" //We will only be searching content

  	var fullUrl = BASE + "/" + method + "?part=" + part + "&order=" + order + "&type=" + type + "&key=" + KEY + "&maxResults=" + maxResults + "&q=" + searchterm;
  	
  	//Make an async call to youtubes API v.3
  	$.ajax({
  		type: "GET",
  		url: fullUrl,
  		success: parseYoutubeJSON,
  		error: error,
  		dataType: "jsonp"
  	});
  	
  	
  	//One of the playlists has been clicked, preview all videos in it
  	// !!NEEDS TO BE CALLED FROM THE GUI, MAYBE BY CLICKING ON FX. A PREVIEW PIC!!
  	/*Performing youtube-playlist search*/
  	var method = "playlistItems"; //We will want to search in a specific playlist
  	var playlistId = "PL26112E48392C500F" //The Id of the playlist we want to search in !!NEEDS TO BE ALTERED SO IT ACCEPTS DATA FROM THE USER!!
  	var part = "snippet" //include more information e.g. preview pictures
  	var maxResults = 5; //Max. results to fetch [1-50]
  	var fullUrl = BASE + "/" + method + "?playlistId=" + playlistId + "&part=" + part + "&key=" + KEY + "&maxResults=" + maxResults;
  	
  	//Make an async call to youtubes API v.3
  	$.ajax({
  		type: "GET",
  		url: fullUrl,
  		success: parseYoutubePLJSON,
  		error: error,
  		dataType: "jsonp"
  	});
  });
})


// this will go through the users 
function showUsers(data) {
  var items=data.items;
  for (var key in items){
    var user = items[key];
    console.log("channel ID: " + user.snippet.channelId);
  }
}



//Youtube-search callback
function parseYoutubeJSON(data){
	//console.log(data);
	var items = data.items;
	for (var key in items){
		var list = items[key];
		var id = list.id.playlistId; //Specific ID for the playlist
		var cTitle = list.snippet.channelTitle; //is the channel title, seems to be of lower readability than "title"
		var title = list.snippet.title; //Title of playlist
		var description = list.snippet.description; //Description of playlist
		var date = list.snippet.publishedAt; //Date when the playlist was created
		var image = list.snippet.thumbnails.high.url; //High res preview image of the playlist


    console.log("images: "+ image);
    $('#filmstrip').append("<img src='" + image + "'>"); // getting the playlist preview; change the div to the appropriate one to style

    //console.log("images: "+ image);
    $('#main').append("<img src='" + image + "'>"); // getting the playlist preview; change the div to the appropriate one to style
    
		//Check if all data is correct 
		//console.log("id: " + id + "cTitle: " + cTitle + "title: " + title + "description: " + description + "date: " + date + "image: " + image)
		//https://www.youtube.com/embed/videoseries?list=PL9C5815B418D1508E&index=0 //Url format for calling
		
    $("#viewer").css("visibility", "visible")
    $("#video").attr("src", "http://www.youtube.com/embed/videoseries?list="+id+"&index=0");
    $("#vInfo").val(title);
	}
	
}

//Youtube-playlist-search callback
function parseYoutubePLJSON(data){
	console.log(data);
	var itemsInList = data.pageInfo.totalResults; //Counts # of videos in playlist, max. 50 visible at a time
	var items = data.items;
	for (var key in items){
		var video = items[key];
		var id = video.id; //Specific ID for the video including the playlistId
		var cId = video.snippet.resourceId.videoId; //Specific ID for the video excluding the playlistId
		var description = video.snippet.description; //Description of the video !NB can be very long!
		var playlistId = video.snippet.playlistId; //The Id of the playlist this video is in, redundant
		var position = video.snippet.position; //The position of the video in the playlist
		var date = video.snippet.publishedAt; //The date when the video was uploaded
		var image = video.snippet.thumbnails.high.url; //High res preview image of the playlist
		var title = video.snippet.title; //Title of the video
		
		//Check if all data is correct 
		//console.log("itemsInList: " + itemsInList + "id: " + id + "cId: " + cId + "title: " + title + "description: " + description + "date: " + date + "image: " + image + "playlistId :" + playlistId + "position: " + position)
		//https://www.youtube.com/watch?v=1XYgtSCHvp4&list=PL26112E48392C500F&index=0 //Url format for calling
		
    


	}
}

function error(e){
	console.log("ERROR: " + e);
}