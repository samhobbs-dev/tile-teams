"use client";
 
import { Box, Paper, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import GameStatus from "../type/gameStatus";
import TeamLogo from "./TeamLogo";
import TeamScheduleHeader from "./TeamScheduleHeader";
import { useAppSelector } from "../store/hooks";
import useWindowSize from "../hook/useWindowSize";

interface MyProps {
  teamId: number;
}
const width = 180;

// Schedules for every team/year are preloaded by SchedulePage, so this
// just reads from the store instead of fetching on every mount
const TeamSchedule: React.FC<MyProps> = ({ teamId }) => {
  const windowSize = useWindowSize();
  const windowHeight = windowSize.height;

  const schedules = useAppSelector(
    (state) => state.scheduleList.yearSchedules
  );
  const games = schedules.find((s) => s.teamId === teamId)?.games ?? [];

  const DEFAULT = 50;
  let logoHeight = DEFAULT; // Default value
  if (games.length > 0)
    logoHeight = (windowHeight - 80) / games.length;
  if (logoHeight > DEFAULT)
    logoHeight = DEFAULT;
  const fontSize = 17;

  const getGameStatusColor = (gameStatus: GameStatus) => {
    switch (gameStatus) {
      case "W":
        return "green";
      case "L":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <Box width={width}>
      <Paper elevation={5} className="sticky top-0">
        <Box height={50} width={width}>
          <TeamScheduleHeader teamId={teamId} />
        </Box>
        {games.map((game) => (
          <Stack
            key={game.id}
            style={{ height: logoHeight + 2, width }}
          >
            <Grid
              container
              className="p-2 w-full h-full"
              alignItems="center"
              direction="row"
              alignContent="center"
            >
              <Grid container size={6} justifyContent="center">
                <TeamLogo
                  teamId={game.opponentTeamId}
                  maxHeight={logoHeight - 3}
                  fontSize={fontSize - 3}
                />
              </Grid>
              <Grid size={1} fontSize={{ fontSize }} alignItems="center">
                <b style={{ color: getGameStatusColor(game.gameStatus) }}>
                  {game.gameStatus}
                </b>
              </Grid>
              <Grid size={5} fontSize={{ fontSize }}>
                {" " + game.teamPoints + " - " + game.opponentTeamPoints}
              </Grid>
            </Grid>
          </Stack>
        ))}
      </Paper>
    </Box>
  );
};

export default TeamSchedule;
