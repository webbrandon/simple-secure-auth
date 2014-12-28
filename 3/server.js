var data = require('./data');           // This is where you create a data exchange package for MongoDB with the Mongoose.
var app = require('./app.js')(data);    // Send the MongoDB exchange package.
var https = require('https');           // Load HTTPS conection components.
var http = require('http');             // Load HTTP connection components.
var fs = require('fs');                 // Read key & certificate.

// Set HTTPS options, key and certificate.
var options = {
    key: fs.readFileSync('./ssl/local.key'),
    cert: fs.readFileSync('./ssl/local.crt'),
    requestCert: true,
    rejectUnauthorized: false
};

app.set('port-ssl', process.env.PORT || 3443);
app.set('port', process.env.PORT || 3000);

var httpsServer = https.createServer(options, app).listen(app.get('port-ssl'), function(){
  console.info('Express Secure Server: Listening on port ' + httpsServer.address().port);
});

var httpServer = http.createServer(app).listen(app.get('port'), function(){
  console.info('Express Open Server: Listening on port ' + httpServer.address().port);
});

