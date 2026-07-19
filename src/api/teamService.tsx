import axios from "axios";
import { Team, TeamResponse } from "../type/team";

const TeamService = {
  async getAllTeamsInYear(year: number) {
    try {
      const { data: resp } = await axios.get<TeamResponse[]>(
        "/api/team/" + year
      );
      return this.createTeams(resp);
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
  async getTeamByCloseName(teamName: string) {
    try {
      const { data: resp } = await axios.get<TeamResponse>(
        "/api/teamname/" + teamName
      );
      return resp;
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
