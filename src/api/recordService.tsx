import axios from "axios";
import { ConfDivision, Conference } from "../type/conference";
import { RecordResponse, SeasonRecord } from "../type/record";

// TODO strict typing & async requests?
const RecordService = {
  // Group calls
  async getAllConferenceStandings(year: number) {
    const isTeamInExistingConference = (
      sr: SeasonRecord,
      confList: Conference[]
    ) => {
      for (let i = 0; i < confList.length; i++)
        if (sr.conference === confList[i].name)
          return i;
      return -1;
    };

    const isTeamInExistingDivision = (
      sr: SeasonRecord,
      divList: ConfDivision[]
    ) => {
      for (let i = 0; i < divList.length; i++)
        if (sr.division === divList[i].name)
          return i;
      return -1;
    };
    // Get all team records, organize into conferences & divisons, & sort
    try {
      const { data: resp } = await axios.get<RecordResponse[]>(
        "/api/record/" + year
      );
      const conferenceList: Conference[] = [];
      resp.forEach((r) => {
        const sr: SeasonRecord = {
          id: r.id,
          team: {
            id: r.teams.id,
            fullName: r.teams.name_full,
            school: r.teams.name_school,
            mascot: r.teams.mascot,
            logo: null,
          },
          year: r.year,
          division: r.division,
          conference: r.conference,
          totalWins: r.win_total,
          totalLosses: r.loss_total,
          totalTies: r.tie_total,
          totalConfWins: r.win_conf,
          totalConfLosses: r.loss_conf,
          totalConfTies: r.tie_conf,
        };
        // For every team record, see if team's conference is in conf list
        // If not, add new conference, w/team's division
        let confIndex: number;
        let divIndex: number;
        if (
          (confIndex = isTeamInExistingConference(sr, conferenceList)) === -1
        ) {
          const newConf: Conference = {
            name: sr.conference,
            divisions: new Array({
              name: sr.division,
              teams: new Array(sr),
            }),
            logo: null, // TODO add conference logo functionality
          };
          conferenceList.push(newConf);
        } else if (
          (divIndex = isTeamInExistingDivision(
            sr,
            conferenceList[confIndex].divisions
          )) === -1
        ) {
          // If team is in division that doesn't exist yet, add it
          const newDiv: ConfDivision = {
            name: sr.division,
            teams: new Array(sr),
          };
          conferenceList[confIndex].divisions.push(newDiv);
        } else {
          // Add team to existing conference/division
          conferenceList[confIndex].divisions[divIndex].teams.push(sr);
        }
      });
      return conferenceList;
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

export default RecordService;
