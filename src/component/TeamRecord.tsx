"use client";

import { Box, CircularProgress, Modal, Paper, Stack } from "@mui/material";
import { useAppDispatch } from "../store/hooks";
import { setScheduleTeamId } from "../store/currentScheduleSlice";
import { SeasonRecord } from "../type/record";
import TeamLogo from "./TeamLogo";
import useWindowSize from "../hook/useWindowSize";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import TeamSchedule from "./TeamSchedule";
import { desktopHeight, desktopWidth } from "../const/const";

interface MyProps {
  record: SeasonRecord;
  height: number;
  width: number;
  loading: boolean;
  logoHeight: number;
  fontSize: number;
}

// Box in ConfStandings per team containing logo & record
const TeamRecord: React.FC<MyProps> = ({
  record,
  height,
  width,
  loading,
  logoHeight,
  fontSize,
}) => {
  const [showModal, setShowModal] = useState(false);
  function closeModal() {
    setShowModal(false);
  }
  const windowSize = useWindowSize();
  const isDesktopWidth = windowSize.width >= desktopWidth;
  const isDesktopHeight = windowSize.height >= desktopHeight;

  const dispatch = useAppDispatch();
  const team = record.team;

  return loading ? (
    <Stack
      alignItems="center"
      justifyContent="center"
      className="bg-white"
      style={{ width, height, fontSize }}
    >
      <CircularProgress />
    </Stack>
  ) : (
    <>
      {/* If on mobile, allow user to tap team to pull up their schedule */}
      {(!isDesktopWidth || !isDesktopHeight) && (
        <Modal
          open={showModal}
          onClose={() => closeModal()}
          sx={{ overflowY: "scroll" }}
        >
          <Box className=
            "w-full bg-white flex flex-col items-center text-center"
          >
            <CloseIcon
              fontSize="large"
              onClick={closeModal}
              className="sticky top-0 self-end cursor-pointer m-2"
            />
            <Box className="px-10 py-4">
              <TeamSchedule teamId={team.id} />
            </Box>
          </Box>
        </Modal>
      )}
      {/* Entry */}
      <Paper
        elevation={5}
        onMouseEnter={() => {
          dispatch(setScheduleTeamId(record.team.id));
        }}
        onClick={() => setShowModal(true)}
        className="rounded bg-white flex flex-col items-center"
        sx={{ width, height, fontSize }}
      >
        {/* Logo area - 66% of height */}
        <Box className="h-[66%] flex items-center">
          <TeamLogo teamId={record.team.id} maxHeight={logoHeight} />
        </Box>
        <Box className="h-[34%] flex items-center">
          {record.totalWins + "-" + record.totalLosses}
          {record.totalTies > 0 ? record.totalTies : ""}
          {" (" + record.totalConfWins + "-" + record.totalConfLosses}
          {record.totalConfTies > 0 ? record.totalConfTies + ")" : ")"}
        </Box>
      </Paper>
    </>
  );
};

export default TeamRecord;
