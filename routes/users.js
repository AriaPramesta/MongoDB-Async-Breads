var express = require('express');
var router = express.Router();

module.exports = function (db) {
  const User = db.collection('users');
  router.get('/', function (req, res, next) {
    res.send('respond with a resource');
  });

  return router;
}
