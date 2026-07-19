"use client";
 
import { Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Conference } from "../type/conference";
import TeamRecord from "./TeamRecord";
import useWindowSize from "../hook/useWindowSize";
import { zoomWidth } from "../const/const";

interface MyProps {
  conference: Conference;
  loading: boolean;
}

// Rectangular standings of every team in conference
const ConfStandings: React.FC<MyProps> = ({ conference, loading }) => {
  const windowSize = useWindowSize();
  const isZoomWidth = windowSize.width >= zoomWidth;

  const height = isZoomWidth ? 120 : 70;
  const width = isZoomWidth ? 120 : 70;
  const logoHeight = isZoomWidth ? 70 : 40;
  const fontSize = isZoomWidth ? 18 : 14;

  return (
    <Stack
      direction="column"
      spacing={1}
      paddingBottom={0.5}
      alignItems="flex-start"
    >
      {/* Header with conference name */}
      <Paper
        elevation={5}
        sx={{
          padding: "5px 15px",
          background: "lightgray",
        }}
      >
        <b>{conference.name}</b>
      </Paper>

      {/* Row/grid of TeamRecords */}
      <Stack spacing={1.5} direction="column">
        {conference.divisions.map((div) => (
          <Stack
            spacing={1} // Needed for zoom width, when div name is horizontal
            key={div.name}
            direction={isZoomWidth ? "row" : "column"}
          >
            {div.name && (
              <Paper
                elevation={5}
                sx={{
                  padding: "4px",
                  width: isZoomWidth ? "30px" : "100%",
                  height: isZoomWidth ? "auto" : "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Typography
                  sx={{
                    ...(isZoomWidth ? { transform: "rotate(-90deg)" } : {}),
                    transformOrigin: "center",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {div.name}
                </Typography>
              </Paper>
            )}

            <Grid container spacing={1} alignItems={"center"}>
              {/* Teams in the Division, sorted by name */}
              {div.teams
                .slice() // Copy the array to avoid mutation
                .sort((a, b) => {
                  // Calculate conference win percentage for both teams
                  const aConfWinPercentage =
                    a.totalConfWins / (a.totalConfWins + a.totalConfLosses)
                    || 0;
                  const bConfWinPercentage =
                    b.totalConfWins / (b.totalConfWins + b.totalConfLosses)
                    || 0;
                  // If conf win %s are the same, compare total win %s
                  if (aConfWinPercentage === bConfWinPercentage) {
                    const aOverallWinPercentage =
                      a.totalWins / (a.totalWins + a.totalLosses) || 0;
                    const bOverallWinPercentage =
                      b.totalWins / (b.totalWins + b.totalLosses) || 0;
                    
                    // Sort by overall win percentage if needed
                    return bOverallWinPercentage - aOverallWinPercentage;
                  }

                  // Otherwise, sort by conference win percentage 
                  // in descending order
                  return bConfWinPercentage - aConfWinPercentage;
                })
                .map((team) => (
                  <Grid key={team.id}>
                    <TeamRecord
                      record={team}
                      loading={loading}
                      width={width}
                      height={height}
                      logoHeight={logoHeight}
                      fontSize={fontSize}
                    />
                  </Grid>
                ))}
            </Grid>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default ConfStandings;
