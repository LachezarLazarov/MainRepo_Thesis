const express = require('express');

const {body} = require('express-validator');

const router = express.Router()

const Post = require('../models/user');

const postController = require('../controllers/post')

router.post(
    '/post',
    [
        body('post').trim().not().isEmpty(),
        body('location').trim().not().isEmpty(),
    ], 
    authController.post  
);

router.post('/login', authController.login);

module.exports = router;