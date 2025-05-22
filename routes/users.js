var express = require('express');
var router = express.Router();

module.exports = function (db) {
  const User = db.collection('users');
  router.get('/', async function (req, res, next) {
    try {
      const users = await User.find({}).toArray();
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  });

  return router;
}
