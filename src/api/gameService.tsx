import axios from "axios";
import GameStatus from "../type/gameStatus";
import TeamGame, { GameResponse } from "../type/teamGame";
import Schedule from "../type/schedule";

const GameService = {
  createScheduleGame(r: GameResponse, teamId: number) {
    // If points are null, don't add
    if (r.points_away == null || r.points_home == null)
      return null;
    let gameStatus: GameStatus = null;
    let opponentTeamId: number = 0;
    let teamPoints: number = 0;
    let opponentTeamPoints: number = 0;
    // Map if game was W/L/T by team; assume api always returns game w/their id
    if (teamId === r.id_home_team) {
      opponentTeamId = r.id_away_team;
      teamPoints = r.points_home;
      opponentTeamPoints = r.points_away;
      if (r.points_home > r.points_away)
        gameStatus = "W";
      else if (r.points_home < r.points_away)
        gameStatus = "L";
    } else if (teamId === r.id_away_team) {
      opponentTeamId = r.id_home_team;
      teamPoints = r.points_away;
      opponentTeamPoints = r.points_home;
      if (r.points_home < r.points_away)
        gameStatus = "W";
      else if (r.points_home > r.points_away)
        gameStatus = "L";
    }
    if (r.points_home === r.points_away) gameStatus = "T";
    // null if points were not in response
    const game: TeamGame = {
      id: r.id,
      year: r.year,
      week: r.week,
      isPostseasonGame: r.postseason == 1,
      gameStatus: gameStatus,
      isCompleted: r.completed == 1,
      isConferenceGame: r.conference_game == 1,
      opponentTeamId,
      teamPoints,
      opponentTeamPoints,
    };
    return game;
  },
  async getAllTeamSchedules(year: number) {
    try {
      const { data: gameResp } = await axios.get<GameResponse[]>(
        "/api/game/" + year
      );
      const schedules: Schedule[] = [];
      gameResp.forEach((g) => {
        let homeFound = false;
        let awayFound = false;
        // Loop over exiting teams' schedules & add game if team played in game
        for (let i = 0; i < schedules.length; i++) {
          const teamId = schedules[i].teamId;
          if (teamId == g.id_home_team || teamId == g.id_away_team) {
            const game = this.createScheduleGame(g, teamId);
            // If game had no scores, don't add
            if (game != null) schedules[i].games.push(game);
            if (teamId == g.id_home_team)
              homeFound = true;
            if (teamId == g.id_away_team)
              awayFound = true;
          }
          if (homeFound && awayFound) break;
        }
        // Create new team schedule if the home/away team doesn't have one yet
        if (!homeFound) {
          const game = this.createScheduleGame(g, g.id_home_team);
          if (game != null) {
            schedules.push({
              teamId: g.id_home_team,
              games: [...[], game],
            });
          }
        }
        if (!awayFound) {
          const game = this.createScheduleGame(g, g.id_away_team);
          if (game != null) {
            schedules.push({
              teamId: g.id_away_team,
              games: [...[], game],
            });
          }
        }
      });
      return schedules;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error.message);
        return error.message;
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  },
};

export default GameService;
