$(document).ready(function() {
  $('#trailFinder').on('submit', function(e){
	e.preventDefault(); //atm let's not reload the page
    var username, password, playlist;

    username = $('#targetUser').val();
    playlist = $('#playlist').val();

    console.log("username: " + username + ", playlist: " + playlist);
	
	//Performing the google search
	https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewcount&type=playlist&key=AIzaSyDZeRhva5hPAP7JHzk6-iD6wZhCKj1guaU&maxResults=20&q=cats
	//Parameters
	var part = "snippet"; //include more information e.g. preview pictures
	var order = "viewCount"; //ordering (date, rating, relevance, title, videoCount or viewCount)
	var type = "playlist"; //type of videos (channel, playlist or video)
	var key = "AIzaSyDZeRhva5hPAP7JHzk6-iD6wZhCKj1guaU"; //My private key USE WITH CAREFULLY AND DONT DISTRIBUTE
	var maxResults = 20; //Max. results to fetch [1-50]
	var method = "search" //We will only be searching content
	var q = "cats"; //Query string
	var baseUrl = "https://www.googleapis.com/youtube/v3"; //We use version three of the google API
	var fullUrl = baseUrl + "/" + method + "?part=" + part + "&order=" + order + "&type=" + type + "&key=" + key + "&maxResults=" + maxResults + "&q=" + q;
	
	$.ajax({
		type: "GET",
		url: fullUrl,
		success: parseYoutubeJSON,
		error: error,
		dataType: "json"
	});
  });
})

function parseYoutubeJSON(data){
	console.log(data);
}

function error(e){
	console.log("ERROR: " + e);
}