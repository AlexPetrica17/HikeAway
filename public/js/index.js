/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { register } from './register';
import {
  createTour,
  updateTour,
  deleteTour,
  handleExtraLocations,
} from './manageTours';
import { showAlert } from './alerts';
import { initReviewDeleteModal } from './manageReviews';
import { addReview } from './reviewForm';
import { deleteReview } from './reviews';
import { deleteBooking } from './manageBookings';
import { forgotPassword } from './forgotPassword';
import { resetPassword } from './resetPassword';
import { sendContactMessage } from './contactForm';
import { sendGuideApplication } from './becomeGuide';
import { updateUserRole } from './updateUser';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tour-form');
  if (!form) return;

  let existing = [];
  try {
    existing = JSON.parse(form.dataset.locations || '[]');
  } catch (err) {
    console.error('Eroare la parsarea locațiilor:', err);
  }

  handleExtraLocations(existing);
});

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const forgotPasswordForm = document.querySelector('.form--forgotPassword');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const registerForm = document.querySelector('.form--register');
const tourForm = document.getElementById('tour-form');
const deleteButtons = document.querySelectorAll('.delete-btn');
const reviewForm = document.getElementById('reviewForm');
const deleteReviewButtons = document.querySelectorAll(
  '.delete-review-user-btn',
);
const deleteBookingButtons = document.querySelectorAll('.delete-booking-btn');
const resetForm = document.getElementById('form-reset');
const contactForm = document.getElementById('contactForm');
const guideForm = document.getElementById('guideForm');
const userSaveButtons = document.querySelectorAll('.save-role-btn');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    forgotPassword(email);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    await updateSettings(form, 'data');

    document.querySelector('.btn--green').textContent = 'Save settings';

    location.reload();
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Modificare...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent =
      'Salvează parola';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Procesare...';
    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });

if (registerForm)
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    register(name, email, password, passwordConfirm);
  });

if (tourForm) {
  tourForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mode = tourForm.dataset.mode;
    const id = tourForm.dataset.id;

    try {
      const formData = new FormData();

      const getValue = (id) => {
        const el = document.getElementById(id);
        if (!el) throw new Error(`Elementul cu id="${id}" nu există.`);
        return el.value;
      };

      formData.append('name', getValue('name'));
      formData.append('duration', getValue('duration'));
      formData.append('maxGroupSize', getValue('maxGroupSize'));
      formData.append('difficulty', getValue('difficulty'));
      formData.append('price', getValue('price'));
      formData.append('summary', getValue('summary'));
      formData.append('description', getValue('description'));
      formData.append(
        'startLocation.description',
        getValue('startLocationDescription'),
      );
      formData.append('startDates', getValue('startDate'));

      formData.append(
        'startLocation.address',
        getValue('startLocationAddress'),
      );
      formData.append(
        'startLocation.coordinates[1]',
        getValue('startLocationLat'),
      );
      formData.append(
        'startLocation.coordinates[0]',
        getValue('startLocationLng'),
      );

      const imageCover = document.getElementById('imageCover')?.files[0];
      const images = document.getElementById('images')?.files;

      if (imageCover) formData.append('imageCover', imageCover);

      const locationCount = parseInt(getValue('locationCount'));

      for (let i = 0; i < locationCount; i++) {
        const locationAddress = getValue(`locationAddress-${i}`);
        const locationLat = getValue(`locationLat-${i}`);
        const locationLng = getValue(`locationLng-${i}`);

        if (!locationLat || !locationLng || !locationAddress) {
          return showAlert('error', `Locația ${i + 1} este incompletă.`);
        }

        formData.append(`locations[${i}][address]`, locationAddress);
        formData.append(`locations[${i}][coordinates][1]`, locationLat);
        formData.append(`locations[${i}][coordinates][0]`, locationLng);
        formData.append(
          `locations[${i}][description]`,
          getValue(`locationDescription-${i}`),
        );
        formData.append(`locations[${i}][day]`, getValue(`locationDay-${i}`));
      }

      if (images?.length > 3) {
        return showAlert('error', 'Poți încărca maxim 3 imagini suplimentare.');
      }

      if (images?.length) {
        [...images].forEach((file) => formData.append('images', file));
      }

      const leadGuideSelect = document.getElementById('leadGuide');
      if (!leadGuideSelect || !leadGuideSelect.value) {
        return showAlert('error', 'Selectează un ghid principal.');
      }
      const leadGuide = leadGuideSelect.value;

      const guidesSelect = document.getElementById('guides');
      const selectedGuides = [...guidesSelect.options]
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);

      if (!selectedGuides.length) {
        return showAlert('error', 'Selectează cel puțin un ghid secundar.');
      }

      const allGuides = [
        leadGuide,
        ...selectedGuides.filter((g) => g !== leadGuide),
      ];

      allGuides.forEach((g, index) => {
        formData.append(`guides[${index}]`, g);
      });

      if (mode === 'edit') {
        await updateTour(id, formData);
      } else {
        await createTour(formData);
      }
    } catch (err) {
      showAlert('error', err.message || 'Eroare la trimiterea formularului.');
    }
  });
}

if (deleteButtons.length) {
  deleteButtons.forEach((btn) =>
    btn.addEventListener('click', async () => {
      const confirmed = window.confirm(
        'Ești sigur că vrei să ștergi acest tur?',
      );
      if (!confirmed) return;
      await deleteTour(btn.dataset.id);
    }),
  );
}

if (document.querySelector('.delete-review-btn')) {
  initReviewDeleteModal();
}

if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const tour = reviewForm.querySelector('input[name="tour"]').value;

    addReview({ review, rating, tour });
    reviewForm.reset();
  });
}

deleteReviewButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const reviewId = btn.dataset.reviewId;
    const confirmDelete = confirm(
      'Ești sigur că vrei să ștergi această recenzie?',
    );
    if (confirmDelete) deleteReview(reviewId);
  });
});

deleteBookingButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const bookingId = btn.dataset.id;
    const confirmDelete = confirm(
      'Ești sigur că vrei să ștergi această rezervare?',
    );
    if (confirmDelete) deleteBooking(bookingId);
  });
});

if (resetForm) {
  resetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('newPassword').value;
    const passwordConfirm = document.getElementById('newPasswordConfirm').value;
    const token = window.location.pathname.split('/').pop();

    resetPassword(token, password, passwordConfirm);
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    sendContactMessage(name, email, message);

    contactForm.reset();
  });
}

if (guideForm) {
  guideForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value.trim());
    formData.append('email', document.getElementById('email').value.trim());
    formData.append('phone', document.getElementById('phone').value.trim());
    formData.append(
      'experience',
      document.getElementById('experience').value.trim(),
    );
    formData.append('cv', document.getElementById('cv').files[0]);

    sendGuideApplication(formData);

    guideForm.reset();
  });
}

userSaveButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const userId = btn.dataset.userId;
    const select = document.querySelector(
      `select.role-select[data-user-id="${userId}"]`,
    );
    const newRole = select.value;

    await updateUserRole(userId, newRole);
  });
});
