const ApiError = require('../errors/ApiError');
const Post = require('../models/post');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const io = require('../socket');

exports.getPosts = (req, res, next) => {
	const currentPage = req.query.page || 1;
	const perPage = 4;  //per page 4 posts only
	let totalItems;
	let currUser;
	User.findById(req.userId).then(user => {
		currUser=user;
		return user;
	})
	.then(user => {

		// check for paid user
		if(!user.isPaid){
			throw ApiError.unAuthorized("Not Authotized");
		}
		
		return Post.find({creator :{ "$in" : user.following}}).countDocuments();
	})
	.then(count => {
		totalItems = count;
		return Post.find({creator :{ "$in" : currUser.following}})
			.populate('creator', ['name'])
			.sort({ createdAt: -1 })
			.skip((currentPage - 1) * perPage)
			.limit(perPage);
	})
	.then(posts => {
		res.status(200).json({
			message: 'Fetched posts successfully.',
			posts: posts,
			totalItems: totalItems
		});
	})
	
	.catch(err => {
		next(err);
	});  
};

exports.createPost = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		next(ApiError.unprocessable(errors.array()))
	}
	const title = req.body.title;
	const content = req.body.content;
	let creator;
	const post = new Post({
		title: title,
		content: content,
		creator: req.userId
	});
	post
		.save()
		.then(result => {
			return User.findById(req.userId);
		})
		.then(user => {
			creator = user;
			user.posts.push(post);
			return user.save();
		})
		.then(result => {
			io.getIO().emit('posts', {
				action: 'create',
				post: { ...post._doc, creator: { _id: creator._id, name: creator.name } }
			});
			res.status(201).json({
				message: 'Post created successfully!',
				post: post,
				creator: { _id: creator._id, name: creator.name }
			});
		})
		.catch(err => {
			next(ApiError.internal(err))
		});
};


exports.getPost = (req, res, next) => {
	const postId = req.params.postId;
	Post.findById(postId)
		.then(post => {
			if (!post) {
				throw ApiError.notFound("Could not find Post");
			}
			res.status(200).json({ message: 'Post fetched.', post: post });
		})
		.catch(err => {
			next(err)
		}); 
};
  
exports.updatePost = (req, res, next) => {
	const postId = req.params.postId;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw ApiError.unprocessable('Validation failed, entered data is incorrect.');
	}
	const title = req.body.title;
	const content = req.body.content;
	Post.findById(postId)
		.populate('creator', ['name'])
		.then(post => {
			if (!post) {
				throw ApiError.notFound("Could not find Post");
			}
			if (post.creator.toString() !== req.userId) {
				throw ApiError.unAuthorized("Not Authorized");
			}
			post.title = title;
			post.content = content;
			return post.save();
		})
		.then(result => {
			io.getIO().emit('posts', { action: 'update', post: result });
			res.status(200).json({ message: 'Post updated!', post: result });
		})
		.catch(err => {
			next(err);
		});   
};
  
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        throw ApiError.notFound("Could not find Post");
      }
      if (post.creator.toString() !== req.userId) {
        throw ApiError.unAuthorized("Not Authotized");
      }
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      user.posts.pull(postId);
      return user.save();
    })
    .then(result => {
	  io.getIO().emit('posts', { action: 'delete', post: postId });
      res.status(200).json({ message: 'Deleted post.' });
    })
    .catch(err => {
      next(err);
    });    
};
  
