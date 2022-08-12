const ApiError = require('../errors/ApiError');
const Post = require('../models/post');
const Moderator = require('../models/moderator');
const { validationResult } = require('express-validator');
const io = require('../socket');

exports.getPosts = (req, res, next) => {
	const currentPage = req.query.page || 1;
	const perPage = 4;  //per page 4 posts only
	let totalItems;
	Post.find().countDocuments()
	.then(count => {
		totalItems = count;
		return Post.find()
            .select('-creator')
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

exports.getPost = (req, res, next) => {
	const postId = req.params.postId;
	Post.findById(postId)
        .select('-creator')
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
        .select('-creator')
		.then(post => {
			if (!post) {
				throw ApiError.notFound("Could not find Post");
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
    .select('-creator')
    .then(post => {
      if (!post) {
        throw ApiError.notFound("Could not find Post");
      }
      Post.findByIdAndRemove(postId);
      return post;
    })
    .then(post => {
      return User.findById(post.creator);
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
  
