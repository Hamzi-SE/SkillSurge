const ErrorMiddleware = (err, req, res, next) => {
	// Log to console for dev
	console.log(err.stack.red);

	// Set status code and message
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal Server Error";

	// Send response
	res.status(err.statusCode).json({
		success: false,
		message: err.message,
	});
};

export default ErrorMiddleware;
