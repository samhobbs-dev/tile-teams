"use client";

/* eslint-disable react/prop-types */
import { Box, CircularProgress, IconButton, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
// Assuming TeamLogo is available in the component directory
import TeamLogo from "./TeamLogo";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import useWindowSize from "../hook/useWindowSize"; // Assuming this hook exists
import TeamService from "@/api/teamService";
import { TeamResponse } from "@/type/team";
import { collegeNameMap } from "@/const/collegeNameMap";
import Grid from "@mui/material/Unstable_Grid2";

interface LiveGameScore {
  id: number;
  homeTeamName: string;   // use string since the API uses strings like "JAX ST"
  awayTeamName: string;
  homeTeamId: number | null;  // nulls if the checking the id in the db failed
  awayTeamId: number | null;
  homeTeamScore: number;
  awayTeamScore: number;
  gameStatus: string; // e.g., 'Q1 5:30', 'Halftime', 'Final'
}
interface NCAAGameJSON {
  games: {
    game: {
      gameID: string;
      home: {
        names: { char6: string; short: string; seo: string; full: string };
        score: string;
      };
      away: {
        names: { char6: string; short: string; seo: string; full: string };
        score: string;
      };
      currentPeriod: string; // "FINAL", "3RD", etc.
      gameState: string;     // "live", "pre", "final"
    };
  }[];
}

// Constants for styling
const gameBoxSize = 100; // To make the game box a square
const logoHeight = gameBoxSize / 3; // Dynamic sizing
const scoreFontSize = gameBoxSize / 5;
const statusFontSize = gameBoxSize / (100 / 12);
const arrowWidth = 40;
const scrollAmount = gameBoxSize * 5 + 30; // Scroll by roughly 3 boxes + spacing

// Placeholder function for API call - to be replaced by the user
const fetchLiveScores = async (): Promise<LiveGameScore[]> => {
  try {
    const res = await fetch("/api/live-scores");

    const data: NCAAGameJSON = await res.json();

    // Get unique team names from NCAA data
    const teamNames = Array.from(
      new Set(
        data.games.flatMap(({ game }) => [game.home.names.full, game.away.names.full])
      )
    );

    const liveScores: LiveGameScore[] = await Promise.all(
      data.games.map(async ({ game }) => {
        const homeTeamId = await fetchTeamId(game.home.names.short);
        const awayTeamId = await fetchTeamId(game.away.names.short);

        return {
          id: Number(game.gameID),
          homeTeamName: game.home.names.short,
          awayTeamName: game.away.names.short,
          homeTeamId,   // now this is number | null
          awayTeamId,   // now this is number | null
          homeTeamScore: Number(game.home.score || 0),
          awayTeamScore: Number(game.away.score || 0),
          gameStatus: game.gameState === "pre" ? "Pre-Game" : (game.currentPeriod || game.gameState || "Pre-Game")
        };
      })
    );
    // Order games
    const statusOrder: string[] = ["Pre-Game", "FINAL"];

    const getPriority = (status: string): number => {
      const index = statusOrder.indexOf(status);
      return index === -1 ? 0 : index + 1; // anything else gets 0
    };
    
    const orderedGames: LiveGameScore[] = [...liveScores].sort(
      (a, b) => getPriority(a.gameStatus) - getPriority(b.gameStatus)
    );

    return orderedGames;
  } catch (err) {
    console.error("Error fetching live scores:", err);
    return [];
  }
};

const fetchTeamId = async (teamName: string) => {
  const result = collegeNameMap.get(teamName);
  if (result !== undefined)
    teamName = result;
  else {
    teamName = teamName.replace(/\./g, "");
    teamName = teamName.replace(/\bSt\b/g, "State"); // Replace St. with State to fit my db  
  }
  let teamResponse = await TeamService.getTeamByCloseName(teamName) as TeamResponse;
  if (teamResponse == null)
    return null;
  return teamResponse.id;
}

const LiveScores: React.FC = () => {
    const [liveGames, setLiveGames] = useState<LiveGameScore[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const gamesContainerRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      setLoading(true);
      // User will replace this with actual API call
      fetchLiveScores()
        .then((data) => {
          setLiveGames(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching live scores:", error);
          setLoading(false);
        });
    }, []);
  
    // Utility to determine the color of the game status (e.g., in-progress vs final)
    const getStatusColor = (status: string) => {
      if (status.toLowerCase().includes("final")) return "red";
      if (status.toLowerCase().includes("pre-game")) return "gray";
      return "green";
    };
  
    // Scroll functions for the arrows
    const scrollLeft = () => {
      if (gamesContainerRef.current) {
        // Moves the scroll position to the left by the calculated amount
        gamesContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    };
    
    const scrollRight = () => {
      if (gamesContainerRef.current) {
        // Moves the scroll position to the right by the calculated amount
        gamesContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };
  
    return (
    <Stack 
      direction="row" 
      alignItems="center" 
      spacing={1}
      sx={{ width: "90%", overflow: "hidden" }}
    >
        {/* 1. Sideways Title Box */}
      <Box flexShrink={0}>
        <Paper elevation={5} sx={{ 
          p: 1, 
          height: gameBoxSize * 1.2, // Arbitrary height to fit the whole box for visual balance
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'lightgray',
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
        <Box sx={{ minWidth: gameBoxSize, height: gameBoxSize, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
        </Box>
    ) : (
        <Stack direction="row" spacing={1} flexWrap="nowrap">
        {liveGames.map((game) => (
          <Paper
            key={game.id}
            elevation={3}
            sx={{
              width: gameBoxSize,
              height: gameBoxSize,
              p: 1,
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <Grid
              container
              rowSpacing={.5}
              columnSpacing={1}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {/* Away team icon*/}
              <Grid
                xs={6}
                height="30px" // Also shifts the score
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {game.awayTeamId ? (
                    <TeamLogo
                      teamId={game.awayTeamId}
                      maxHeight={logoHeight}
                      xy
                      isSchedule
                      fontSize={statusFontSize}
                    />
                  ) : (
                    game.awayTeamName
                  )}
              </Grid>
              {/* Away team score */}
              <Grid 
                xs={6}
                display={"flex"}
                justifyContent={"center"}
              >
                <Typography variant="h6" sx={{ fontSize: scoreFontSize }}>
                  {game.awayTeamScore}
                </Typography>
              </Grid>
              {/* Home team icon*/}
              <Grid
                xs={6}
                display={"flex"}
                height="30px" // Also shifts the score
                justifyContent={"center"}
                alignItems={"center"}
              >
                {game.homeTeamId ? (
                  <TeamLogo
                    teamId={game.homeTeamId}
                    maxHeight={logoHeight}
                    xy
                    isSchedule
                    fontSize={statusFontSize}
                  />
                ) : (
                  game.awayTeamName
                )}
              </Grid>
              {/* Home team score */}
              <Grid
                xs={6}
                display={"flex"}
                justifyContent={"center"}
              >
                <Typography variant="h6" sx={{ fontSize: scoreFontSize }}>
                    {game.homeTeamScore}
                  </Typography>
              </Grid>
              <Grid
                xs={6}
              >
                <Typography
                  align="center"
                  variant="subtitle2"
                  sx={{
                    color: getStatusColor(game.gameStatus),
                    fontWeight: 'bold',
                    fontSize: statusFontSize,
                  }}
                >
                  {game.gameStatus}
                </Typography>
              </Grid>
            </Grid>            
          </Paper>
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