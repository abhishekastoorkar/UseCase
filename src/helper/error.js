class ErrorHandler extends Error {
  constructor (statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
const handleError = (err, res) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'internal server error';
  const { statusCode, message } = err;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
};
module.exports = {
  ErrorHandler,
  handleError
};
