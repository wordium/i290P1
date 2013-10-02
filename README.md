i290P1
======
Project title: YouTube playlist trail browser

Project description: Taking the idea of a YouTube playlist as a video equivalent of a Memex trail, we take a username, display the top 5 playlists from that user (if he/she has any), and allow the viewer to browse and watch videos of that playlist.

Team members and roles:
 - Tom Quast: API support, JS for video viewing and general functionality
 - Sandra Helsley: HTML base structure, CSS styles, JS functionality
 - Sydney Friedman: HTML/CSS styling, general scripting

Technologies used: JavaScript/jQuery, HTML, YouTube API

Link to demo version: http://people.ischool.berkeley.edu/~syh/info290ta/p1/

Known bugs:
 - Currently no error messages if no user exists, or if the user does not have accessible playlists
 - Playlist retrieval can be a bit laggy
 - Trail finder is limited to finding a max of 50 playlists due to API restrictions.
   - On a related note, this is not exactly a bug, but because of space issues we only show a max of 11 videos in one playlist.
 