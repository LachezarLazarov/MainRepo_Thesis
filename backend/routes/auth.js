const express = require('express');
const { auth } = require("../middleware");
const {body} = require('express-validator');

const router = express.Router()

const authController = require('../controllers/auth')

router.post(
    '/signup',
    [
        body('name').trim().not().isEmpty(),
        body('email').isEmail().withMessage('Please enter a valid email.'),
        body('password').trim().isLength({ min: 7 }),
        auth.checkDuplicateUsernameOrEmail
    ], 
    authController.signup  
);

router.post('/login', authController.signin);

router.post('/logout', authController.signout);

module.exports = router;