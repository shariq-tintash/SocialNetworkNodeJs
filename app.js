
// External imports
const express = require('express');
const mongoose = require('mongoose');
// Internal imports

// Environment variables

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0-ntrwp.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

// Initiliazing Express App
const app = express();
// Connecting to MongoDb database


mongoose
  .connect(MONGODB_URI)
  .then(result => {
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.PORT || 3000);
      app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });

// Routing


// Error Handling