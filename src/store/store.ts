"use client";

import { configureStore } from "@reduxjs/toolkit";
import scheduleReducer from "./currentScheduleSlice";
import currentLogoReducer from "./currentLogoSlice";
import scheduleListReducer from "./scheduleListSlice";
import teamListReducer from "./teamListSlice";
import darkModeReducer from "./darkModeSlice";

export const store = configureStore({
  reducer: {
    schedule: scheduleReducer,
    teamList: teamListReducer,
    currentLogo: currentLogoReducer,
    scheduleList: scheduleListReducer,
    darkMode: darkModeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
