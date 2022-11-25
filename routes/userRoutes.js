const express = require('express');
const {
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUser,
  rezieUserPhoto,
} = require('../controllers/userController');
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');
const { protect, restrict } = require('../controllers/authController');

const router = express.Router();

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.post('/signup', signUp);
router.post('/login', login);
// router.get('/logout', logout);

router.use(protect);
router.patch('/updatePassword', updatePassword);
router.patch('/updateMe', uploadUser, rezieUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);
router.get('/me', getMe, getUser);

router.use(restrict('admin'));
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(editUser).delete(deleteUser);

module.exports = router;
