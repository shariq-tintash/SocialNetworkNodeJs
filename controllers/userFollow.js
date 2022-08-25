const ApiError = require('../errors/apiError');
const User = require('../models/user');

exports.getFollowers = (req, res, next) => {
	User.findById(req.userId)
			.then(user => {
				res.status(200).json({ message: 'Followers fetched.', followers: user.followers });
			})
			.catch(err => {
				next(err)
			})
};

exports.getFollowing = (req, res, next) => {
	User.findById(req.userId)
			.then(user => {
				res.status(200).json({ message: 'Followings fetched.', following: user.following });
			})
			.catch(err => {
				next(err)
			})
};

exports.followUser = (req, res, next) => {
	const newFollower=req.body.userId;
	User.findById(newFollower)
			.then(user => {
				if(!user){
					throw ApiError.notFound("Could not find User");
				}
				if(user.followers.includes(req.userId)){
					throw ApiError.badRequest("Already Followed");
				}
				user.followers.push(req.userId);
				return user.save();
			})
			.then(result => {
				return User.findById(req.userId);
			})
			.then(currUser =>{
				currUser.following.push(newFollower);
				currUser.save();
				res.status(201).json({ message: 'User Followed.'});
			})
			.catch(err => {
				next(err)
			})
};

exports.deleteFollwer = (req, res, next) => {
	const newFollower=req.body.userId;
	if(newFollower==req.userId){
		throw ApiError.badRequest("Bad Request");
	}
	User.findById(newFollower)
			.then(user => {
				if(!user){
					throw ApiError.notFound("Could not find User");
				}
				if(!user.following.includes(req.userId)){
					throw ApiError.badRequest("User not following");
				}
				user.following.pull(req.userId);
				return user.save();
			})
			.then(result => {
				return User.findById(req.userId);
			})
			.then(currUser =>{
				currUser.followers.pull(newFollower);
				currUser.save();
				res.status(201).json({ message: 'User removed from followers.'});
			})
			.catch(err => {
				next(err)
			})
};

exports.deleteFollowing = (req, res, next) => {
	const oldFollower=req.body.userId;
	if(oldFollower==req.userId){
		throw ApiError.badRequest("Bad Request");
	}
	User.findById(req.userId)
			.then(user => {
				if(!user.following.includes(oldFollower)){
					throw ApiError.badRequest("Not following User");
				}
				user.following.pull(oldFollower);
				return user.save();
			})
			.then(result => {
				return User.findById(oldFollower);
			})
			.then(oldUser =>{
				oldUser.followers.pull(req.userId);
				oldUser.save();
				res.status(201).json({ message: 'User unfollowed.'});
			})
			.catch(err => {
				next(err)
			})
};