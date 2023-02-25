const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");

const Post = require('../models/user');
const User = require('../models/user');
exports.post = async(req, res, next) => {
    try{
        console.log(req.body);
        // upload to aws
        await Post.create({
            title: req.body.title,
            content: req.body.content,
            images: req.body.images,
          });
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}