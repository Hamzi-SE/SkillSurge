import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  stripePublishableKey: null,
  subscription: null,
  message: null,
  error: null,
};

export const subscriptionReducer = createReducer(initialState, builder => {
  builder
    .addCase('stripePublishableKeyRequest', state => {
      state.loading = true;
    })
    .addCase('stripePublishableKeySuccess', (state, action) => {
      state.loading = false;
      state.stripePublishableKey = action.payload;
    })
    .addCase('stripePublishableKeyFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('createSubscriptionRequest', state => {
      state.loading = true;
    })
    .addCase('createSubscriptionSuccess', (state, action) => {
      state.loading = false;
      state.subscription = action.payload.subscriptionId;
      state.message = action.payload.message;
    })
    .addCase('createSubscriptionFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('cancelSubscriptionRequest', state => {
      state.loading = true;
    })
    .addCase('cancelSubscriptionSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase('cancelSubscriptionFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('checkSubscriptionRequest', state => {
      state.loading = true;
    })
    .addCase('checkSubscriptionSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase('checkSubscriptionFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('clearError', state => {
      state.error = null;
    })
    .addCase('clearMessage', state => {
      state.message = null;
    });
});
