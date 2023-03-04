import { server } from '../store';
import axios from 'axios';

export const getStripePublishableKey = () => async dispatch => {
  try {
    dispatch({ type: 'stripePublishableKeyRequest' });

    const { data } = await axios.get(`${server}/stripe-publishable-key`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    dispatch({
      type: 'stripePublishableKeySuccess',
      payload: data.stripePublishableKey,
    });
  } catch (error) {
    dispatch({
      type: 'stripePublishableKeyFail',
      payload: error.response.data.message,
    });
  }
};

export const createSubscription =
  ({ name, email, paymentMethod, stripe }) =>
  async dispatch => {
    try {
      dispatch({ type: 'createSubscriptionRequest' });

      const { data, status } = await axios.post(
        `${server}/subscribe`,
        { email, name, paymentMethod },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (status >= 200 && status < 300) {
        const { error } = await stripe.confirmCardPayment(data.clientSecret);

        if (error) {
          dispatch({
            type: 'createSubscriptionFail',
            payload: error.message,
          });
        }
      } else {
        dispatch({
          type: 'createSubscriptionFail',
          payload: data.message,
        });
      }

      dispatch({
        type: 'createSubscriptionSuccess',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'createSubscriptionFail',
        payload: error.response.data.message,
      });
    }
  };
