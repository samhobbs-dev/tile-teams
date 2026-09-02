"use client";

import { useEffect, useState } from "react";
import TeamService from "@/api/teamService";
import { TeamResponse } from "@/type/team";
import { collegeNameMap } from "@/const/collegeNameMap";
import { logError } from "@/lib/logger";

export interface LiveGameScore {
  id: number;
  homeTeamName: string; // use string since API uses strings like "JAX ST"
  awayTeamName: string;
  homeTeamId: number | null; // nulls if the checking the id in the db failed
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
      gameState: string; // "live", "pre", "final"
    };
  }[];
}

const fetchTeamId = async (teamName: string) => {
  const result = collegeNameMap.get(teamName);
  if (result !== undefined) teamName = result;
  else {
    // Replace St. with State to fit my db
    teamName = teamName.replace(/\./g, "");
    teamName = teamName.replace(/\bSt\b/g, "State");
  }
  const teamResponse = (await TeamService.getTeamByCloseName(
    teamName
  )) as TeamResponse;
  if (teamResponse == null) return null;
  return teamResponse.id;
};

const fetchLiveScores = async (): Promise<LiveGameScore[]> => {
  try {
    const res = await fetch("/api/live-scores");

    const data: NCAAGameJSON = await res.json();

    const liveScores: LiveGameScore[] = await Promise.all(
      data.games.map(async ({ game }) => {
        const homeTeamId = await fetchTeamId(game.home.names.short);
        const awayTeamId = await fetchTeamId(game.away.names.short);
        const gameStatus =
          game.gameState === "pre"
            ? "Pre-Game"
            : game.currentPeriod || game.gameState || "Pre-Game";

        return {
          id: Number(game.gameID),
          homeTeamName: game.home.names.short,
          awayTeamName: game.away.names.short,
          homeTeamId, // now this is number | null
          awayTeamId, // now this is number | null
          homeTeamScore: Number(game.home.score || 0),
          awayTeamScore: Number(game.away.score || 0),
          gameStatus,
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
    logError("Error fetching live scores", err);
    return [];
  }
};

// Fetches live scores once on mount and polls every minute; shared by the
// desktop score bar and the mobile live scores modal
export default function useLiveScores() {
  const [liveGames, setLiveGames] = useState<LiveGameScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    const loadScores = () => {
      fetchLiveScores()
        .then((data) => {
          if (!ignore) {
            setLiveGames(data);
            setLoading(false);
          }
        })
        .catch((error) => {
          if (!ignore) {
            logError("Error fetching live scores", error);
            setLoading(false);
          }
        });
    };

    loadScores();
    const intervalId = setInterval(loadScores, 60_000);

    return () => {
      ignore = true;
      clearInterval(intervalId);
    };
  }, []);

  return { liveGames, loading };
}
