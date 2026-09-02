"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface DarkModeState {
  isDarkMode: boolean;
}

// Deterministic on the server; synced to the OS/browser preference client-side
// after mount (see ThemeRegistry) to avoid a hydration mismatch
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
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;
export const selectIsDarkMode = (state: RootState) => state.darkMode.isDarkMode;
export default darkModeSlice.reducer;
