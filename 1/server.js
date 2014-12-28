var data = require('./data');           // This is where you create a data exchange package for MongoDB with the Mongoose.
var app = require('./app.js')(data);    // Send the MongoDB exchange package.
var http = require('http');             // Load HTTP connection components.

app.set('port', process.env.PORT || 3000);

var httpServer = http.createServer(app).listen(app.get('port'), function(){
  console.info('Express Open Server: Listening on port ' + httpServer.address().port);
});

