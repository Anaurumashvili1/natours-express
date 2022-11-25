const express = require('express');
const {
  getAllReviews,
  addReview,
  deleteReview,
  setTourAndUserIds,
  getReview,
  updateReview,
} = require('../controllers/reviewController');
const { restrict, protect } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
router.use(protect);
router
  .route('/')
  .get(getAllReviews)
  .post(restrict('user'), setTourAndUserIds, addReview);
router
  .route('/:id')
  .delete(restrict('user', 'admin'), deleteReview)
  .get(getReview)
  .patch(restrict('user', 'admin'), updateReview);
module.exports = router;
