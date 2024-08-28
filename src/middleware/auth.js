const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    jwt.verify(token, process.env.SECRET, (error, user) => {
        if (error) {
            res.status(401).json({ msg: 'Token is not valid' });
        }
        req.user = user;
        next()
    });

};
