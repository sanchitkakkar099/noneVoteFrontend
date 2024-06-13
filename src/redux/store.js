import { configureStore, combineReducers, createAction } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

import {  authApi, postApi} from "../service";

const appReducer = combineReducers({
  authState: authSlice,
  [authApi.reducerPath]: authApi.reducer,
  [postApi.reducerPath]: postApi.reducer,

});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STATE') {
    // Reset the entire state to undefined, which should trigger default initial states
    state = {};
  }

  return appReducer(state, action);
};

// Custom middleware to handle unauthorized response

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaltMiddleware) =>
    getDefaltMiddleware({ serializableCheck: false }).concat([
      authApi.middleware,
      postApi.middleware
    ])
});