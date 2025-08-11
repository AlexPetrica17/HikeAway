const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Email = require('../utils/email');
const AppError = require('../utils/appError');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);

exports.createReview = catchAsync(async (req, res, next) => {
  const { tour } = req.body;

  const existingBooking = await Booking.findOne({
    tour,
    user: req.user.id,
  });

  if (!existingBooking) {
    return next(
      new AppError(
        'You can leave a review only if you previously booked this tour.',
        403,
      ),
    );
  }

  const review = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    tour,
    user: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'name email')
    .populate('tour', 'name');

  if (!review) return next(new AppError('Recenzia nu a fost găsită', 404));

  if (req.body.reason && review.user.email) {
    await new Email(
      review.user,
      { review, reason: req.body.reason },
      `${req.protocol}://${req.get('host')}/my-reviews`,
    ).sendReviewDeleted();
  }

  await review.deleteOne();

  res.status(204).json({ status: 'success', data: null });
});
