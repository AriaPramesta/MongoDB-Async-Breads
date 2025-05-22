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

  router.post('/', async function (req, res, next) {
    try {
      const { username, phone } = req.body
      const data = await User.insertOne({ username, phone });
      const user = await User.findOne({ _id: data.insertedId })
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  });

  return router;
}
