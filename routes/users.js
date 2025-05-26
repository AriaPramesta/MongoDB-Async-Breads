var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

module.exports = function (db) {
  const User = db.collection('users');
  router.get('/', async function (req, res, next) {
    try {
      const { search, page = 1, sortMode = "asc", sortBy = "name", limit: limitQuery = "all" } = req.query

      params = {}

      if (search && search.trim() !== "") {
        params = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
          ]
        }
      }

      const count = await User.countDocuments(params)

      const allowedLimits = ["5", "10", "all"]
      const isValidLimit = allowedLimits.includes(limitQuery)

      const safeLimit = isValidLimit ? limitQuery : "all"

      let limit
      if (safeLimit === "all") {
        limit = count
      } else {
        limit = parseInt(safeLimit)
      }

      const offset = limit * (page - 1)
      const pages = Math.ceil(count / limit)

      const sortParams = {}
      sortParams[sortBy] = sortMode === "asc" ? 1 : -1

      const users = await User.find(params).sort(sortParams).limit(limit).skip(offset).toArray();

      res.status(200).json({
        data: users,
        total: count,
        pages,
        page,
        limit,
        offset
      })
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

  const todosRouter = require('./todos')(db);
  router.use('/:userId/todos', todosRouter);

  return router;
}
