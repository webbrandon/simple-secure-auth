# MongoDB using Mongoose
MongoDB is a popular noSQL solution for a database management system that works well with Agile development principles.  In short it give developers the flexibility to change or add to our model as they innovate their ideas.   Node.js and MongoDB need to communicate in order for us to carry out our application requirements and in order to make writing validation, casting and business logic boilerplates simple the package called Mongoose can be used.  

Some engineers may be asking why the not use the MongoDB package for Node.js?  The answer is Mongoose is backed by the MongoDB team in addition to their native bindings package. Each package provides special characteristics for different sets of requirements. Our requirements for the CRM allow the more simplistic and capability driven package, Mongoose.

Add the following to `dependencies` of the `package.json` file before you start:

```json
"mongoose": "~3.8.17"
```

## Defining Schema and Code Structure
When working with a DBMS its is a good idea to make sure it can meet the requirements of you CRUD endpoints.  What this means is the DBMS can effectively receive a specific request  that triggers a specific response.  

Before we start writing code we need to facilitate a file structure that helps us reuse and test code efficiently and separates data that is consistently used like models and configuration settings.  In this lesson we choose to separate code into sub-folders that represent object oriented concepts.  Folders that are going to generated though this tutorial in `./data/user` will be `config`, `model`, `create`, `read`, `update` and `delete`, each to contain an `index.js` file.  

Looking to what data is being transacted, begin making decisions on how to apply CRUD endpoints.  This will be a simple object schema with fields for:

  * User Identification (MongoDB Object ID)
  * First Name (String)
  * Last Name (String)
  * Email (String)
  * Password (String)

We use this to create a user model that will be placed in the file `./data/user/models/user.js`:

```node
// Data File: user/models/user.js
var mongo  = require('mongoose');

var UserSchema = mongo.Schema({
    email:      {type: String, lowercase: true, required: true, sparse: true, unique:true},
    firstname:  {type: String, required: true},
    lastname:   {type: String, required: true},
    password:   {type: String, required: true},
    type:       {type: String, required: true}
});

UserSchema.methods.getData = function(){
	return {
	  id: 	       this._id,
	  email:      this.email,
	  firstname:  this.firstname,
	  lastname:   this.lastname,
	  type:       this.type
	};
};

module.exports = mongo.model('User', UserSchema);
```

Moving on create the function that will open a connection to the CRM application.  One thing that needs to be done is to open a MongoDB connection to communicate the create request.  In the file `./data/user/config/index.js` add database configurations that will be used for connecting to the user database.

```node
// Data File: user/config/index.js
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
```

Now bring everything together to begin adding export functions that will allow the application to use.

```node
// Data File: user/index.js
// Get the database(db) configuration & functions.
var db = require('./config');

// C.R.U.D. functions.
var C = require('./create');
var R = require('./read');
var U = require('./update');
var D = require('./delete');
```

## Create & Secure User Object
It is a good idea to encrypt sensitive information that only the user should know or see such as the password in our user object model.  To do this a package called Bcrypt will be used that allows people to apply the popular key derivation function (KDF) for password encryption designed by Niels Provos and David Mazières.  To do this open the user model created earlier.  The current state of the `package.json` file should look like this after adding the Bcrypt package:

```json
{
  "name": "simple-secure-auth",
  "version": "0.3.3",
  "private": true,
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "~4.9.0",
    "express-session": "~1.9.1",
    "node-uuid": "~1.4.1",
    "mongoose": "~3.8.17",
    "bcrypt" : "~0.8.0",
    "body-parser": "~1.8.1",
    "cookie-parser": "~1.3.3",
    "morgan": "~1.3.0",
    "serve-favicon": "~2.1.3",
    "debug": "~2.0.0",
    "jade": "~1.6.0"
  }
}
```

Utilizing callback functions helps provide a layer of separation or requirements in our data interaction.  Using the structure previously defined create a generic connection for creating a new user in the database in the `./data/user/create/index.js` file.  

```node
// Data File: user/create/index.js
var User = require('./../models/user');

module.exports = function(user, cb){
	if(!user.password){return cb('Missing User Password', null);}
	if(!user.email){return cb('Missing User Email', null);}
	if(!user.firstname){return cb('Missing User First Name', null);}
	if(!user.lastname){return cb('Missing User Last Name', null);}
	
	var hasher = new User();
	var password = hasher.generateHash(user.password);
	var type     = user.type   ? user.type   : 'general';
	
	var userObj  = new User({
	    email:      user.email,
	    firstname:  user.firstname,
	    lastname:   user.lastname,
	    password:   password,
	    type:       type
	});
	
	userObj.save(function (err) {
        if (err){
        	return cb(err, null);
        }
        return cb(null, userObj.getData());
    });
};
```

Now that everything is in place to create a secured user object expose the application to it.  In the `./data/user/index.js` file create a exports function that will open the database, creates  user object if the email address doesn't exist.  

```node
module.exports.createUser = function(sess, userObj, cb){
  db.open();
  C(userObj, function(err, data){
    db.close();
    if(err){return cb(err, null);}
    
    delete sess.user;
    sess.user = data;
    console.log('User Created');
    return cb(null, data);
  });
};
```

Call this exports function in the `./routes/user.js` file at the create user route and a function that will call the form fields we created while making the interface.  

```node
  var getUser = function(req){
    var obj = {};
    if(req.body.id){
      obj.id = req.body.id; 
    }
    if(req.body.first){
      obj.firstname = req.body.first; 
    }
    if(req.body.last){
      obj.lastname = req.body.last; 
    }
    
    if(req.body.user){
      obj.email = req.body.user;
    }
    if(req.body.password){
      obj.password = req.body.password;
    }
    return obj;
  };

  /* Create user. */
  router.post('/create', function(req, res) {
    var userObj = getUser(req);
    var sess = req.session;
    
    data.user.createUser(sess, userObj, function(err, data){
      if(err){
        // If an error or incorrect entry is made send user back to homepage.
        console.error(err);
        res.redirect('/');
      } else {
        res.redirect('/user');
      }
    });
  });
```

In the example the user session is passed to this request so they are signed in if successful in creating an account but this is not necessary, just remove the `sess` value from being passed and used.  If you decide to keep this functionality it will require the use of the `grant` exported function discussed in the next section.

## Read & Verify User Object
Like utilizing callback functions for the creating a user object, do so again with for the read and verify There will be three required functions to begin the authentication process.  First need to verify the user against submitted credentials, then want to create a id check for pages that only the use should see(The point of the authentication process).  Since in the last step of the example sends want to send the user  to their profile you want to make sure the information being edited is current(e. g. An administrator edits their profile.).  In `./data/user/read/index.js` file create three exported functions.
  
```node
// Data File: user/read/index.js
var User  = require('./../models/user');

module.exports.email = function(email, cb){
	User
		.findOne({email: email})
		.exec(function(err, user){
			if(err){return cb(err, null);}
			if(!user){return cb('No User Email: ' + email, null);}

			return cb(null, user.getData());
		});	
};

module.exports.verify = function(userObj, cb){
	User
		.findOne({email: userObj.email})
		.exec(function(err, user){
			if(err){return cb(err, null);}
			if(!user.validPassword(userObj.password)){
				return cb('Invalid User / Password', null);
			}			
			return cb(null, user.getData());
		});	
};

module.exports.isUser = function(id, cb){
	User
		.findOne({_id: id})
		.exec(function(err, user){
			if(err){return cb(false);}
			if(user != undefined){
				return cb(true);
			}	else {
			  return cb(false);
			}
		});	
};
```

In the `./data/user/index.js` file create a exports function that will open the database, read  user object database and verify user password and login credentials.  

```node
module.exports.signin = function(sess, userObj, cb){
  db.open();
  R.verify(userObj, function(err, data){
    db.close();
    if(err){return cb(err, null);}
    
    sess.user = data;
    return cb(null, data);    
  });
};
```

When making the connection between `isUser` function and the application, use the default Node.js export object structure `req, res, next` and place in a export function called `grant`.  

```node
module.exports.grant = function(req, res, next){
  db.open();
  R.isUser(req.session.user.id, function(isTrue){
    db.close();
    if(isTrue){
      next();
    } else {
      var backURL;
			backURL=req.header('Referer') || '/';
			res.redirect(backURL);
    }
  }); 
};
```

The last export function that needs to be included in the `./data/user/index.js` will return the current user profile.  This is done to illustrate a point of applying administrative abilities to the CRM if desired.  By sending the current database object the user can make sure they get current database info that represents them.  This is important because if a user profile is for some reason edited by a administrator  like the account status the session object they may have loaded two days ago won't misrepresent the data.  Another  reason to pass a different profile object instead of the user session object is to allow the administration to use the same templates. 

```node
module.exports.getUser = function(email, cb){
  db.open();
  R.email(email, function(err, data){
    db.close();
    if(err){return cb(err, null);}
  
    return cb(null, data);
  });
};
```

Call these export functions into the proper route in the `./routes/users.js` file.  When using `grant`, place it in between the route request and  the callback function of the route requiring user authentication.  The user session object must be passed for these processes.

```node
module.exports = function (data) {
  var express = require('express');
  var router = express.Router();
  
  var getUser = function(req){
    var obj = {};
    if(req.body.id){
      obj.id = req.body.id; 
    }
    if(req.body.first){
      obj.firstname = req.body.first; 
    }
    if(req.body.last){
      obj.lastname = req.body.last; 
    }
    
    if(req.body.user){
      obj.email = req.body.user;
    }
    if(req.body.password){
      obj.password = req.body.password;
    }
    return obj;
  };

  /* Create user. */
  router.post('/create', function(req, res) {
    var userObj = getUser(req);
    var sess = req.session;
    
    data.user.createUser(sess, userObj, function(err, data){
      if(err){
        console.error(err);
        res.redirect('/');
      }
      res.redirect('/user');
    });
  });
  
  /* Read users authentication listing. */
  router.get('/', data.user.grant, function(req, res) {
    data.user.getUser(req.session.user.email, function(err, data){
      if(err){
        console.error(err);
        res.redirect('/');
      }
      res.render('user/index', {profile: req.session.user, title:'Profile ' + data.email, user: data});
    });
  }).post('/', function(req, res) {
    var userObj = getUser(req);
    var sess = req.session;
    
    data.user.signin(sess, userObj, function(err, data){
      if(err){
        console.error(err);
        res.redirect('/');
      }
      res.redirect('/user');
    });
  });
  return router;
};
```

## Update Object
This a much simpler process to conduct than other CRUD principles that are being used in these lessons thanks to the preparation of data being in earlier lessons.  In `./data/user/read/index.js` file there will be one exported function that utilizes callback functionality.
  
In the `./data/user/index.js` file create a exports function that will open the database, update and verify.  Call the function in the `./routes/users.js` file.  This does require the `grant` component.  The user session object must be passed for these processes.

## Delete Object


