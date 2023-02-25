const express = require('express');

const {body} = require('express-validator');

const router = express.Router()

const postController = require('../controllers/post')

router.post(
    '/',
    postController.post  
);

module.exports = router;