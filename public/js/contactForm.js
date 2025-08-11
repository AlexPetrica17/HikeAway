/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const sendContactMessage = async (name, email, message) => {
  try {
    const res = await axios.post('/api/v1/contact', { name, email, message });
    if (res.data.status === 'success') {
      showAlert('success', 'Mesajul a fost trimis cu succes!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
