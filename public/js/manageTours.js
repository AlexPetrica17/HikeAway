import axios from 'axios';
import { showAlert } from './alerts';

const BASE_URL = 'http://127.0.0.1:3000/api/v1/tours';

export const createTour = async (formData) => {
  try {
    await axios.post(`${BASE_URL}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    showAlert('success', 'Turul a fost creat cu succes!');
    setTimeout(() => location.assign('/manage-tours'), 1500);
  } catch (err) {
    console.error('Eroare la creare tur:', err.response?.data || err);
    showAlert('error', err.response?.data?.message || 'Eroare la creare.');
  }
};

export const updateTour = async (id, formData) => {
  try {
    await axios.patch(`/api/v1/tours/${id}`, formData);
    showAlert('success', 'Modificările au fost salvate!');
    setTimeout(() => location.assign('/manage-tours'), 1500);
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Eroare la actualizare.');
  }
};

export const deleteTour = async (id) => {
  try {
    await axios.delete(`/api/v1/tours/${id}`);
    showAlert('success', 'Turul a fost șters.');
    setTimeout(() => location.reload(), 1500);
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Eroare la ștergere.');
  }
};

let renderExtraLocationFields = () => {};

export const handleExtraLocations = (existingLocations = []) => {
  const locationContainer = document.getElementById('locationsContainer');
  const locationCountInput = document.getElementById('locationCount');

  if (!locationContainer || !locationCountInput) return;

  if (existingLocations.length) {
    locationCountInput.value = existingLocations.length;
  }

  const renderExtraLocationFields = () => {
    const count = parseInt(locationCountInput.value, 10) || 0;
    locationContainer.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const loc = existingLocations[i] || {};
      const group = document.createElement('div');
      group.classList.add('location-group');
      group.style.marginBottom = '2rem';

      group.innerHTML = `
        <label class="form__label" for="locationAddress-${i}">Adresa locației ${i + 1}</label>
        <input id="locationAddress-${i}" class="form__input" type="text" name="locations[${i}].address" value="${loc.address || ''}" required>

        <label class="form__label" for="locationLat-${i}">Latitudine</label>
        <input id="locationLat-${i}" class="form__input" type="number" name="locations[${i}].coordinates[1]" step="any" value="${loc.coordinates?.[1] ?? ''}" required>

        <label class="form__label" for="locationLng-${i}">Longitudine</label>
        <input id="locationLng-${i}" class="form__input" type="number" name="locations[${i}].coordinates[0]" step="any" value="${loc.coordinates?.[0] ?? ''}" required>

        <label class="form__label" for="locationDescription-${i}">Descriere locație</label>
        <input id="locationDescription-${i}" class="form__input" type="text" name="locations[${i}].description" value="${loc.description || ''}" required>

        <label class="form__label" for="locationDay-${i}">Ziua (numerică)</label>
        <input id="locationDay-${i}" class="form__input" type="number" name="locations[${i}].day" min="1" value="${loc.day ?? ''}" required>
      `;

      locationContainer.appendChild(group);
    }
  };

  renderExtraLocationFields();

  locationCountInput.addEventListener('input', renderExtraLocationFields);
  locationCountInput.addEventListener('change', renderExtraLocationFields);
};
