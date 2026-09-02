"use client";
import { AppBar, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import footballTile from "../image/football-tile.png";
import useWindowSize from "../hook/useWindowSize";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleDarkMode } from "../store/darkModeSlice";

// Header containing site logo & motto
const Header: React.FC = () => {
  const windowSize = useWindowSize();
  const width = windowSize.width;
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.darkMode.isDarkMode);

  return (
    // Position is relative so SchedulePage can stick to its top
    <div>
      <AppBar position="static" style={{ backgroundColor: "green" }}>
        <Toolbar className="w-[90%] mx-auto">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="85vw"
          >
            <a
              href="https://tileteams.com"
              className="text-white no-underline"
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Image src={footballTile} alt="TileTeams logo" height={40} />
                <Typography
                  className="font-[Cambria]"
                  variant="h4"
                  component="div"
                >
                  TileTeams
                </Typography>
              </Stack>
            </a>
            {width > 650 ? (
              <Typography className="flex" variant="h6">
                Discover college records, logos, and more!
              </Typography>
            ) : (
              ""
            )}
            <IconButton
              onClick={() => dispatch(toggleDarkMode())}
              aria-label="Toggle night mode"
              className="text-white"
              sx={{ color: "white" }}
            >
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
