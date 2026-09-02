"use client";

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface DarkModeState {
  isDarkMode: boolean;
}

const initialState: DarkModeState = {
  isDarkMode: false,
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { toggleDarkMode } = darkModeSlice.actions;
export const selectIsDarkMode = (state: RootState) => state.darkMode.isDarkMode;
export default darkModeSlice.reducer;
