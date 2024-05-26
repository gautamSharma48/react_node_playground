import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const sampleSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    add: (state, action) => {
      return { ...state, ...action.payload };
    },
    remove: (state, action) => {
      return initialState;
    },
  },
});

export const { add, remove } = sampleSlice.actions;

export const sampleReducer = sampleSlice.reducer;
