const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'Toate tururile',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com/v3/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
    )
    .render('tour', {
      title: `${tour.name}`,
      tour,
    });
});

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com http://127.0.0.1:3000 http://localhost:3000",
    )
    .render('login', {
      title: 'Autentificare',
    });
};

exports.getRegisterForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com http://127.0.0.1:3000 http://localhost:3000",
    )
    .render('register', {
      title: 'Înregistrare',
    });
};

exports.getAccount = catchAsync(async (req, res) => {
  let tours = [];

  if (req.user.role === 'admin') {
    tours = await Tour.find();
  }

  res.status(200).render('account', {
    title: 'Contul tău',
    tours,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('bookings', {
    title: 'Rezervările mele',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runvalidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Contul tău',
    user: updatedUser,
  });
});

exports.getManageToursPage = catchAsync(async (req, res) => {
  const users = await User.find({ role: { $in: ['guide', 'lead-guide'] } });
  const tours = await Tour.find();
  const tourToEdit = req.query.editId
    ? await Tour.findById(req.query.editId)
    : null;

  res.status(200).render('manageTours', {
    title: 'Gestionare tururi',
    tours,
    tourToEdit,
    users,
  });
});

exports.getManageReviewsPage = catchAsync(async (req, res) => {
  const { tour, page = 1, user } = req.query;
  const limit = 6;
  const skip = (page - 1) * limit;

  const filter = {};
  if (tour) filter.tour = tour;

  if (user) {
    const users = await User.find({
      name: { $regex: user, $options: 'i' },
    }).select('_id');

    const userIds = users.map((u) => u._id);
    filter.user = { $in: userIds };
  }

  const reviewsQuery = Review.find(filter)
    .populate('user', 'name photo')
    .populate('tour', 'name imageCover');

  const reviews = await reviewsQuery.skip(skip).limit(limit);
  const total = await Review.countDocuments(filter);
  const tours = await Tour.find().select('name');

  res.status(200).render('manageReviews', {
    title: 'Gestionare recenzii',
    reviews,
    tours,
    currentPage: +page,
    totalPages: Math.ceil(total / limit),
    selectedTour: tour || '',
    searchQuery: user || '',
  });
});

exports.getMyReviews = catchAsync(async (req, res) => {
  const { tour } = req.query;

  const filter = { user: req.user._id };
  if (tour) filter.tour = tour;

  const reviews = await Review.find(filter).populate('tour', 'name imageCover');

  const tours = await Tour.find().select('name');

  res.status(200).render('reviews', {
    title: 'Recenziile mele',
    reviews,
    tours,
    selectedTour: tour || '',
  });
});

exports.getReviewForm = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug });

  res.status(200).render('reviewForm', {
    title: `Recenzie pentru ${tour.name}`,
    tour,
  });
});

exports.getManageBookingsPage = async (req, res) => {
  const { tour } = req.query;

  const filter = {};
  if (tour) filter.tour = tour;

  const bookings = await Booking.find(filter)
    .populate('user', 'name email')
    .populate('tour', 'name price');

  const tours = await Tour.find({}, 'name');

  res.status(200).render('manageBookings', {
    title: 'Gestionare rezervări',
    bookings,
    tours,
    selectedTour: tour,
  });
};

exports.getBillingPage = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('tour');

  res.status(200).render('billing', {
    title: 'Facturare',
    bookings,
  });
};

exports.getForgotPasswordPage = async (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Resetare parolă',
  });
};

exports.getResetPasswordForm = (req, res) => {
  const { token } = req.params;
  res.status(200).render('resetPassword', {
    title: 'Resetare parolă',
    token,
  });
};

exports.getAboutPage = (req, res) => {
  res.status(200).render('aboutUs', {
    title: 'Despre noi',
  });
};

exports.getContactUsPage = (req, res) => {
  res.status(200).render('contact', {
    title: 'Contact',
  });
};

exports.getBecomeGuidePage = (req, res) => {
  res.status(200).render('becomeGuide', {
    title: 'Devino ghid',
  });
};

exports.getThankYouPage = (req, res) => {
  res.status(200).render('thankYou', {
    title: 'Mulțumim pentru comandă!',
  });
};

exports.getManageUsersPage = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).render('manageUsers', {
    title: 'Gestionare utilizatori',
    users,
  });
});
