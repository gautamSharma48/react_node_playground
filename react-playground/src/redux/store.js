import { configureStore, combineReducers } from "@reduxjs/toolkit";
import logger from "redux-logger";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";

// Assuming you have a single reducer for simplicity
import { sampleReducer } from "./slice";

// Correctly combine your reducers
const rootReducer = combineReducers({
  sample1: sampleReducer,
});

// Encrypt the persist
const secretKey = "TEST"; // Fixed typo here
const encrypter = encryptTransform({ secretKey });

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  transforms: [encrypter],
};

// Wrap your rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Correctly configure your store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
});

// Create a persistor instance
export const persistor = persistStore(store);
