
const invalidRouter = require("express").Router();
const invalidController = require("../controllers/invalidController");

// Routing requests to its corresponding controllers
invalidRouter.all("/*", invalidController.invalid_route);

// Exporting the module
module.exports = invalidRouter;