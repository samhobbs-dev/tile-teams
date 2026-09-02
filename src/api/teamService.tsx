import axios from "axios";
import { Team, TeamResponse } from "../type/team";
import { logError } from "../lib/logger";

const TeamService = {
  async getAllTeamsInYear(year: number) {
    try {
      const { data: resp } = await axios.get<TeamResponse[]>(
        "/api/team/" + year
      );
      return this.createTeams(resp);
    } catch (error) {
      logError("Failed to fetch teams for year", error, { year });
      if (axios.isAxiosError(error)) return error.message;
      return "An unexpected error occurred";
    }
  },
  createTeams(teamResp: TeamResponse[]) {
    const teams: Team[] = [];
    teamResp.forEach((t) => {
      const team: Team = {
        id: t.id,
        fullName: t.full_name,
        school: t.school,
        mascot: t.mascot,
        logo: t.logo,
        currentLogo: t.current_logo,
      };
      teams.push(team);
    });
    return teams;
  },
};

export default TeamService;
