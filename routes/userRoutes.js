const express = require('express');
const {
  getAllUsers,
  addUser,
  getUser,
  editUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.route('/').get(getAllUsers).post(addUser);
router.route('/:id').get(getUser).patch(editUser).delete(deleteUser);

module.exports = router;
