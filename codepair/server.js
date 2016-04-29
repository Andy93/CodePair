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
var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(http).sockets;

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
mongo.connect(configDB.url, function(err, db){
	if(err) throw err;

	client.on('connection', function(socket){
		var col = db.collection('code');
		//send code
		socket.on('codeDriver',function(data){
			var session = data.session;
			var code = data.code;
			client.emit('codeNavigator', [data]);
			col.insert({session:session, code:code}, function(){
				console.log("HERE");
			});
		
			col.find({session:session}).limit(1).sort({_id:-1}).toArray(function(err, res) {
				if(err) throw err;
				console.log(res);
				//client.emit('codeNavigator', res);
			});
		});
	});
});

// sending chat ================================================================

mongo.connect(configDB.url, function(err, db){
	if(err) throw err;

	client.on('connection', function(socket){
		var col = db.collection('messages'),
			sendStatus = function(s) {
				socket.emit('status', s);
			};

		// Emit all messages
		col.find().limit(100).sort({_id: 1}).toArray(function(err, res) {
			if(err) throw err;
			socket.emit('output', res);
		});

		//wait for input
		socket.on('input',function(data){
			var name = data.name,
				sessionId = data.sessionId,
				message = data.message,
				whitespacePattern = /^\s*$/;

			if(whitespacePattern.test(name) || whitespacePattern.test(message)){
				sendStatus('Name and Message is required.');
			}else{
				col.insert({sessionId: sessionId,name: name, message: message}, function(){


					// Emit latest message to All Clients
					client.emit('output', [data]);

					sendStatus({
						message: "Message sent",
						clear: true
					});
				});
			}
		});

		var collection2 = db.collection('code');
		

		//send code
		

		//get code
		//socket.on('codeNavigator',function(data){
			
		//});

		// delete user
		var col2 = db.collection('users');
		socket.on('userDelete',function(data){
			var email = data.email;
			console.log(data.email);
			col2.deleteOne({"local.email":email}, function(){
				console.log("successful deletion");
			});
		});

	});
});

// launch ======================================================================
http.listen(port);
console.log('The magic happens on port ' + port);

/*
		//send code
		socket.on('codeDriver',function(data){
			var session = data.session;
			var code = data.code;
				client.emit('codeNavigator', [data]);
			if(data.length){
				collection2.insert({session:session, code:code}, function(){
					console.log("HERE");
					
				});
			}
		
			collection2.find({session:session}).limit(1).sort({_id:-1}).toArray(function(err, res) {
				if(err) throw err;
				console.log(res);
				//client.emit('codeNavigator', res);
			});
		});
*/
