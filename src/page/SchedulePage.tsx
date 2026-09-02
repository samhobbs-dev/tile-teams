"use client";

import { Box, CircularProgress, Paper, Stack, Typography }
from "@mui/material";
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
import { CURRENT_YEAR, FIRST_YEAR, NEXT_YEAR, desktopHeight, desktopWidth }
from "../const/const";

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
  const isValidYear = currentYear >= FIRST_YEAR && currentYear < NEXT_YEAR;
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
    if (isValidYear) {
      let ignore = false;

      Promise.all([
        RecordService.getAllConferenceStandings(currentYear),
        TeamService.getAllTeamsInYear(currentYear),
        RankingService.getFinalAPRankingsByYear(currentYear),
      ]).then(([confRes, teamRes, rankRes]) => {
        if (!ignore) {
          const sortedConfs = (confRes as Conference[]).sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setConferences(sortedConfs);
          dispatch(setTeamList(teamRes as Team[]));
          setRankings(rankRes as Ranking[]);
          setLoading(false);
        }
      });

      return () => {
        ignore = true;
      };
    }
  }, [currentYear, dispatch, isValidYear]);
  return isValidYear ? (
    <Stack
      direction="column"
      alignItems="center"
      spacing={1}
      className="pt-2 pb-16 w-full min-h-screen
        bg-cover bg-center bg-repeat-y bg-fixed"
      style={{
        backgroundImage:
        `linear-gradient(rgba(211, 211, 211, 0.5),
          rgba(211, 211, 211, 0.5)),
          url('https://cfbh-logos.s3.us-east-2.amazonaws.com/pennstate.jpg')
        `
      }}
    >

      <Typography variant="h1" className="sr-only">
        {currentYear} College Football Season
      </Typography>
      {/* On desktop, show the live scores bar inline; on mobile it's a
          separate modal (see ConfYear) to avoid crowding the page */}
      {currentYear == CURRENT_YEAR && isDesktopWidth && <LiveScores/>}
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
        <Box className="flex-1 w-full h-[70h] flex justify-center items-center"
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
                  <Stack
                    position="sticky"
                    height="105px"
                    width="180px"
                    top="0"
                  >
                    <Paper elevation={5}>
                      <Typography className="m-0.5 text-base">
                        Hover over or tap a team to see their schedule.
                      </Typography>
                    </Paper>
                  </Stack>
                </Stack>
              )}
            </Box>
          )}
          <Box
            width={isDesktopWidth ? "60%" : "95%"}
            minWidth={isDesktopWidth ? 300 : undefined}
            display="flex"
            justifyContent="center"
          >
            <ConfGrid
              conferences={conferences}
              loading={false}
            />
          </Box>
          {isDesktopWidth && (
            <Box width="20%" display="flex" justifyContent="center">
              <Rankings
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
