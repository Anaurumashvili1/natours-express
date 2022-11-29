const express = require('express');
const path = require('path');

const app = express();
app.enable('trust proxy');

const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bookingRouter = require('./routes/bookingRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrors = require('./controllers/errorControler');
const { webhookCheckout } = require('./controllers/bookingsController');

app.use(compression());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.options('*', cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this IP, please try again later',
});
app.use(helmet());
app.use('/api', limiter);
app.post(
  'webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// express body parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//data sanitization against nosql  query injection
app.use(mongoSanitize());
// data sanitization against xss
app.use(xss());
//prevent parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
      'ratingsQuantity',
    ],
  })
);
//serve static files
app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();
  next();
});
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl}`, 404));
});

app.use(globalErrors);
module.exports = app;
