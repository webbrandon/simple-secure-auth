// Get the database(db) configuration & functions.
var db = require('./config');

// C.R.U.D. functions.
var C = require('./create');
var R = require('./read');
var U = require('./update');
var D = require('./delete');

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

module.exports.getUser = function(email, cb){
  db.open();
  R.email(email, function(err, data){
    db.close();
    if(err){return cb(err, null);}
  
    return cb(null, data);
  });
};

module.exports.signin = function(sess, userObj, cb){
  db.open();
  R.verify(userObj, function(err, data){
    db.close();
    if(err){return cb(err, null);}
    
    sess.user = data;
    return cb(null, data);    
  });
};

module.exports.signout = function(sess, cb){
	sess.destroy(function(err){
		if(err){return cb(err, null);}
		
		return cb(null, 'Session Destroyed');
	});
};

module.exports.updateUser = function(sess, userObj, cb){
  db.open();
  U(userObj, function(err, data){
    db.close();
    if(err){return cb(err, null);}
  
    sess.user = data;
    return cb(null, data);
  });
};

module.exports.deleteUser = function(sess, id, cb){
  db.open();
  D(id, function(err, data){
    db.close();
    if(err){return cb(err, null);}
  
    delete sess.user;
    sess.user = {type: 'guest', firstname: 'Guest', lastname: 'User'};
    return cb(null, data);
  });
};

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
