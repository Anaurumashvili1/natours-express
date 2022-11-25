const AppError = require('../utils/appError');

const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
const productionErr = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('error', err);
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
};
const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg
    ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    : Object.values(err.keyValue)[0];

  const message = `Duplicate field value: ${value}, please use aother value`;
  return new AppError(message, 400);
};
const handleValidationErrorDb = (err) => {
  const errors = Object.values(err.errors).map((error) => error.message);
  const message = `invalid input data: ${errors.join(', ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError('Authorization failed, invalid token', 401);
const handlJWTExpiredError = (err) =>
  new AppError('your token has expired, please log in again', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    devError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
      console.log(error);
    }
    if (error._message === 'Validation failed') {
      error = handleValidationErrorDb(error);
    }
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') {
      error = handlJWTExpiredError();
    }
    productionErr(error, res);
  }
};
