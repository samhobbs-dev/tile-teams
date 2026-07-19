"use client";
 
import { Box, CircularProgress, Paper, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import GameService from "../api/gameService";
import GameStatus from "../type/gameStatus";
import TeamLogo from "./TeamLogo";
import TeamScheduleHeader from "./TeamScheduleHeader";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setTeamSchedules } from "../store/scheduleListSlice";
import Schedule from "../type/schedule";
import useWindowSize from "../hook/useWindowSize";

interface MyProps {
  teamId: number;
  year: number;
}
const width = 180;

const TeamSchedule: React.FC<MyProps> = ({ teamId, year }) => {
  const windowSize = useWindowSize();
  const windowHeight = windowSize.height;

  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
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

  // Update schedule list whenever year changes
  // TODO find way to have only one call on page load
  useEffect(() => {
    let ignore = false;  
    GameService.getAllTeamSchedules(year).then((response) => {
      if (!ignore) {
        dispatch(setTeamSchedules(response as Schedule[]));
        setLoading(false);
      }
    });  
    return () => {
      ignore = true;
    };
  }, [dispatch, year]);

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
      <Paper elevation={5} sx={{ position: "sticky", top: 0 }}>
        <Box height={50} width={width}>
          <TeamScheduleHeader teamId={teamId} />
        </Box>
        {loading ? (
          <Paper
            style={{
              backgroundColor: "white",
              height: logoHeight,
              width: width,
            }}
          >
            <CircularProgress />
          </Paper>
        ) : (
          games.map((game) => (
            <Stack
              key={game.id}
              style={{ height: logoHeight + 2, width: width }}
            >
              <Grid
                container
                padding={1}
                alignItems="center"
                direction="row"
                alignContent="center"
                width="100%"
                height="100%"
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
          ))
        )}
      </Paper>
    </Box>
  );
};

export default TeamSchedule;
