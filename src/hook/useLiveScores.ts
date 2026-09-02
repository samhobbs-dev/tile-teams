"use client";

import { useEffect, useState } from "react";
import { collegeNameMap } from "@/const/collegeNameMap";
import { logError } from "@/lib/logger";
import { Team } from "@/type/team";
import { useAppSelector } from "@/store/hooks";

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

// Matches against the team list already loaded into memory (by SchedulePage)
// instead of hitting /api/teamname per team, which used to mean a couple
// hundred DB round trips just to load the score bar
const resolveTeamId = (teamName: string, teams: Team[]): number | null => {
  const result = collegeNameMap.get(teamName);
  let school = teamName;
  if (result !== undefined) school = result;
  else {
    // Replace St. with State to fit my db
    school = school.replace(/\./g, "");
    school = school.replace(/\bSt\b/g, "State");
  }
  return teams.find((t) => t.school === school)?.id ?? null;
};

const fetchLiveScores = async (teams: Team[]): Promise<LiveGameScore[]> => {
  try {
    const res = await fetch("/api/live-scores");

    const data: NCAAGameJSON = await res.json();

    const liveScores: LiveGameScore[] = data.games.map(({ game }) => {
      const gameStatus =
        game.gameState === "pre"
          ? "Pre-Game"
          : game.currentPeriod || game.gameState || "Pre-Game";

      return {
        id: Number(game.gameID),
        homeTeamName: game.home.names.short,
        awayTeamName: game.away.names.short,
        homeTeamId: resolveTeamId(game.home.names.short, teams),
        awayTeamId: resolveTeamId(game.away.names.short, teams),
        homeTeamScore: Number(game.home.score || 0),
        awayTeamScore: Number(game.away.score || 0),
        gameStatus,
      };
    });
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
  const teams = useAppSelector((state) => state.teamList.teamList);
  const [liveGames, setLiveGames] = useState<LiveGameScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Wait for the team list to load so team ids can actually resolve
    if (teams.length === 0) return;

    let ignore = false;

    const loadScores = () => {
      fetchLiveScores(teams)
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
  }, [teams]);

  return { liveGames, loading };
}
