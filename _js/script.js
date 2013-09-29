$(document).ready(function() {
  $('#trailFinder').on('submit', function(){
    var username, password, playlist;

    username = $('#targetUser').val();
    playlist = $('#playlist').val();

    console.log("username: " + username + ", playlist: " + playlist);

    return false;
  });

})