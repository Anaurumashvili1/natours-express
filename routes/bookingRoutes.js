const express = require('express');
const { protect, restrict } = require('../controllers/authController');
const {
  getCheckoutSession,
  updateBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  createBooking,
} = require('../controllers/bookingsController');

const router = express.Router();
router.use(protect);
router.get('/checkout-session/:tourId', protect, getCheckoutSession);

router.use(restrict('admin', 'lead-guide'));

router.route('/').get(getAllBookings).post(createBooking);
router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);
module.exports = router;
