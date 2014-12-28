module.exports = function (data) {
  var express = require('express');
  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index', { profile: req.session.user, title: 'Express' });
  });

  return router;
};
