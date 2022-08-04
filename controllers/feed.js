const ApiError = require('../errors/ApiError');
const Post = require('../models/post');
const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.getPosts = (req, res, next) => {
	const currentPage = req.query.page || 1;
	const perPage = 4;  //per page 4 posts only
	let totalItems;
	Post.find()
		.countDocuments()
		.then(count => {
			totalItems = count;
			return Post.find()
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
			next(ApiError.internal(err))
		});  
};

exports.createPost = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		next(ApiError.unprocessable('Validation failed, entered data is incorrect.'))
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
				next(ApiError.notFound("Could not find Post"))
			}
			res.status(200).json({ message: 'Post fetched.', post: post });
		})
		.catch(err => {
			next(ApiError.internal(err))
		}); 
};
  
exports.updatePost = (req, res, next) => {
	const postId = req.params.postId;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		next(ApiError.unprocessable('Validation failed, entered data is incorrect.'))
	}
	const title = req.body.title;
	const content = req.body.content;
	Post.findById(postId)
		.then(post => {
			if (!post) {
				next(ApiError.notFound("Could not find Post"));
			}
			if (post.creator.toString() !== req.userId) {
				next(ApiError.unAuthorized("Not Authorized"))
			}
			post.title = title;
			post.content = content;
			return post.save();
		})
		.then(result => {
			res.status(200).json({ message: 'Post updated!', post: result });
		})
		.catch(err => {
			next(ApiError.internal(err))
		});   
};
  
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        next(ApiError.notFound("Could not find Post"));
      }
      if (post.creator.toString() !== req.userId) {
        next(ApiError.unAuthorized("Not Authotized"));
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
      res.status(200).json({ message: 'Deleted post.' });
    })
    .catch(err => {
      next(ApiError.internal(err))
    });    
};
  
