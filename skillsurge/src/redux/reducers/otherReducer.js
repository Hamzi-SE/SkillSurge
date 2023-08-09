import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  message: null,
  error: null,
};

export const otherReducer = createReducer(initialState, builder =>
  builder
    .addCase('contactRequest', state => {
      state.loading = true;
    })
    .addCase('contactSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase('contactFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('courseRequestRequest', state => {
      state.loading = true;
    })
    .addCase('courseRequestSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase('courseRequestFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('clearError', state => {
      state.error = null;
    })
    .addCase('clearMessage', state => {
      state.message = null;
    })
);
