const express = require('express');
const userFollow = require('../controllers/userFollow');

const router = express.Router();

// GET /account/followers
router.get(
    '/followers',
    userFollow.getFollowers
    );

// GET /account/following
router.get(
    '/following',
    userFollow.getFollowing
    );

// PUT /account/followers
router.put(
	'/followers',
	userFollow.followUser
    );

// DELETE /account/unfollow
router.delete(
    '/unfollow',
    userFollow.deleteFollowing
    );

// DELETE /account/followers
router.delete(
    '/followers',
    userFollow.deleteFollwer
    );
module.exports = router;