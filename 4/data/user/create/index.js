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
