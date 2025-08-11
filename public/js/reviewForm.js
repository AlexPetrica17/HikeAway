/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const addReview = async (data, type) => {
  try {
    const url = 'http://127.0.0.1:3000/api/v1/reviews';

    const res = await axios({
      method: 'POST',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Recenzia a fost adaugata cu succes!');
      window.setTimeout(() => {
        window.location.href = '/my-reviews';
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
