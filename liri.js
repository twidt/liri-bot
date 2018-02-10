
// GlOBAL VARIABLES =====================================================

// packages/files to include
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

// FUNCTIONS =============================================================

function twitter() {
	var client = new Twitter ({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	});

	// Declare user's screen name and tweets limit
	var params = {screen_name: "TwidtTech", count: 20};

	// Request user's timeline
	client.get("statuses/user_timeline", params, function(error, tweets, response){
		if (error) {
			console.log(error);
		}

		// console.log the user's last 20 tweets
		console.log("~~~~~~~~~~~~ LAST 20 TWEETS ~~~~~~~~~~~~");

		for (var i = 0; i < tweets.length; i++) {
			var text = tweets[i].text; // Tweet's text
			var date = tweets[i].created_at.substring(0,10); // Grab date of tweet, ex: Sat Jun 03
			var year = tweets[i].created_at.substring(26,30); // Grab year of tweet

			console.log("TWEET: " + text + "\nDATE: " + date + ", " + year +
						"\n================================================");
		}
	});
}

function spotify(song){
	var spotify = new Spotify ({
		id: keys.spotifyKeys.client_id,
		secret: keys.spotifyKeys.client_secret
	});

	// Request song's information
	// Limit response to 1
	spotify.search({type: "track", query: song, limit: 1}, function(error, data){
		if (error) {
			return console.log(error);
		}
		// console.log song's details
		console.log("~~~~~~~~~~~~ SONG INFORMATION ~~~~~~~~~~~~" + 
			"\n* ARTIST(S): " + data.tracks.items[0].artists[0].name +
			"\n* SONG: " + data.tracks.items[0].name + 
			"\n* PREVIEW LINK: " + data.tracks.items[0].preview_url +
			"\n* ALBUM: " + data.tracks.items[0].album.name);
	});
}

function movie(movieName){
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece&tomatoes=true";

	// Request movie information
	request(queryUrl, function(error, response, body){

	  	// If the request is successful
		if (!error && response.statusCode == 200){
	  		var movieData = JSON.parse(body);

	  		// console.log movie's details
	  		console.log("~~~~~~~~~~~~ MOVIE INFORMATION ~~~~~~~~~~~~" + 
	  			"\n* TITLE: " + movieData.Title + 
	  			"\n* YEAR: " + movieData.Year + 
	  			"\n* IMDB RATING: " + movieData.imdbRating + 
	  			"\n* PRODUCED IN: " + movieData.Country + 
	  			"\n* LANGUAGE: " + movieData.Language +
	  			"\n* PLOT: " + movieData.Plot + 
	  			"\n* ACTORS: " + movieData.Actors + 
	  			"\n* ROTTEN TOMATOES URL: " + movieData.tomatoURL);
		}
	});
}

function whatItSays(){
	// Read random.txt file
	fs.readFile("./random.txt", "utf8", function(error, commandLine){
		if (error) {
			return console.log(error);
		}

		var commandArr = commandLine.split(","); // Turn commandLine into an array
		if (commandArr.length > 1) {
			var command = commandArr[0]; // Grab the command
			var song_movie = commandArr[1].slice(1, commandArr[1].length - 1); // Grab song or movie
		}
		// Determine what command needs to be run
		switch (commandArr[0]) {
			case "my-tweets":
				twitter();
				break;
			case "spotify-this-song":
				var song = song_movie;

				if (song === "") {
					song = "the sign ace";
					spotify(song);
				}
				else {
					spotify(song);
				}
				break;
			case "movie-this":
				var movieName = song_movie.replace(/ /g, "+");

				if (movieName === "") {
					movieName = "mr+nobody";
					movie(movieName);
				}
				else {
					movie(movieName);
				}
				break;
			case "do-what-it-says":
				twitter(); //hey tc, run this twitter function, or it will loop, quick fix 
				break;
			default:
				console.log("Sorry, try again!");
		}
	});
}

// MAIN PROCESS =============================================================

var userInput = process.argv.slice(2); // Remove node and file

// Determine what function to run based on the command entered
switch (userInput[0]) {
	case "my-tweets":
		twitter();
		break;
	case "spotify-this-song":
		var song = userInput.slice(1).join(" "); // Remove command and turn into a string

		// If no song was given, look for "The Sign" by Ace of Base
		if (song === "") {
			song = "the sign ace"; // keywords that will grab the song
			spotify(song);
		}
		else {
			spotify(song);
		}
		break;
	case "movie-this":
		var movieName = userInput.slice(1).join("+"); // remove command and join movie name with +, ex: forrest+gump

		// If no movie title is given, then look for Mr. Nobody
		if (movieName === "") {
			movieName = "mr+nobody";
			movie(movieName);
			// console.log("here");
		}
		else {
			movie(movieName);
		}
		break;
	case "do-what-it-says":
		whatItSays();
		break;
	default:
		console.log("Sorry, try again!");
}
