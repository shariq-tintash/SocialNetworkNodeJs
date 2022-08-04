
// External imports
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Internal imports
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const invalidRouter = require("./routes/invalidRouter");
const apiErrorHandler = require("./errors/apiErrorHandler");
const isAuth = require('./middleware/isAuth');
// Environment variables
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@socialnetworknodejs.a2k6a.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

// Initiliazing Express App
const app = express();

// Connecting to MongoDb database
mongoose
	.connect(MONGODB_URI)
	.then(result => {
			// https
			//   .createServer({ key: privateKey, cert: certificate }, app)
			//   .listen(process.env.PORT || 3000);
			app.listen(process.env.SERVER_PORT);
			console.log(`Server listening on PORT ${process.env.SERVER_PORT}`);
	})
	.catch(err => {
			console.log(err);
	});


// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// Routing
app.use('/auth', authRoutes);
app.use('/feed',isAuth, feedRoutes);
app.all("/*", invalidRouter);

// Error Handling
app.use(apiErrorHandler);

