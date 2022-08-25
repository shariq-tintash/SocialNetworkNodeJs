
// External imports
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
// Internal imports
const authRoutes = require('./routes/auth');
const moderatorAuthRoutes = require('./routes/moderatorAuth');
const moderatorFeedRoutes = require('./routes/moderatorFeed');
const feedRoutes = require('./routes/feed');
const userFollowRoutes = require('./routes/userFollow');
const invalidRouter = require("./routes/invalidRouter");
const apiErrorHandler = require("./errors/apiErrorHandler");
const isAuth = require('./middleware/isAuth');
const isModeratorAuth = require('./middleware/isModeratorAuth');
const paymentRoutes = require('./routes/payment');
const checkoutRoutes = require('./routes/checkout');
// Environment variables
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@socialnetworknodejs.a2k6a.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

// Initiliazing Express App
const app = express();

// Connecting to MongoDb database
if (process.env.NODE_ENV === 'dev') {
mongoose
	.connect(MONGODB_URI)
	.then(result => {
		// https
		//   .createServer({ key: privateKey, cert: certificate }, app)
		//   .listen(process.env.PORT || 3000);
		const server = app.listen(process.env.PORT);
		console.log(`Server listening on PORT ${process.env.PORT}`);
		const io = require('./socket').init(server);
		io.on('connection', socket => {
			console.log('Client connected');
		});
	})
	.catch(err => {
			console.log(err);
	});
}
else{
	mongoServer = MongoMemoryServer.create().then(mongoUri => {
		let uri=mongoUri.getUri()
		 mongoose.connect(uri)
		 .then(result => {
			console.log("Mongo connected to test db");
			
			const server = app.listen(process.env.PORT || 3000);
			console.log(`Server listening on PORT 3000`);
			const io = require('./socket').init(server);
			io.on('connection', socket => {
				console.log('Client connected');
			});
		})
		 .catch(err => {
			console.log(err);
		});
	});
}

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routing
app.use('/auth', authRoutes);
app.use('/feed',isAuth, feedRoutes);
app.use('/account',isAuth, userFollowRoutes);
app.use('/payment',isAuth,paymentRoutes);
app.use('/checkout',checkoutRoutes); //path for logging stripe token

// Routes for Moderators
app.use('/moderator/auth', moderatorAuthRoutes);
app.use('/moderator/feed', isModeratorAuth , moderatorFeedRoutes);

// Error Handling
app.all("/*", invalidRouter);
app.use(apiErrorHandler);

module.exports = { app };

