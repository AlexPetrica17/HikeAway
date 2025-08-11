import axios from 'axios';
import { showAlert } from './alerts';

export const updateUserRole = async (userId, newRole) => {
  try {
    const res = await axios.patch(`/api/v1/users/${userId}`, { role: newRole });
    if (res.data.status === 'success') {
      showAlert('success', 'Rolul a fost actualizat cu succes!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Eroare la actualizarea rolului.',
    );
  }
};
