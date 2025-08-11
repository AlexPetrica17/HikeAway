const multer = require('multer');
const path = require('path');
const GuideEmail = require('../utils/guideEmail');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/cv_applications');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = req.body.name
      ? req.body.name.replace(/\s+/g, '_').toLowerCase()
      : 'anonim';
    cb(null, `${safeName}_cv${ext}`);
  },
});

const upload = multer({ storage });

exports.submitApplication = [
  (req, res, next) => {
    const uploadSingle = upload.single('cv');
    uploadSingle(req, res, (err) => {
      if (err)
        return next(new AppError('Eroare la încărcarea fișierului.', 400));
      next();
    });
  },

  catchAsync(async (req, res, next) => {
    const { name, email, phone, experience } = req.body;
    const cvFile = req.file;

    if (!name || !email || !phone || !cvFile) {
      return next(
        new AppError('Toate câmpurile și CV-ul sunt obligatorii.', 400),
      );
    }

    const receivers = process.env.GUIDE_APPLICATION_RECEIVERS;
    const emailSender = new GuideEmail(
      name,
      email,
      phone,
      experience,
      receivers,
      cvFile.path,
    );
    await emailSender.send();

    res.status(200).json({
      status: 'success',
      message: 'Cererea a fost trimisă cu succes!',
    });
  }),
];
