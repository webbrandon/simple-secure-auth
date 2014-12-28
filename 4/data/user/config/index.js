var mongo = require('mongoose');
var config = {
   host : "localhost",
   port : 27017,
   db   : "auth"
};

var mongoMessage = function(){
	var db = mongo.connection;
	db.once('open', function () {
		console.log('connected.');
	});	
	db.on('error', function(err){
		console.error.bind(console, 'AUTHENTICATION DBMS CONNECTION ERROR!!!');
		console.error.bind(console, err);
	});	
};

var dbConnection = function(){
	var url = 'mongodb://' + config.host + ':' + config.port + '/' + config.db;
	return url;
};

module.exports.open = function(){
	var url = dbConnection();
	mongo.connect(url);	
	mongoMessage();
};

module.exports.close = function(){
	return mongo.disconnect();
};
