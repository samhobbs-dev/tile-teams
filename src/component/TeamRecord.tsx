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
      width={width}
      height={height}
      alignItems="center"
      justifyContent="center"
      fontSize={fontSize}
      style={{ background: "white" }}
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
          <Box
            sx={{
              width: "100%",
              background: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <CloseIcon
              fontSize="large"
              onClick={closeModal}
              sx={{
                position: "sticky",
                top: 0,
                alignSelf: "flex-end",
                cursor: "pointer",
                m: 1,
              }}
            />
            <Box px={5} py={2}>
              <TeamSchedule teamId={team.id} year={record.year} />
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
        sx={{
          width,
          height,
          borderRadius: 1,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize,
        }}
      >
        {/* Logo area - 66% of height */}
        <Box
          sx={{
            height: "66%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TeamLogo teamId={record.team.id} maxHeight={logoHeight} />
        </Box>
        <Box
          sx={{
            height: "34%",
            display: "flex",
            alignItems: "center",
          }}
        >
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
