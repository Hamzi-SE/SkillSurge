import { createReducer } from '@reduxjs/toolkit';

export const subscriptionReducer = createReducer(
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
    cancelSubscriptionRequest: state => {
      state.loading = true;
    },
    cancelSubscriptionSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    cancelSubscriptionFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    checkSubscriptionRequest: state => {
      state.loading = true;
    },
    checkSubscriptionSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    checkSubscriptionFail: (state, action) => {
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
