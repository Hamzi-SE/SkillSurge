import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  courses: [],
  lectures: [],
  message: null,
  error: null,
};

export const courseReducer = createReducer(initialState, builder =>
  builder
    .addCase('allCoursesRequest', state => {
      state.loading = true;
    })
    .addCase('allCoursesSuccess', (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    })
    .addCase('allCoursesFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('getCourseRequest', state => {
      state.loading = true;
    })
    .addCase('getCourseSuccess', (state, action) => {
      state.loading = false;
      state.lectures = action.payload;
    })
    .addCase('getCourseFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('addToPlaylistRequest', state => {
      state.loading = true;
    })
    .addCase('addToPlaylistSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase('addToPlaylistFail', (state, action) => {
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
