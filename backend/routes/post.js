const express = require('express');

const {body} = require('express-validator');

const router = express.Router()
let multer = require('multer');
let upload = multer();

const postController = require('../controllers/post')

router.post(
    '/',
    upload.any(),
    postController.post  
);

router.get('/', postController.getPosts);
//todo
router.get('/:id', postController.getPost);
router.get('/user/:id', postController.getPostsByUser);

router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

router.post('/:id/like', postController.likePost);
router.post('/:id/unlike', postController.unlikePost);
router.get('/:id/likes', postController.getLikes);
router.get('/:id/liked', postController.getLiked)

router.post('/:id/comment', postController.commentPost);
router.delete('/:id/comment/:comment_id', postController.deleteComment);
router.put('/:id/comment/:comment_id', postController.updateComment);
router.get('/:id/comments', postController.getComments);

module.exports = router;