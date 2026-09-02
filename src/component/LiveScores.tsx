"use client";

import { Box, CircularProgress, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useRef } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import LiveGameCard from "./LiveGameCard";
import useLiveScores from "../hook/useLiveScores";

// Constants for styling
const gameBoxSize = 100; // To make the game box a square
const arrowWidth = 40;
const scrollAmount = gameBoxSize * 5 + 30; // Scroll by ~3 boxes + spacing

const LiveScores: React.FC = () => {
  const { liveGames, loading } = useLiveScores();
  const gamesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll functions for the arrows
  const scrollLeft = () => {
    if (gamesContainerRef.current) {
      // Moves the scroll position to the left by the calculated amount
      gamesContainerRef.current.scrollBy(
        { left: -scrollAmount, behavior: 'smooth' }
      );
    }
  };

  const scrollRight = () => {
    if (gamesContainerRef.current) {
      // Moves the scroll position to the right by the calculated amount
      gamesContainerRef.current.scrollBy(
        { left: scrollAmount, behavior: 'smooth' }
      );
    }
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ width: "90%", overflow: "hidden" }}
    >
      {/* Sideways Title Box */}
      <Box flexShrink={0}>
        <Paper elevation={5} sx={{
          p: 1,
          height: gameBoxSize * 1.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50px'
        }}>
          <Typography
            variant="h6"
            sx={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              whiteSpace: 'nowrap',
              fontWeight: 'bold',
            }}
          >
            Live Scores
          </Typography>
        </Paper>
      </Box>
      {/* Left Arrow */}
      <Box width={arrowWidth} flexShrink={0}>
        <IconButton onClick={scrollLeft}>
          <ArrowLeftIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Scrollable Container */}
      <Box
        ref={gamesContainerRef}
        sx={{
          overflowX: "auto",
          p: 1,
          flexGrow: 1,
          flexShrink: 1,          // prevent pushing right arrow off screen
          maxWidth: "100%",       // ensures container fits between arrows
          maxHeight: gameBoxSize + 30,
          display: "flex",
          alignItems: "center",
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {loading ? (
          <Box
            sx={{
              minWidth: gameBoxSize,
              height: gameBoxSize,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Stack direction="row" spacing={1} flexWrap="nowrap">
            {liveGames.map((game) => (
              <LiveGameCard key={game.id} game={game} size={gameBoxSize} />
            ))}
          </Stack>
        )}
      </Box>

      {/* Right Arrow */}
      <Box width={arrowWidth} flexShrink={0}>
        <IconButton onClick={scrollRight}>
          <ArrowRightIcon fontSize="large" />
        </IconButton>
      </Box>
    </Stack>
  );
};

export default LiveScores;
