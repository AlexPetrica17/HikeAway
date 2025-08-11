/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const register = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Contul a fost creat cu succes!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    let message = err.response?.data?.message;

    showAlert('error', message);
  }
};
