import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  stats: null,
  usersCount: null,
  subscriptionsCount: null,
  viewsCount: null,
  usersProfit: null,
  subscriptionsProfit: null,
  viewsProfit: null,
  usersPercentage: null,
  subscriptionsPercentage: null,
  viewsPercentage: null,
  users: [],
  message: null,
  error: null,
};

export const adminReducer = createReducer(initialState, builder =>
  builder
    .addCase('getAdminDashboardStatsRequest', state => {
      state.loading = true;
    })
    .addCase('getAdminDashboardStatsSuccess', (state, action) => {
      state.loading = false;
      state.stats = action.payload.stats;
      state.usersCount = action.payload.usersCount;
      state.subscriptionsCount = action.payload.subscriptionsCount;
      state.viewsCount = action.payload.viewsCount;
      state.usersProfit = action.payload.usersProfit;
      state.subscriptionsProfit = action.payload.subscriptionsProfit;
      state.viewsProfit = action.payload.viewsProfit;
      state.usersPercentage = action.payload.usersPercentage;
      state.subscriptionsPercentage = action.payload.subscriptionsPercentage;
      state.viewsPercentage = action.payload.viewsPercentage;
    })
    .addCase('getAdminDashboardStatsFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('getAllUsersRequest', state => {
      state.loading = true;
    })
    .addCase('getAllUsersSuccess', (state, action) => {
      state.loading = false;
      state.users = action.payload;
    })
    .addCase('getAllUsersFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('updateUserRoleRequest', state => {
      state.loading = true;
    })
    .addCase('updateUserRoleSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase('updateUserRoleFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('deleteUserRequest', state => {
      state.loading = true;
    })
    .addCase('deleteUserSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase('deleteUserFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('createCourseRequest', state => {
      state.loading = true;
    })
    .addCase('createCourseSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase('createCourseFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('deleteCourseRequest', state => {
      state.loading = true;
    })
    .addCase('deleteCourseSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase('deleteCourseFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('addLectureRequest', state => {
      state.loading = true;
    })
    .addCase('addLectureSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase('addLectureFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('deleteLectureRequest', state => {
      state.loading = true;
    })
    .addCase('deleteLectureSuccess', (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase('deleteLectureFail', (state, action) => {
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
