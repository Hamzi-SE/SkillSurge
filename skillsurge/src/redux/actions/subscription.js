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
      payload: error?.response?.data?.message,
    });
  }
};

export const checkSubscription = () => async dispatch => {
  try {
    dispatch({ type: 'checkSubscriptionRequest' });

    const { data } = await axios.get(`${server}/check-subscription`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    dispatch({
      type: 'checkSubscriptionSuccess',
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: 'checkSubscriptionFail',
      payload: error?.response?.data?.message,
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
          return dispatch({
            type: 'createSubscriptionFail',
            payload: error.message,
          });
        }

        return dispatch({
          type: 'createSubscriptionSuccess',
          payload: data,
        });
      }

      dispatch({
        type: 'createSubscriptionFail',
        payload: data.message,
      });
    } catch (error) {
      dispatch({
        type: 'createSubscriptionFail',
        payload: error?.response?.data?.message,
      });
    }
  };

export const cancelSubscription = () => async dispatch => {
  try {
    dispatch({ type: 'cancelSubscriptionRequest' });

    const { data } = await axios.delete(`${server}/cancel-subscription`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    dispatch({
      type: 'cancelSubscriptionSuccess',
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: 'cancelSubscriptionFail',
      payload: error?.response?.data?.message,
    });
  }
};
