const { validationResult } = require('express-validator');
const uuid= require('uuid');
const  aws = require('@aws-sdk/client-s3');
const jwt = require("jsonwebtoken");

const db = require("../models");
const Post = db.post;
const Like = db.like;
const Comment = db.comment;
const User = db.user;

const REGION = "eu-north-1";
const s3Client = new aws.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: REGION
});
// Create an Amazon S3 service client object.
exports.post = async(req, res, next) => {
    try {
        const userId = jwt.verify(req.session.token, process.env.COOKIE_SECRET);
        const id = uuid.v4();        
        const fileKeys = Object.keys(req.files);
        fileKeys.forEach(async key => {
            const bucketParams = {
            Bucket: "thesis-image-storage",
            Key: `${id}/${req.files[key].originalname}`,
            Body: req.files[key].buffer,
            ContentLength: req.files[key].size,
            ContentType: req.files[key].mimetype,
            };
            await s3Client.send(new aws.PutObjectCommand(bucketParams));
        });
        // upload to aws
        const url = `https://thesis-image-storage.s3.${REGION}.amazonaws.com/${id}`;
        const tmp = JSON.parse(req.body.location);
        const point = { type: 'Point', coordinates: [tmp.lat, tmp.lng]};
        const post = await Post.create({
            id: id,
            title: req.body.title,
            content: req.body.content,
            location: point,
            images: url,
            userId: userId.id
        });
        res.status(2000).json({message: 'Post created', post: post});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getPosts = async(req, res, next) => {
    try {
        const posts = await Post.findAll();
        const promises = posts.map(async post => {
            const bucketParams = {
                Bucket: "thesis-image-storage",
                Prefix: `${post.id}/`
            };
            const user = await User.findOne({ where: { id: post.userId } });
            const response = await s3Client.send(new aws.ListObjectsCommand(bucketParams));
            const images = [];
            response.Contents.forEach((item) => {
                images.push(`https://thesis-image-storage.s3.${REGION}.amazonaws.com/${item.Key}`);
            });
            const postObj = post.toJSON();
            postObj.images = images;
            postObj.user = user;
            return postObj;
        });
        Promise.all(promises).then((data) => {
            res.status(200).json({ message: 'Posts fetched', posts: data });
        });
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        const bucketParams = {
            Bucket: "thesis-image-storage",
            Prefix: `${post.id}/`
        };
        const user = await User.findOne({ where: { id: post.userId } });
        const response = await s3Client.send(new aws.ListObjectsCommand(bucketParams));
        const images = [];
        response.Contents.forEach((item) => {
            images.push(`https://thesis-image-storage.s3.${REGION}.amazonaws.com/${item.Key}`);
        });
        const postObj = post.toJSON();
        postObj.images = images;
        postObj.user = user;
        res.status(200).json({message: 'Post fetched', post: postObj});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updatePost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });

        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        const userId = jwt.verify(req.session.token, process.env.COOKIE_SECRET);
        if (post.userId !== userId.id) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('Validation failed, entered data is incorrect');
            error.statusCode = 422;
            throw error;
        }
        post.title = req.body.title;
        post.content = req.body.content;
        const tmp = JSON.parse(req.body.location);
        const point = { type: 'Point', coordinates: [tmp.lat, tmp.lng] };
        post.location = point;
        const result = await post.save();
        res.status(200).json({message: 'Post updated', post: result});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });
        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        const userId = jwt.verify(req.session.token, process.env.COOKIE_SECRET);
        if (post.userId !== userId.id) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        await post.destroy();
        res.status(200).json({message: 'Post deleted'});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getPostsByUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const posts = await Post.findAll({ where: { userId: userId } });
        const promises = posts.map(async post => {
            const bucketParams = {
                Bucket: "thesis-image-storage",
                Prefix: `${post.id}/`
            };
            const response = await s3Client.send(new aws.ListObjectsCommand(bucketParams));
            const images = [];
            response.Contents.forEach((item) => {
                images.push(`https://thesis-image-storage.s3.${REGION}.amazonaws.com/${item.Key}`);
            });
            const postObj = post.toJSON();
            postObj.images = images;
            return postObj;
        });
        Promise.all(promises).then((data) => {
            res.status(200).json({ message: 'Posts fetched', posts: data });
        });
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.likePost = async (req, res, next) => {
    try {
        console.log(req.session);
        const userId = jwt.verify(req.session.token, process.env.COOKIE_SECRET);
        const post = await Post.findOne({ where: { id: req.params.id } });
        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        if (!userId) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        const like = await Like.create(
            {
                userId: userId.id,
                postId: req.params.id,
            }
        );
        res.status(200).json({message: 'Post liked', like: like});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.unlikePost = async (req, res, next) => {
    try {
        const userId = jwt.verify(req.session.token, process.env.COOKIE_SECRET);
        const post = await Post.findOne({ where: { id: req.params.id } });
        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }

        const like = await Like.findOne({ where: { userId: userId.id, postId: req.params.id } });
        if(!like){
            const error = new Error('Like not found');
            error.statusCode = 404;
            throw error;
        }
        await like.destroy();
        res.status(200).json({message: 'Post unliked'});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getLikes = async (req, res, next) => {
    try {
        const likes = await Like.findAll({ where: { postId: req.params.id } });
        res.status(200).json({message: 'Likes fetched', likes: likes});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}   

exports.getLiked = async (req, res, next) => {
    try {
        const userId = jwt.verify(req.session.token, process.env.COOKIE_SECRET);
        const likes = await Like.findAll({ where: { userId: userId.id, postId: req.params.id } });
        const liked = likes?.length > 0 ? true : false;
        res.status(200).json({ message: 'Liked posts fetched', liked: liked });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.commentPost = async (req, res, next) => {
    try {
        const userId = jwt.verify(req.session.token, process.env.COOKIE_SECRET);
        const post = await Post.findOne({ where: { id: req.params.id } });
        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        if (!userId) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        console.log(req.body.comment);
        const comment = await Comment.create(
            {
                userId: userId.id,
                postId: req.params.id,
                comment: req.body.comment
            }
        );
        res.status(200).json({message: 'Post commented', comment: comment});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteComment = async (req, res, next) => {
    try {
        const userId = jwt.verify(req.session.token, process.env.COOKIE_SECRET);
        const comment = await Comment.findOne({ where: { id: req.params.id } });
        if(!comment){
            const error = new Error('Comment not found');
            error.statusCode = 404;
            throw error;
        }
        if (comment.userId !== userId.id) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        await comment.destroy();
        res.status(200).json({message: 'Comment deleted'});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateComment = async (req, res, next) => {
    try {
        const userId = jwt.verify(req.session.token, process.env.COOKIE_SECRET);
        const comment = await Comment.findOne({ where: { id: req.params.id } });
        if(!comment){
            const error = new Error('Comment not found');
            error.statusCode = 404;
            throw error;
        }
        if (comment.userId !== userId.id) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        comment.comment = req.body.comment;
        const result = await comment.save();
        res.status(200).json({message: 'Comment updated', comment: result});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getComments = async (req, res, next) => {
    try {
        const comments = await Comment.findAll({ where: { postId: req.params.id } });
        const promises = comments.map(async (comment) => {
            const user = await User.findOne({ where: { id: comment.userId } });
            return {
                id: comment.id,
                comment: comment.comment,
                postId: comment.postId,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                user: user
            }
        });
        const commentsWithUser = await Promise.all(promises);
        res.status(200).json({message: 'Comments fetched', comments: commentsWithUser});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}