import axios from 'axios';
import { showAlert } from './alerts';

export const sendGuideApplication = async (formData) => {
  try {
    const res = await axios.post('/api/v1/guide/application', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data.status === 'success') {
      showAlert('success', res.data.message);
    }
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Eroare la trimiterea cererii.',
    );
  }
};
