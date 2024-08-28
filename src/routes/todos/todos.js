const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo } = require('../../config/db.js');

function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

router.get('/', async (req, res, next) => {
    try {
        const all_todos = await db.act('SELECT * FROM todo');
        all_todos.forEach(todo => {
            todo.created_at = formatDate(todo.created_at);
            todo.due_time = formatDate(todo.due_time);
        });
        res.status(200).json(all_todos)
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await db.act(`SELECT * FROM todo WHERE id = ${id}`);

        if (result.length == 0)
            res.status(404).json({ msg: 'Not found' });
        else {
            result[0].due_time = formatDate(result[0].due_time);
            result[0].created_at = formatDate(result[0].created_at);
            res.status(200).json(result[0]);
        }
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { title, description, due_time, user_id, status } = req.body;
        if (!title || !description || !due_time || !user_id || !status) {
            return res.status(400).json({ msg: "Bad parameters" })
        }


        const result = await db.act('INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)', [title, description, due_time, user_id, status]);

        const todo_row = await db.act('SELECT * FROM todo WHERE id = ?', [result.insertId]);
        todo_row[0].due_time = formatDate(todo_row[0].due_time);
        todo_row[0].created_at = formatDate(todo_row[0].created_at);
        res.status(201).json(todo_row[0]);
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const id = req.body.user_id;
        const userId = req.user.id;

        // if (id != userId) {
        //     return res.status(401).json({ msg: 'Token is not valid' });
        // }

        const { title, description, due_time, user_id, status } = req.body;
        if (!title || !description || !due_time || !user_id || !status) {
            return res.status(400).json({ msg: "Bad parameters" })
        }

        const id_exists = await db.act('SELECT * FROM todo WHERE id = ?', [req.params.id]);
        if (id_exists.length == 0) {
            return res.status(404).json({ msg: "Not found" })
        }

        const update_result = await db.act('UPDATE todo SET title = ?, description = ?, due_time = ?, user_id = ?, status = ? WHERE id = ?', [title, description, due_time, user_id, status, req.params.id]);
        const result = await db.act('SELECT * FROM todo WHERE id = ?', [req.params.id]);

        result[0].due_time = formatDate(result[0].due_time);
        result[0].created_at = formatDate(result[0].created_at);
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const todoId = await db.act('SELECT user_id FROM todo WHERE id = ?', [req.params.id]);
        const userId = req.user.id;

        // if (todoId[0].user_id != userId) {
        //     return res.status(401).json({ msg: 'Token is not valid' });
        // }

        const id_found = await db.act('DELETE FROM todo WHERE id = ?', [req.params.id]);
        // error handling not found
        if (id_found.affectedRows == 0) {
            return res.status(404).json({ msg: 'Not found' });
        }
        res.status(200).json({ msg: `Successfully deleted record number: ${req.params.id}` });
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;