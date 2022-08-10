const express = require('express');
const { body } = require('express-validator');
const feedController = require('../controllers/moderatorFeed');


const router = express.Router();

// GET /moderator/feed/posts
router.get('/posts',feedController.getPosts);

// GET /moderator/feed/post/:postId
router.get('/post/:postId',feedController.getPost);

// PUT /moderator/feed/post/:postId
router.put(
	'/post/:postId',
	[
		body('title')
		.trim()
		.isLength({ min: 5 }),
		body('content')
		.trim()
		.isLength({ min: 5 })
	],
	feedController.updatePost
);

// DELETE /feed/post/:postId
router.delete('/post/:postId',feedController.deletePost);

module.exports = router;