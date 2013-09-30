var KEY = "AIzaSyDZeRhva5hPAP7JHzk6-iD6wZhCKj1guaU"; //My private key USE WITH CAREFULLY AND DONT DISTRIBUTE
var BASE = "https://www.googleapis.com/youtube/v3"; //We use version three of the google API

$(document).ready(function() {
  $('#trailFinder').on('submit', function(e){
	e.preventDefault(); //atm let's not reload the page
    var username, password, playlist;

    username = $('#targetUser').val();
    playlist = $('#playlist').val();

    console.log("username: " + username + ", playlist: " + playlist);
	
	/*Performing the google search*/
	//Parameters
	var part = "snippet"; //include more information e.g. preview pictures
	var order = "viewCount"; //ordering (date, rating, relevance, title, videoCount or viewCount)
	var type = "playlist"; //type of videos (channel, playlist or video)
	var maxResults = 20; //Max. results to fetch [1-50]
	var method = "search" //We will only be searching content
	var q = "cats"; //Query string !!NEEDS TO BE ALTERED SO IT ACCEPTS DATA FROM THE USER!!
	var fullUrl = BASE + "/" + method + "?part=" + part + "&order=" + order + "&type=" + type + "&key=" + KEY + "&maxResults=" + maxResults + "&q=" + q;
	
	//Make an async call to youtubes API v.3
	$.ajax({
		type: "GET",
		url: fullUrl,
		success: parseYoutubeJSON,
		error: error,
		dataType: "json"
	});
	
	
	//One of the playlists has been clicked, preview all videos in it
	// !!NEEDS TO BE CALLED FROM THE GUI, MAYBE BY CLICKING ON FX. A PREVIEW PIC!!
	/*Performing youtube-playlist search*/
	var method = "playlistItems"; //We will want to search in a specific playlist
	var playlistId = "PL26112E48392C500F" //The Id of the playlist we want to search in !!NEEDS TO BE ALTERED SO IT ACCEPTS DATA FROM THE USER!!
	var part = "snippet" //include more information e.g. preview pictures
	var maxResults = 50; //Max. results to fetch [1-50]
	var fullUrl = BASE + "/" + method + "?playlistId=" + playlistId + "&part=" + part + "&key=" + KEY + "&maxResults=" + maxResults;
	
	//Make an async call to youtubes API v.3
	$.ajax({
		type: "GET",
		url: fullUrl,
		success: parseYoutubePLJSON,
		error: error,
		dataType: "json"
	});
  });
})

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
		
		//Check if all data is correct 
		//console.log("id: " + id + "cTitle: " + cTitle + "title: " + title + "description: " + description + "date: " + date + "image: " + image)
		//http://www.youtube.com/embed/videoseries?list=PL9C5815B418D1508E&index=1
		
	}
	
}

//Youtube-playlist-search callback
function parseYoutubePLJSON(data){
	console.log(data);
}

function error(e){
	console.log("ERROR: " + e);
}