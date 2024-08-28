const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const commands = require("./user.query.js")
const bcrypt = require('bcryptjs');

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

router.get('/user', async (req, res, next) => {
    if (!req.user.id) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const user = await db.act('SELECT * FROM user WHERE id = ?', [userId]);
    if (user.length == 0) {
        return res.status(404).json({ msg: 'Not found' });
    }
    delete user[0].token;
    user[0].created_at = formatDate(user[0].created_at);
    res.status(200).json(user[0]);
});

router.get('/users/:id', async (req, res, next) => {
    try {
        const reg = new RegExp('^[0-9]+$');
        if (reg.test(req.params.id)) {
            const id = req.params.id;
            const result = await db.act(`SELECT * FROM user WHERE id = ${id}`);
            if (result.length == 0)
                return res.status(404).json({ msg: 'Not found' });
            else {
                delete result[0].token;
                result[0].created_at = formatDate(result[0].created_at);
                return res.status(200).json(result[0]);
            }
        } else {
            const email = req.params.id;

            const result_mail = await db.act('SELECT * FROM user WHERE email = ?', [email]);
            if (result_mail.length == 0)
                return res.status(404).json({ msg: 'Not found' });
            else {
                delete result_mail[0].token;
                result_mail[0].created_at = formatDate(result_mail[0].created_at);
                return res.status(200).json(result_mail[0]);
            }
        }
        }
    catch (error) {
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

router.put('/users/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const { email, password, firstname, name } = req.body
        if (!email || !password || !firstname || !name) {
            return res.status(400).json({ msg: "Bad parameters" })
        }

        const id_exists = await db.act('SELECT * FROM user WHERE id = ?', [id]);
        if (id_exists.length == 0) {
            return res.status(404).json({ msg: "Not found" })
        }

        const user_exists = await db.act('SELECT * FROM user WHERE email = ? AND id != ?', [email, id]);
        if (user_exists.length != 0) {
            return res.status(404).json({ msg: "Account already exists" })
        }

        // if (id != userId) {
        //     return res.status(401).json({ msg: 'Token is not valid' });
        // }

        
        const hashedPassword = await bcrypt.hash(password, 10);
        const update_result = await db.act('UPDATE user SET email = ?, password = ?, firstname = ?, name = ? WHERE id = ?', [email, hashedPassword, firstname, name, id]);
        const result = await db.act('SELECT * FROM user WHERE id = ?', [req.params.id]);
        delete result[0].token;
        result[0].created_at = formatDate(result[0].created_at);
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.delete('/users/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        // if (id != userId) {
        //     return res.status(401).json({ msg: 'Token is not valid' });
        // }
        // error handling
        const found_id = await db.act('SELECT * FROM user WHERE id = ?', [id]);
        if (found_id.length == 0) {
            return res.status(404).json({ msg: 'Not found' });
        }

        await db.act('DELETE FROM todo WHERE user_id = ?', [id]);
        await db.act('DELETE FROM user WHERE id = ?', [id]);

        res.status(200).json({ msg: `Successfully deleted record number: ${req.params.id}` });
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
