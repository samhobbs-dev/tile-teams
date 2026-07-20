"use client";
import { CircularProgress } from "@mui/material";
import React from "react";
import { useAppSelector } from "../store/hooks";
import Image from 'next/image';

const USE_COMPRESS: boolean = true;
const S3_LINK: string =
  "https://cfbh-logos.s3.us-east-2.amazonaws.com/" +
  (USE_COMPRESS ? "compress/" : "");

interface MyProps {
  teamId: number;
  maxHeight: number;
  fontSize?: number;
}

// Set this to true or false if we want to display copyrighted logos or not
const FETCH_IMAGE = true;

// Team logo image, adjusted by xy heights and current/past
const TeamLogo: React.FC<MyProps> = ({
  teamId,
  maxHeight,
  fontSize,
}) => {
  const useCurrentLogo = useAppSelector(
    (state) => state.currentLogo.useCurrentLogo
  );
  const teams = useAppSelector((state) => state.teamList.teamList);

  const team = teams.find((t) => t.id === teamId);
  const loading = team === undefined;

  const school = team?.school ?? "";
  const rawLogo = useCurrentLogo ? team?.currentLogo : team?.logo;
  const hasLogo = FETCH_IMAGE && !!rawLogo;
  const image = hasLogo ? S3_LINK + rawLogo : "";
  const noImage = !hasLogo;

  return loading ? (
    <div>
      <CircularProgress />
    </div>
  ) : noImage === false ? (
    <div
      className="relative"
      style={{
        width: maxHeight,
        height: maxHeight,
      }}
    >
      <Image
        className="object-contain"
        fill
        src={image}
        alt={`${school} logo`}
        title={school}
        sizes={`${maxHeight}px`}
      />
    </div>
  ) : (
    <div>
      <b className="flex" style={fontSize ? { fontSize } : undefined}>
        {school}
      </b>
    </div>
  );
};

export default TeamLogo;
