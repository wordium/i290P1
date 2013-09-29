$(document).ready(function() {
  $('#trailFinder').on('submit', function(){
    var username, password, playlist;

    username = $('#targetUser').val();
    password = $('#password').val();
    playlist = $('#playlist').val();

    return false;
  });

})