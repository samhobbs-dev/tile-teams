"use client";

import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAppSelector } from "../store/hooks";

interface MyProps {
  children: React.ReactNode;
}

// Provides an MUI theme reacting to the night mode toggle so every
// Paper/Typography's default colors flip between light and dark automatically
const ThemeRegistry: React.FC<MyProps> = ({ children }) => {
  const isDarkMode = useAppSelector((state) => state.darkMode.isDarkMode);

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
