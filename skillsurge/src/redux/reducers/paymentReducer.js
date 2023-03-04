import { createReducer } from '@reduxjs/toolkit';

export const paymentReducer = createReducer(
  {},
  {
    stripePublishableKeyRequest: state => {
      state.loading = true;
    },
    stripePublishableKeySuccess: (state, action) => {
      state.loading = false;
      state.stripePublishableKey = action.payload;
    },
    stripePublishableKeyFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createSubscriptionRequest: state => {
      state.loading = true;
    },
    createSubscriptionSuccess: (state, action) => {
      state.loading = false;
      state.subscription = action.payload.subscriptionId;
      state.message = action.payload.message;
    },
    createSubscriptionFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    clearMessage: state => {
      state.message = null;
    },
  }
);
