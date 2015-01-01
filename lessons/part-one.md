# Create a Baseline Template
When beginning a project development plan engineers will need to translate the designs to a structure for developing, testing and maintaining the software.  Theses designs provide engineers with the information required to develop a baseline template that facilitates data for the project.  We can use the Express command-line tool to accomplish this quickly and apply the current best practices. 

## Generating An Express Application
To do this you need to make sure you have installed Express4 globally, you can refer to earlier tutorials about this.  This requires the use of a command-line console.  Open your console and navigate to the the project workspace folder where you will be saving your project.  Run the following command:

```command-line
$ express simple-secure-auth
```

## Defining Structure to Facilitate Data
In creating maintainable software there is a concept called the fundamentals of formatting.  Key components to this concept are structure and readability.  Structure in terms of code development can mean indentation, object and component separation.  Obtaining readability is done by applying meaningful names to values, functions, files and the logical order of processes that allow one to read line  to line.   When applying the fundamentals of formatting you can also prepare an environment for testing. 

Before we start working on the functional requirements, facilitate a file structure that helps assist reuse and testing.  In this lesson we choose to separate component code into sub-folders that represent object oriented concepts.

Create a new folders `./data` and `./ssl`. Also create a new file called `./server.js`.  Open and copy the code generated in `./bin/www` to `server.js`.  Once that is done delete the `www` file.  In the new `server.js` file delete the the require for `debug`(change `debug` in listener to `console.log` or `console.info`) and add a require for `http` and `data`.  Since later on a HTTPS connection will be created lets make sure we can easily differentiate the two connection types and name `server` to `httpServer` and replace `app	` in `app.listen` to `http.createServer(app).listen`.

```node
// File: server.js
var data = require('./data');               // Package for MongoDB connection with the Mongoose.
var app = require('./app.js')(data);    // Send the MongoDB exchange package to app.
var http = require('http');                  // Load HTTP connection components.

app.set('port', process.env.PORT || 3000);

var httpServer = http.createServer(app).listen(app.get('port'), function(){
  console.info('Express Open Server: Listening on port ' + httpServer.address().port);
});
```

With this change to how the application starts and runs a testing foundation is in place.  It is good practice to generate the test you desire to conduct in the early stages of development before the segments code is written at the very least.  This guide will let you decide on how to do this but will cover validation and verification in the last lesson.  

Enclose `app` code in `module.exports = function(data) { /*code*/ }` and replace `module.exports = app` with `return app` to facilitate the new `data` object that exchanges information with MongoDB.  In addition routes will need this data passed also.  In case someone request a route that doesn't exist lets redirect them to the homepage until we personalize our error URL's.

```node
// File: app.js
module.exports = function(data) {
  var express = require('express');
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');

  var routes = require('./routes/index')(data);
  var users = require('./routes/users')(data);

  var app = express();

  // View engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  // app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', routes);
  app.use('/user', users);

  // Bottom of routes. If the route doesn't exist.
  app.all('*', function(req, res, next) {
    res.redirect('/');
  });

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler 
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  return app;
};
```

Now do the same with the generated routes `./routes/index.js` and `./routes/users.js` and now `return router`.

```node
// Route File: index.js
module.exports = function (data) {
  var express = require('express');
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
  });

  return router;
};
```

```node
// Route File: users.js
module.exports = function (data) {
  var express = require('express');
  var router = express.Router();

  /* GET users listing. */
  router.get('/', function(req, res) {
    res.send('respond with a resource');
  });

  return router;
};
```

This was done because a key point to testing is control of the data.  By centralizing this resource resolving bugs and making data consistent is much easier.  This also provides a method of working with popular testing frameworks like Selenium WebDriver.

Open `./package.json` to begin defining the project configuration.  Change the start script to `node server.js`.

```json
{
  "name": "simple-secure-auth",
  "version": "0.0.2",  /* When generated == 0.0.1 */
  "private": true,
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "~4.9.0",
    "body-parser": "~1.8.1",
    "cookie-parser": "~1.3.3",
    "morgan": "~1.3.0",
    "serve-favicon": "~2.1.3",
    "debug": "~2.0.0",
    "jade": "~1.6.0"
  }
}
```

## SSL/TLS and Simple Session Management
To secure system data from things like wiretapping and man-in-the-middle attacks the system needs to initiate use of the Secure Socket Layer (SSL) and Transport Layer Socket (TLS).  By adding the SSL/TLS component to our Hypertext Transfer Protocol (HTTP) we create what is know as HTTPS connection.  SSL/TLS establishes a encrypted link between the user over HTTP.  

In addition this system is specifically designed to work as a CRM so sessions need to define a registered user from a guest user.  Define the user data model that is going to be applied in the application so we may create a default session for unregistered guest.  This will be a simple object with fields for:

  * User Identification
  * First Name
  * Last Name
  * Email
  * Password

In `server.js` add a require for `https` and `fs`.  Also create a options object with `key`, `cert`, `requestCert` and `rejectUnauthorized` values.  Also set a new app port `port-ssl` to 3443.  Lastly create a `httpsServer` and bind the port and option object to it. 

```node
var data = require('./data');                // MongoDB with the Mongoose.
var app = require('./app.js')(data);    // Send the MongoDB exchange package.
var https = require('https');               // Load HTTPS conection components.
var http = require('http');                  // Load HTTP connection components.
var fs = require('fs');                        // Read key & certificate.

// Set HTTPS options, key and certificate.
var options = {
    key: fs.readFileSync(  /* key file */  ),
    cert: fs.readFileSync(  /* cert file */  ),
    requestCert:                 /* boolean */,
    rejectUnauthorized:    /* boolean */ 
};

app.set('port-ssl', process.env.PORT || 3443);
app.set('port', process.env.PORT || 3000);

var httpsServer = https.createServer(options, app).listen(app.get('port-ssl'), function(){
  console.info('Express Secure Server: Listening on port ' + httpsServer.address().port);
});

var httpServer = http.createServer(app).listen(app.get('port'), function(){
  console.info('Express Open Server: Listening on port ' + httpServer.address().port);
});
```

Lastly we want to make sure people are using the HTTPS connection only.  Some engineers may be ask why not only when needed?  While this used to be the standard thinking it has become a better practice for securing data to keep this connection consistent.  Before the first route is captured user request and apply a new function that checks to see if the current connection is using HTTPS or HTTP by the name of `secure`.  If it isn't forward them to the desired location on a secured connection.

```node
  // Force HTTPS connections
  function secure(req, res, next) {
    // Only for testing under local ENV
    var port = app.get('port') === 80 ? '' : ':' + app.get('port-ssl');

    if (req.secure) {
      // OK, continue
      return next();
    };
    res.redirect('https://' + req.hostname + port + req.url);
  };
```

```node
  // Top of routes. Required to push HTTPS on all routes.
  app.all('*', secure);
``` 

### HTTPS for Implementation
Once done with an projects development and testing we need to purchase or register our SSL/TLS certificates so our user base isn't driven away by their browsers security warning.  There are several ways to go about obtaining a SSL/TLS certificates, some are free to the open source community.  There are two types of SSL/TSL options, trusted and untrusted.  Now and days almost all browsers will identify a self signed certificate as untrusted.  To verifying the systems authenticity a browser will see if a 3rd party services has authenticated the applications host.  

When you receive certificates from your provide place the files in the `ssl` folder created earlier.  Move forward and set the options for your signed and trusted certificate:

```node
var options = {
    key: fs.readFileSync(  './ssl/server.key'  ),
    cert: fs.readFileSync(  './ssl/server.csr'  ),
    ca:     fs.readFileSync(  './ssl/ca.crt'  ),
    requestCert:             true,
    rejectUnauthorized: true 
};
```

### HTTPS for Development and Testing
When developing and testing an application it is to much trouble and expense to use a registered SSL/TLS certificate so we use a generalized replication that resembles the requirements of security goals.  

To generate a self signed certificate for development and testing you will need to have OpenSSL installed.  Begin by generating a key and certificate:

```command-line
# Create the Local Key & CSR
openssl req -new -newkey rsa:2048 -nodes -keyout local.key -out local.csr

# Self sign server cert. 
openssl x509 -req -days 365 -in local.csr -signkey local.key -out local.crt
```

Place the generated files in the `ssl` folder created earlier.  Move on to setting the options for your self signed certificate:

```node
var options = {
    key: fs.readFileSync(  './ssl/local.key'  ),
    cert: fs.readFileSync(  './ssl/local.csr'  ),
    requestCert:             true,
    rejectUnauthorized: false 
};
```

### Session Management
In order to take advantage of the SSL/TLS connection for user authentication we need to begin using session management.  In this guide we only review the basic implementation of session management but there are further steps that can be taken to gain more information and control of a user sessions such as using the DBMS to track and maintain sessions.

First open the `package.json` file and add the following `dependencies`:

```json
"express-session": "~1.9.1",
"node-uuid": "~1.4.1"
```

In the `app.js` file create a require for `session` and `uuid` that were just included into the application configuration.  

```node
var session = require('express-session');
var uuid = require('node-uuid');
```

Just before routes are processed in `app.js` request the `app` to use two functions.  The first will create session and cookie details.  The second will ensure that the session has an identity.  Session identifications are generated using version four of the Universally Unique Identifier (UUID) which is known to be the most secure method of generating a UUID.

```node
  // For session handling.	
  var hour = 3600000;
  app.use(session({
    genid: function() {
      return uuid.v4();
    },
    secret: 'secret key',
    cookie: {
      secure: true,
      expires: new Date(Date.now() + hour),
      maxAge: hour
    },
    saveUninitialized: true,
    resave: true
  }));
  app.use(function(req, res, next) {
    // If no user detail is defined assign guest profile.
    if (!req.session.user) {
      var sess = req.session;
      sess.user = { 
        type: 'guest',
        firstname: 'Guest',
        lastname: 'User'
      };
    }
    return next();
  });
```

When this is all done start up the command-line terminal and point it to the directory base of the application.  Install the dependencies and launch `server.js` with Node.js to see your first secured work product.  

```command-line
npm install
node server.js
```
