
const Post = require('../models/post');
const User = require('../models/user');

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
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			res.status(err.statusCode).json({
					message: 'Error: '+err
			})
		});  
};

exports.createPost = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed, entered data is incorrect.');
		error.statusCode = 422;
		res.status(error.statusCode).json({
			message: 'Error: '+error
		})
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
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			res.status(err.statusCode).json({
					message: 'Error: '+err
			})
		});
};


exports.getPost = (req, res, next) => {
	const postId = req.params.postId;
	Post.findById(postId)
		.then(post => {
			if (!post) {
				const error = new Error('Could not find post.');
				error.statusCode = 404;
				throw error;
			}
			res.status(200).json({ message: 'Post fetched.', post: post });
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			res.status(err.statusCode).json({
					message: 'Error: '+err
			})
		}); 
};
  
exports.updatePost = (req, res, next) => {
	const postId = req.params.postId;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed, entered data is incorrect.');
		error.statusCode = 422;
		res.status(err.statusCode).json({
			message: 'Error: '+err
		})
	}
	const title = req.body.title;
	const content = req.body.content;
	let imageUrl = req.body.image;
	if (req.file) {
		imageUrl = req.file.path;
	}
	if (!imageUrl) {
		const error = new Error('No file picked.');
		error.statusCode = 422;
		res.status(error.statusCode).json({
			message: 'Error: '+error
		})
	}
	Post.findById(postId)
		.then(post => {
			if (!post) {
				const error = new Error('Could not find post.');
				error.statusCode = 404;
				res.status(error.statusCode).json({
					message: 'Error: '+error
				})
			}
			if (post.creator.toString() !== req.userId) {
				const error = new Error('Not authorized!');
				error.statusCode = 403;
				res.status(error.statusCode).json({
					message: 'Error: '+error
				})
			}
			post.title = title;
			post.content = content;
			return post.save();
		})
		.then(result => {
			res.status(200).json({ message: 'Post updated!', post: result });
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			res.status(err.statusCode).json({
				message: 'Error: '+err
			})
		});   
};
  
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        res.status(error.statusCode).json({
					message: 'Error: '+error
				})
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        res.status(error.statusCode).json({
					message: 'Error: '+error
				})
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
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      res.status(err.statusCode).json({
				message: 'Error: '+err
			})
    });    
};
  
