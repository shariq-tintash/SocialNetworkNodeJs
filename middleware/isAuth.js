const jwt = require('jsonwebtoken');
const ApiError = require('../errors/apiError');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(ApiError.unAuthorized("Not authenticated"))
  }
  // console.log(authHeader); // Bearer token
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    next(ApiError.internal(err))
  }
  if (!decodedToken) {
    next(ApiError.unAuthorized("Not authenticated"))
  }
  req.userId = decodedToken.userId;
  next();
};
