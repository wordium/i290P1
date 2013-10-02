var KEY = "AIzaSyDZeRhva5hPAP7JHzk6-iD6wZhCKj1guaU"; //My private key USE WITH CAREFULLY AND DONT DISTRIBUTE
var BASE = "https://www.googleapis.com/youtube/v3"; //We use version three of the google API

$(document).ready(function() {
	
  /**Setting up listeners**/	
  // getting users
  $("#findUserForm").on('submit', function(e){
    e.preventDefault();	
	var username = $('#username').val();
	 getUsers(username);
  });

  //Click on an item from the playlist-field
  $(document).on("click", ".playlistItem", function(){
    var id = $(this).find(".playlistId").text();
    var title = $(this).find(".playlistTitle").text();
    $(".trailName").text(title);
    getPLItems(id);
  })

  //Click on an item from the video-preview-field
  $(document).on("click", ".playlistVideo", function(){
    var id = $(this).find(".pl_videoId").text();
    getVideo(id);
  })
  
  //Click on an item from the playlist-preview-field
  $(document).on('click', '.userbtn', function() {
    getPlaylists(this);
  });
})

/**Setting ajax calls**/
//Get all users with a name alike the search-string
function getUsers(username){
    var idSearchURL = BASE + "/search?part=snippet&type=channel&key=" + KEY + "&maxResults=5&q=" + username;

    //ajax call to find users of the specified username (usernames are not unique)
    $.ajax({
      type:'GET',
      url: idSearchURL,
      success: showUsers,
      error: error,
      dataType: 'jsonp'
    });
}

//add event listener so that we can see playlists of the user that has been clicked.
function getPlaylists(o){
    //Get the channel Id and create URL
    var channelID = $(o).attr('id'); 
    var maxPlaylists = 50;
    var playlistURL = BASE + "/search?part=snippet&order=date&type=playlist&key=" + KEY + "&maxResults="+maxPlaylists+"&channelId=" + channelID;
	  //console.log(playlistURL)

    $.ajax({
      type: "GET",
      url: playlistURL,  
      success: getPlaylist,
      error: error,
      dataType: "jsonp"
	});
}

//Get all videos of a playlist
function getPLItems(id){
	//Performing youtube-playlist search
  	var method = "playlistItems"; //We will want to search in a specific playlist
  	var part = "snippet" //include more information e.g. preview pictures
  	var maxResults = 11; //Max. results to fetch [1-50]
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

/** Ajax callbacks **/
// this will show users that are found from the request form 
function showUsers(data) {
  //console.log(data);	
  var items=data.items;

  $('#foundUsers').empty(); //clearing the ul so that we can add a new set, after a search
  $('#username').val("");  //cleaning the input filed after the search

  for (var key in items){ //for each user in our list
    //getting relevant information
    var user = items[key];
    var title = user.snippet.title;
    var image = user.snippet.thumbnails.default.url;
    var description = user.snippet.description;
    var cID = user.id.channelId;

    //add the image with the right information
    $('#foundUsers').append('<li><button id="' + cID + '" class="userbtn"> <img src="'+image+'" class="users" alt="'+title+'"></button>' + 
                    '<label for="'+cID+'">' +title + '</label></li>');
  }
}

// Show the found playlists
function getPlaylist(data){

  var items=data.items;
  $('#foundPlaylist').empty(); //clearing the ul so that we can add a new set, after a search

  //Iterate through each playlist item in the list
  for (var key in items){
    var playlist = items[key];
    var pID = playlist.id.playlistId;
    var pTitle = playlist.snippet.title;
    var pImageURL = playlist.snippet.thumbnails.default.url;

    //Append current playlist
	var el = '<li class="playlistItem"><img src="'+ pImageURL +'" width="100" height="50" /><div class="playlistId">'+ pID +'</div><div class="playlistTitle">'+ pTitle +'</div></li>';
    $("#foundPlaylist").append(el);
  } 

  /*Performing youtube-playlist search*/
  var method = "playlistItems"; //We will want to search in a specific playlist
  var part = "snippet" //include more information e.g. preview pictures
  var maxResults = 7; //Max. results to fetch [1-50]
  var fullUrl = BASE + "/" + method + "?playlistId=" + pID + "&part=" + part + "&key=" + KEY + "&maxResults=" + maxResults;
	
  $('#foundPlaylists').append("<img src='" + pImageURL + "'>"); // getting the playlist preview; change the div to the appropriate one to style
}

//Youtube-playlist-search callback
function parseYoutubePLJSON(data){
	$(".previewBlock").empty(); //remove old playlist
	var itemsInList = data.pageInfo.totalResults; //Counts # of videos in playlist, max. 50 visible at a time
	var items = data.items;
	for (var key in items){
		var video = items[key];
		var id = video.id; //Specific ID for the video including the playlistId
		//var cId = video.snippet.resourceId.videoId; //Specific ID for the video excluding the playlistId
		//var description = video.snippet.description; //Description of the video !NB can be very long!
		var playlistId = video.snippet.playlistId; //The Id of the playlist this video is in, redundant
		var position = video.snippet.position; //The position of the video in the playlist
		//var date = video.snippet.publishedAt; //The date when the video was uploaded
		var image = video.snippet.thumbnails.high.url; //High res preview image of the playlist
		var title = video.snippet.title; //Title of the video
		
		//Check if all data is correct 
		//console.log("itemsInList: " + itemsInList + "id: " + id + "cId: " + cId + "title: " + title + "description: " + description + "date: " + date + "image: " + image + "playlistId :" + playlistId + "position: " + position)
		
		$(".previewBlock").append('<div class="playlistVideo"><img src="' + image + '"/><div class="pl_videoId">' + playlistId + '&index=' + position + '</div></div>');
	}
}

function error(e){
	console.log("ERROR: " + e);
}

/** other functions **/
// Find Video by given id
function getVideo(id_position){
	//create player iframe if not available
	if($("#ytplayer").length == 0){
		$(".player").append('<iframe id="ytplayer" type="text/html" src="#" allowfullscreen></iframe>');
	}
	//Change the src of the iframe to point to the right video
	$("#ytplayer").attr("src", "https://www.youtube.com/embed/?listType=playlist&list=" + id_position);
}