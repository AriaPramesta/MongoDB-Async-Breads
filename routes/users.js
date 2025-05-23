var express = require('express');
const { ObjectId } = require('mongodb');
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

  router.get('/:id', async function (req, res, next) {
    try {
      const { id } = req.params
      const _id = new ObjectId(id)
      const user = await User.findOne({ _id })
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  });

  router.post('/', async function (req, res, next) {
    try {
      const { name, phone } = req.body
      const data = await User.insertOne({ name, phone });
      const user = await User.findOne({ _id: data.insertedId })
      res.status(201).json(user)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  });

  router.put('/:id', async function (req, res, next) {
    try {
      const { id } = req.params
      const _id = new ObjectId(id)
      await User.updateOne({ _id }, { $set: req.body });
      const user = await User.findOne({ _id })
      res.status(201).json(user)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

  router.delete('/:id', async function (req, res, next) {
    try {
      const { id } = req.params
      const _id = new ObjectId(id)
      const user = await User.findOne({ _id })

      if (!user) throw Error("User not exist!")
      await User.deleteOne({ _id });

      res.status(201).json(user)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

  return router;
}
