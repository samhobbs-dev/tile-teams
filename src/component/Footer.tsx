"use client";
import { AppBar, Toolbar } from "@mui/material";
import Link from "next/link";

// Footer crediting sources
const Footer: React.FC = () => {
  return (
    <div>
      <AppBar
        position="static"
        className="top-auto bottom-0"
        style={{ backgroundColor: "green" }}
      >
        <Toolbar>
          <div>
            All logos courtesy of{" "}
            <Link href="https://www.sportslogos.net" className="my-link">
              SportsLogos.net
            </Link>
            . All logos belong to the NCAA® and their respective schools.
            Images used through fair use. Team and conference records sourced
            from publicly available records. Records and games may not be fully
            accurate. Logo sourced from Icons8.
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Footer;
