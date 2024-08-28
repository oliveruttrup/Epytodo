const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');


router.post('/register', async function (req, res, next) {
    try {
        const found = await db.act('SELECT * FROM user WHERE email = ?', [req.body.email]);
        if (found.length != 0) {
            return res.status(409).json({ msg: "Account already exists" });
        } else {
            // generate a secret key for encryption to store on db
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const result = await db.act('SELECT * FROM user WHERE email = ?', [req.body.email]);
            const token = jwt.sign({ email: req.body.email, id: result.id }, process.env.SECRET, { expiresIn: '5h' });
            const insert_user = await db.act('INSERT INTO user (email, password, name, firstname, token) VALUES (?, ?, ?, ?, ?)', [req.body.email, hashedPassword, req.body.name, req.body.firstname, token])

            res.status(201).json({ token: token });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const result = await db.act('SELECT * FROM user WHERE email = ?', [req.body.email]);
        const match = await bcrypt.compare(req.body.password, result[0].password);
        if (!match) {
            throw new Error('Invalid Credentials');
        }
        const token = jwt.sign({ email: result[0].email, id: result[0].id }, process.env.SECRET, { expiresIn: '5h' });
        const result2 = await db.act('UPDATE user SET token = ? WHERE email = ?', [token, req.body.email]);
        res.status(200).json({ token: token });
    } catch (error) {
        res.status(401).json({ msg: 'Invalid Credentials' });
    }
});

module.exports = router;
