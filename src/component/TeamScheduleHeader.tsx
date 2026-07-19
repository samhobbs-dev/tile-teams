"use client";
import { Typography } from "@mui/material";
import { useAppSelector } from "../store/hooks";

interface MyProps {
  teamId: number;
}

// Appears above team's schedule on left of page
const TeamScheduleHeader: React.FC<MyProps> = ({ teamId }) => {
  const teams = useAppSelector((state) => state.teamList.teamList);
  const school = teams.find((t) => t.id === teamId)?.school ?? "";
  
  return school !== "" ? (
    <>
      <Typography>{school}</Typography>
      <Typography>Schedule</Typography>
    </>
  ) : (
    <></>
  );
};

export default TeamScheduleHeader;
