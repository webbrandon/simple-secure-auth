module.exports = function (data) {
  var express = require('express');
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var session = require('express-session');
  var uuid = require('node-uuid');

  var routes = require('./routes/index')(data);
  var users = require('./routes/users')(data);

  var app = express();

	// Force HTTPS connections
	function secure(req, res, next){
	  // Only for testing under local ENV
		var port = app.get('port') === 80 ? '' : ':' + app.get('port-ssl'); 
		
		if(req.secure){
		  // OK, continue
		  return next();
		};
		res.redirect('https://' + req.hostname + port + req.url); 
	};

  // View engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  // app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

	// For session handling.	
	var hour = 3600000;
	app.use(session({ 
		genid: function() {
			  return uuid.v4();
		},
		secret: 'secret key',
		cookie: { secure:  true,
				  expires: new Date(Date.now() + hour),
				  maxAge:  hour 
		},
		saveUninitialized: true,
	  resave: true
	}));
	app.use(function(req, res, next){
	  if(!req.session.user){
		  var sess = req.session;
		  sess.user = {type: 'guest', firstname: 'Guest', lastname: 'User'};
	  }
	  return next();
  });
		
	// Top of routes. Required to push HTTPS on all routes.
	app.all('*', secure); 
	
  app.use('/', routes);
  app.use('/user', users);
	
	// Bottom of routes. If the route doesn't exist.
	app.all('*', function(req, res, next){
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
              error: err,
              profile: req.session.user
          });
      });
  }

  // production error handler 
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: {},
          profile: req.session.user
      });
  });


  return app;
};
