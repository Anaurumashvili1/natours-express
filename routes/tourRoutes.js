const express = require('express');
const reviewRouter = require('./reviewRoutes');
const {
  getAllTours,
  getTourById,
  addTour,
  updateTour,
  deleteTour,
  getTourStats,
  aliasTopTours,
  getMonthlyPlan,
  getDistances,
  getToursWithin,
  uploadTourImages,
  resizeTourImages,
} = require('../controllers/tourController');
const { protect, restrict } = require('../controllers/authController');

const router = express.Router();
router.use('/:tourId/reviews', reviewRouter);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrict('admin', 'lead-guide', 'guide'), getMonthlyPlan);
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);
router.route('/distance/:latlng/unit/:unit').get(getToursWithin);
// router.param('id', checkId);

router.route('/distances/:latlng/unit/:unit').get(getDistances);
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrict('admin', 'lead-guide'), addTour);
router
  .route('/:id')
  .get(getTourById)
  .patch(
    protect,
    restrict('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, restrict('admin', 'lead-guide'), deleteTour);

// router.route('/:tourId/reviews').post(protect, restrict('user'), addReview);
module.exports = router;
