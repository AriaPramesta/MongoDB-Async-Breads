var express = require('express');
const { ObjectId } = require('mongodb');

module.exports = function (db) {
    const router = express.Router({ mergeParams: true });
    const Todos = db.collection('todos');

    router.get('/', async (req, res, next) => {
        try {
            const userId = new ObjectId(req.params.userId);
            const todos = await Todos.find({ userId }).toArray();
            res.status(200).json(todos)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    });

    router.post('/', async (req, res) => {
        try {
            const { title } = req.body

            if (!title) {
                throw Error("Title is required!")
            }

            const deadline = new Date()
            deadline.setDate(deadline.getDate() + 1)

            const todo = {
                title,
                deadline,
                complete: false,
                userId: new ObjectId(req.params.userId)
            }

            const result = await Todos.insertOne(todo)
            const insertedTodo = await Todos.findOne({ _id: result.insertedId })

            res.status(201).json(insertedTodo)

        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    })


    return router;
}
