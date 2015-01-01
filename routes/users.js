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

  router.get('/signout', data.user.grant, function(req, res) {
    var sess = req.session;
    
    data.user.signout(sess, function(err, data){
      if(err){
        console.error(err);
        res.redirect('/');
      }
      res.redirect('/');
    });
  });

  /* Update user. */
  router.post('/update', data.user.grant, function(req, res) {
    var userObj = getUser(req);
    var sess = req.session;
    
    data.user.updateUser(sess, userObj, function(err, data){
      if(err){
        console.error(err);
        res.redirect('/');
      }
      res.redirect('/user');
    });
  });

  /* Delete user. */
  router.post('/delete', data.user.grant, function(req, res) {
    var id = req.body.id;
    var sess = req.session;
    
    data.user.deleteUser(sess, id, function(err, data){
      if(err){
        console.error(err);
        res.redirect('/');
      }
      res.redirect('/');
    });
  });

  return router;
};
