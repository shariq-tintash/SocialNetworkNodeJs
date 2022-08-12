const ApiError = require("../errors/apiError");

// Controller Actions
module.exports.invalid_route = (req, res, next) => {
  next(ApiError.notFound("404, Page not found"));
  return;
};

module.exports.bad_request = (req, res, next) => {
  next(ApiError.badRequest("400, Bad Request"));
  return;
};