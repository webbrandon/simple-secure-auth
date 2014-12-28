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
