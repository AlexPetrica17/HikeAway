const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview,
);
router.get('/about', authController.isLoggedIn, viewsController.getAboutPage);
router.get(
  '/contact',
  authController.isLoggedIn,
  viewsController.getContactUsPage,
);
router.get(
  '/become-guide',
  authController.isLoggedIn,
  viewsController.getBecomeGuidePage,
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/register', viewsController.getRegisterForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.get('/my-reviews', authController.protect, viewsController.getMyReviews);
router.get(
  '/tour/:slug/review',
  authController.protect,
  viewsController.getReviewForm,
);
router.get('/billing', authController.protect, viewsController.getBillingPage);
router.get(
  '/thank-you',
  authController.protect,
  viewsController.getThankYouPage,
);
router.get(
  '/forgot-password',
  authController.isLoggedIn,
  viewsController.getForgotPasswordPage,
);
router.get('/reset-password/:token', viewsController.getResetPasswordForm);

router.get(
  '/manage-tours',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  viewsController.getManageToursPage,
);

router.get(
  '/manage-reviews',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getManageReviewsPage,
);

router.get(
  '/manage-bookings',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getManageBookingsPage,
);

router.get(
  '/manage-users',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getManageUsersPage,
);

module.exports = router;
