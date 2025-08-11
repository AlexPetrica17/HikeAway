/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteBooking = async (bookingId) => {
  try {
    const res = await axios.delete(`/api/v1/bookings/${bookingId}`, {
      withCredentials: true,
    });

    if (res.status === 204) {
      showAlert('success', 'Recenzia a fost ștearsă!');
      window.setTimeout(() => location.reload(), 1500);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Eroare la ștergere.');
  }
};
