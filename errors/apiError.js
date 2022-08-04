class ApiError {
	constructor(status, message) {
		this.status = status;
		this.message = message;
	}

	// Custom Error
	static customError(statusCode,msg) {
		return new ApiError(statusCode, msg);
	}


	// Level 400 Errors

	static badRequest(msg) {
		return new ApiError(400, msg);
	}

	static unAuthorized(msg) {
		return new ApiError(401, msg);
	}

	static forbidden(msg) {
		return new ApiError(403, msg);
	}

	static notFound(msg) {
		return new ApiError(404, msg);
	}

	static conflict(msg) {
		return new ApiError(409, msg);
	}

	static unprocessable(msg) {
		return new ApiError(422, msg);
	}

	// 500 Level Errors

	static serviceUnavailable(msg) {
		return new ApiError(503, msg);
	}

	static notImplemented(msg) {
		return new ApiError(501, msg);
	}

	static gatewayTimeout(msg) {
		return new ApiError(504, msg);
	}

	static networkTimeout(msg) {
		return new ApiError(599, msg);
	}

	static badGateway(msg) {
		return new ApiError(502, msg);
	}

	// General error (Internal server Error)
	static internal(msg) {
		return new ApiError(500, msg);
	}
}
  
module.exports = ApiError;