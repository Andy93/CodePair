var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/code', function(err, db){
	if(err) throw err;

	client.on('connection', function(socket){

		var col = db.collection('messages');
    //limit to one string to not let after previous emit be presented back to editor
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
