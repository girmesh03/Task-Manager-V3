import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage for web
import { apiSlice } from '../features/apiSlice';
import authReducer from '../features/authSlice';
import createTransform from 'redux-persist/es/createTransform';

// Define a transform to filter sensitive data from auth state
const authTransform = createTransform(
  (inboundState) => {
    // Modify the state before saving to storage
    return {
      // token: inboundState.token, // Persist only the token
      currentUser: inboundState.currentUser, // Persist user info if needed
    };
  },
  (outboundState) => outboundState, // No transformation when rehydrating
  { whitelist: ['auth'] }
);

// Redux Persist config for auth
const authPersistConfig = {
  key: 'auth',
  storage,
  transforms: [authTransform], // Apply the filter
  whitelist: ['currentUser'], // Persist only specific fields
  // whitelist: ['token','currentUser'], // Persist only specific fields
};

// Wrap auth reducer with persistReducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // Add API reducer
    auth: persistedAuthReducer, // Persisted authentication reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
