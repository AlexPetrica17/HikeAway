const ContactEmail = require('../utils/contactEmail');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.sendContactEmail = catchAsync(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new AppError('Toate câmpurile sunt obligatorii.', 400));
  }

  const receivers = process.env.CONTACT_RECEIVER_EMAILS;
  const emailSender = new ContactEmail(name, email, message, receivers);
  await emailSender.send();

  res.status(200).json({
    status: 'success',
    message: 'Mesajul a fost trimis cu succes!',
  });
});
