var mongo  = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = mongo.Schema({
    email:      {type: String, lowercase: true, required: true, sparse: true, unique:true},
    firstname:  {type: String, required: true},
    lastname:   {type: String, required: true},
    password:   {type: String, required: true},
    type:       {type: String, required: true}
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.methods.validPassword = function(password) {	
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.getData = function(){
	return {
	  id: 		    this._id,
	  email:      this.email,
	  firstname:  this.firstname,
	  lastname:   this.lastname,
	  type:       this.type
	};
};

module.exports = mongo.model('User', UserSchema);
