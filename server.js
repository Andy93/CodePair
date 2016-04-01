var mongo = require('mongodb').MongoClient;
var app = require('express')();
var http = require('http').Server(app);
var client = require('socket.io')(http);//.listen(8080).sockets;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/static' + '/editor.html');
});

mongo.connect('mongodb://127.0.0.1/code', function(err, db){
	if(err) throw err;

	client.on('connection', function(socket){

		var col = db.collection('messages');

		col.find().limit(3).sort({_id: 1}).toArray(function(err, res){
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

http.listen(8080, function(){
    console.log('listening on 8080');
});
