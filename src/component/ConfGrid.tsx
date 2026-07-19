"use client"; 
import Grid from "@mui/material/Grid2";
import { Conference } from "../type/conference";
import ConfStandings from "./ConfStandings";

interface MyProps {
  conferences: Conference[];
  loading: boolean;
}

// Contains all conference standings in grid
const ConfGrid: React.FC<MyProps> = ({ conferences, loading }) => {
  return (
    <div>
      {/* Standings for every conference */}
      <Grid
        container
        direction="column"
        spacing={2}
      >
        {conferences.map((conf) => (
          <Grid key={conf.name}>
            <ConfStandings conference={conf} loading={loading} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ConfGrid;
