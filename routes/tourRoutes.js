const express = require('express');
const {
  getAllTours,
  getTourById,
  addTour,
  updateTour,
  deleteTour,
  // checkId,
  // checkBody,
  aliasTopTours,
} = require('../controllers/tourController');

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

// router.param('id', checkId);
router.route('/').get(getAllTours).post(addTour);
router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
