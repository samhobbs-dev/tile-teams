"use client";
import { AppBar, Stack, Toolbar, Typography } from "@mui/material";
import footballTile from "../image/football-tile.png";
import useWindowSize from "../hook/useWindowSize";
import Image from "next/image";

// Header containing site logo & motto
const Header: React.FC = () => {
  const windowSize = useWindowSize();
  const width = windowSize.width;

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
                <Image src={footballTile} alt="logo" height={40} />
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
                Discover records, logos, and more!
              </Typography>
            ) : (
              ""
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
