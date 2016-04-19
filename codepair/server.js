// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/databases.js');

var fs = require('fs');

var	http = require('http').Server(app);
var mongo = require('mongodb').MongoClient;
var	client = require('socket.io')(http);

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

 require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // set up ejs for templating

// Load static files
app.use(express.static('views'));



// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// sending code ================================================================
mongo.connect('mongodb://127.0.0.1/chat212', function(err, db){
	if(err) throw err;

	client.on('connection', function(socket){

		var col = db.collection('messages');

		col.find().limit(1).sort({_id: 1}).toArray(function(err, res){
			if(err) throw err;
			socket.emit('output',res);
		});
		
		socket.on('input', function(data){
			var code = data.code;

			client.emit('output', [data]);
			console.log(data);
			col.insert({code: code}, function(){
				console.log("inserted");
			})
		});

	});
});

// sending chat ================================================================

// launch ======================================================================
http.listen(port);
console.log('The magic happens on port ' + port);
