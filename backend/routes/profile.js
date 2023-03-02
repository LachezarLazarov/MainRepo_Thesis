const express = require('express');
const db = require("../models");
const router = express.Router()
const User = db.user;
const authController = require('../controllers/auth')

router.get('/:id',  async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        const userObj = {
            id: user.id,
            username: user.username,
            email: user.email,
        }
        res.status(200).json({ message: 'User fetched.', user: userObj });
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
});

module.exports = router;