/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51RJXI0IkXfWtRESAmy2XZgWlwB8QduDzih8t2ahcMZtn5IBhX4irAt8l8fmleLR9pfzz8n8N91YL2pKNcNMumFos00mQ3DFan4',
  );

  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
