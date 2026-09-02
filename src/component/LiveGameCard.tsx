"use client";

import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import TeamLogo from "./TeamLogo";
import { LiveGameScore } from "../hook/useLiveScores";

interface MyProps {
  game: LiveGameScore;
  size: number;
}

// Determine the color of the game status (e.g., in-progress vs final)
const getStatusColor = (status: string) => {
  if (status.toLowerCase().includes("final")) return "red";
  if (status.toLowerCase().includes("pre-game")) return "gray";
  return "green";
};

// Single game score tile, shared by the desktop score bar & mobile modal
const LiveGameCard: React.FC<MyProps> = ({ game, size }) => {
  const logoHeight = size / 3;
  const scoreFontSize = size / 5;
  const statusFontSize = size / (100 / 12);

  return (
    <Paper
      elevation={3}
      sx={{
        width: size,
        height: size,
        p: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <Grid
        container
        rowSpacing={0.5}
        columnSpacing={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* Away team icon*/}
        <Grid
          size={6}
          height="30px" // Also shifts the score
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {game.awayTeamId ? (
            <TeamLogo
              teamId={game.awayTeamId}
              maxHeight={logoHeight}
              fontSize={statusFontSize}
            />
          ) : (
            game.awayTeamName
          )}
        </Grid>
        {/* Away team score */}
        <Grid size={6} display="flex" justifyContent="center">
          <Typography variant="h6" sx={{ fontSize: scoreFontSize }}>
            {game.awayTeamScore}
          </Typography>
        </Grid>
        {/* Home team icon*/}
        <Grid
          size={6}
          display="flex"
          height="30px" // Also shifts the score
          justifyContent="center"
          alignItems="center"
        >
          {game.homeTeamId ? (
            <TeamLogo
              teamId={game.homeTeamId}
              maxHeight={logoHeight}
              fontSize={statusFontSize}
            />
          ) : (
            game.homeTeamName
          )}
        </Grid>
        {/* Home team score */}
        <Grid size={6} display="flex" justifyContent="center">
          <Typography variant="h6" sx={{ fontSize: scoreFontSize }}>
            {game.homeTeamScore}
          </Typography>
        </Grid>
        <Grid size={12}>
          <Typography
            align="center"
            variant="subtitle2"
            sx={{
              color: getStatusColor(game.gameStatus),
              fontWeight: "bold",
              fontSize: statusFontSize,
              whiteSpace: "nowrap",
            }}
          >
            {game.gameStatus}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LiveGameCard;
