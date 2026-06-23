"use client";

import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import ConfGrid from "../component/ConfGrid";
import ConfYear from "../component/ConfYear";
import TeamSchedule from "../component/TeamSchedule";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { NO_TEAM } from "../store/currentScheduleSlice";
import Rankings from "../component/Rankings";
import useWindowSize from "../hook/useWindowSize";
import { useEffect, useState } from "react";
import TeamService from "../api/teamService";
import { setTeamList } from "../store/teamListSlice";
import { Team } from "../type/team";
import { CURRENT_YEAR, FIRST_YEAR, desktopHeight, desktopWidth } from "../const/const";

import { useRouter } from "next/navigation";
import { Conference } from "@/type/conference";
import RecordService from "@/api/recordService";
import RankingService from "@/api/rankingService";
import Ranking from "@/type/ranking";
import LiveScores from "@/component/LiveScores";

interface MyProps {
  year: string;
}

// Main page containing all elements
const SchedulePage: React.FC<MyProps> = ({ year }) => {
  const windowSize = useWindowSize();
  const isDesktopWidth = windowSize.width >= desktopWidth;
  const isDesktopHeight = windowSize.height >= desktopHeight;

  const teamId = useAppSelector((state) => state.schedule.teamId);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const currentYear: number = parseInt(year, 10);
  const isValidYear = currentYear >= FIRST_YEAR && currentYear < 2026;
  const isTeam: boolean = teamId !== NO_TEAM;

  const [conferences, setConferences] = useState<Conference[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);

  function setCurrentYear(year: number) {
    router.push(`/year/${year}`);
  }
  function incrementYear() {
    setCurrentYear(currentYear + 1);
  }
  function decrementYear() {
    setCurrentYear(currentYear - 1);
  }

  useEffect(() => {
    // Update years once current year is changed
    if (isValidYear) {
      setLoading(true);
      Promise.all([
        RecordService.getAllConferenceStandings(currentYear),
        TeamService.getAllTeamsInYear(currentYear),
        RankingService.getFinalAPRankingsByYear(currentYear),
      ]).then(([confRes, teamRes, rankRes]) => {
        const sortedConfs = (confRes as Conference[]).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setConferences(sortedConfs);
        dispatch(setTeamList(teamRes as Team[]));
        setRankings(rankRes as Ranking[]);
        setLoading(false);
      });
    }
  }, [currentYear, dispatch, isValidYear]);
  return isValidYear ? (
    <Stack
      direction="column"
      alignItems="center"
      spacing={1}
      paddingTop={1}
      paddingBottom={8}
      style={{
        backgroundImage: `
                    linear-gradient(rgba(211, 211, 211, 0.5), rgba(211, 211, 211, 0.5)),
                    url('https://cfbh-logos.s3.us-east-2.amazonaws.com/pennstate.jpg')
                    `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat-y",
        backgroundAttachment: "fixed",
        width: "100%",
        minHeight: "100vh",
      }}
    >

      {/* Only display the live scores if you're on the current year */}
      {currentYear == CURRENT_YEAR && <LiveScores/>}
      {(!isDesktopWidth || !isDesktopHeight) && (
        <Typography>Tap a team to view its schedule.</Typography>
      )}
      <ConfYear
        defaultYear={currentYear}
        onChange={setCurrentYear}
        incrementYear={incrementYear}
        decrementYear={decrementYear}
      />
      {loading ? (
        <Box
          sx={{
            flex: 1,
            width: "100%",
            height: "70vh", // Ensures there's vertical space to center within
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Stack direction="row" justifyContent="center" spacing={2}>
          {isDesktopWidth && isDesktopHeight && (
            <Box width="20%" display="flex" justifyContent="center">
              {isTeam ? (
                <TeamSchedule teamId={teamId} year={currentYear} />
              ) : (
                <Stack justifyContent="space-between">
                  <Stack position="sticky" height="105px" width="180px" top="0">
                    <Paper elevation={5}>
                      <Typography style={{ margin: 2, fontSize: 16 }}>
                        Hover over or tap a team to see their schedule.
                      </Typography>
                    </Paper>
                  </Stack>
                </Stack>
              )}
            </Box>
          )}
          <Box
            width={"60%"}
            minWidth={300}
            display="flex"
            justifyContent="center"
          >
            <ConfGrid
              year={currentYear}
              conferences={conferences}
              loading={false}
            />
          </Box>
          {isDesktopWidth && (
            <Box width="20%" display="flex" justifyContent="center">
              <Rankings
                year={currentYear}
                height={50}
                width={120}
                logoHeight={40}
                rankings={rankings}
              />
            </Box>
          )}
        </Stack>
      )}
    </Stack>
  ) : (
    <>
      <h1>Invalid Year</h1>
    </>
  );
};

export default SchedulePage;
