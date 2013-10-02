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
  });
  
  //Click on an item fromt the playlist-field
  $(document).on("click", ".playlistItem", function(){
	var id = $(this).find(".playlistId").text();
	getPlaylist(id);
  })
  //Click on an item from the video-preview-field
  $(document).on("click", ".playlistVideo", function(){
	var id = $(this).find(".pl_videoId").text();
	getVideo(id);
  })
  
  // Load the youtube Player API code
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})


// this will go through the users 
function showUsers(data) {
  var items=data.items;
  for (var key in items){
    var user = items[key];
    console.log("channel ID: " + user.snippet.channelId);
  }
}

// Find Playlist by given id
function getPlaylist(id){
  	/*Performing youtube-playlist search*/
  	var method = "playlistItems"; //We will want to search in a specific playlist
  	var part = "snippet" //include more information e.g. preview pictures
  	var maxResults = 50; //Max. results to fetch [1-50]
  	var fullUrl = BASE + "/" + method + "?playlistId=" + id + "&part=" + part + "&key=" + KEY + "&maxResults=" + maxResults;
	
	//Make an async call to youtubes API v.3
  	$.ajax({
  		type: "GET",
  		url: fullUrl,
  		success: parseYoutubePLJSON,
  		error: error,
  		dataType: "jsonp"
  	});
}

// Find Video by given id
function getVideo(id){
  	console.log(id);
	// Replace the 'ytplayer' element with an <iframe> and
  // YouTube player after the API code downloads.
  var player = $("#ytplayer");
    player = new YT.Player('ytplayer', {
      height: '390',
      width: '640',
      videoId: 'M7lc1UVf-VE'
    });
  
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
    $('#findPlaylists').append("<img src='" + image + "'>"); // getting the playlist preview; change the div to the appropriate one to style

    //console.log("images: "+ image);
    
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
		
		$(".previewBlock").append('<div class="playlistVideo"><img src="' + image + '"/><div class="pl_videoId">' + id + '</div></div>');
	}
}

function error(e){
	console.log("ERROR: " + e);
}