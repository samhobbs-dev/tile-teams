"use client";

import { useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setDarkMode } from "../store/darkModeSlice";

interface MyProps {
  children: React.ReactNode;
}

// Provides an MUI theme reacting to the night mode toggle so every
// Paper/Typography's default colors flip between light and dark automatically
const ThemeRegistry: React.FC<MyProps> = ({ children }) => {
  const isDarkMode = useAppSelector((state) => state.darkMode.isDarkMode);
  const dispatch = useAppDispatch();

  // Default to the OS/browser color scheme on first load. Runs client-side
  // only (after the deterministic light-mode SSR render) to avoid a
  // hydration mismatch; the header toggle can still override it afterward
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      dispatch(setDarkMode(true));
    }
  }, [dispatch]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode]
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeRegistry;
