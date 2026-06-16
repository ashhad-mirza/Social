//Steps for State Management
/**
 * Submit Action
 * Reducer--handle Action in its reducer
 * Store--Register here all reducer in Store
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    postReducer: postReducer,
  },
});
