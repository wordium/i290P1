var KEY = "AIzaSyDZeRhva5hPAP7JHzk6-iD6wZhCKj1guaU"; //My private key USE WITH CAREFULLY AND DONT DISTRIBUTE
var BASE = "https://www.googleapis.com/youtube/v3"; //We use version three of the google API

$(document).ready(function() {

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
    getPlaylist(id);
  })

  //Click on an item from the video-preview-field
  $(document).on("click", ".playlistVideo", function(){
    var id = $(this).find(".pl_videoId").text();
    getVideo(id);
  })
})

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

// this will show users that are found from the request form 
function showUsers(data) {
console.log(data);	
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

  //add event listener so that we can see playlists of the user that has been clicked.
  //SYDNEY start here!
  $('.userbtn').on('click', function() {
	
    //1. this is the channel ID, I stuck it as the hopefully unique ID for each person
    var channelID = $(this).attr('id'); 

    //2. this is creating the URL that we are going to call to get that person's playlists
    var playlistURL = BASE + "/search?part=snippet&order=date&type=playlist&key=" + KEY + "&maxResults=5&channelId=" + channelID;

    //3. ajax call using the URL above
    $.ajax({
      type: "GET",
      url: playlistURL,  //4. put in the URL that we formed above
      success: getPlaylist,  //5. this is the function that we want to call when the ajax request is successful. i.e., get those playlists
      error: error,
      dataType: "jsonp"
    });
  })
}

// Find Playlist
function getPlaylist(data){
  //6. this is where we get that data, which will automagically get passed when that function is called above
  var items=data.items;

  $('#foundPlaylist').empty(); //clearing the ul so that we can add a new set, after a search

  //7. now we go through each playlist item in the list
  for (var key in items){
    var playlist = items[key];
    var pID = playlist.id.playlistId;
    var pTitle = playlist.snippet.title;
    var pImageURL = playlist.snippet.thumbnails.default.url;

    //8. now we can append the current playlist using the above information, and it will look like this in the end:
    // <button id = pID><img src = pImageURL></button>
    // <label for=pID>pTitle</label>
    $("#foundPlaylist").append('<li><button id="' + pID + '"<img src="' + pImageURL + '"></button' +
              '<label for="' + pID + '">"' + pTitle + '</label></li>');
  } 

  /*Performing youtube-playlist search*/
  var method = "playlistItems"; //We will want to search in a specific playlist
  var part = "snippet" //include more information e.g. preview pictures
  var maxResults = 7; //Max. results to fetch [1-50]
  var fullUrl = BASE + "/" + method + "?playlistId=" + pID + "&part=" + part + "&key=" + KEY + "&maxResults=" + maxResults;
	
  $('#foundPlaylists').append("<img src='" + pImageURL + "'>"); // getting the playlist preview; change the div to the appropriate one to style
}

// Find Video by given id
function getVideo(id_position){
	//create player iframe if not available
	if($("#ytplayer").length == 0){
		$(".player").append('<iframe id="ytplayer" type="text/html" src="#" allowfullscreen></iframe>');
	}
	//Change the src of the iframe to point to the right video
	$("#ytplayer").attr("src", "https://www.youtube.com/embed/?listType=playlist&list=" + id_position);
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
		//var playlistId = video.snippet.playlistId; //The Id of the playlist this video is in, redundant
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


//I don't think we are using this any more since there is no more #trailFinder

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