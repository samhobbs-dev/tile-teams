import axios from "axios";
import Ranking, { RankingResponse } from "@/type/ranking";
import { logError } from "@/lib/logger";

const RankingService = {
  async getFinalAPRankingsByYear(year: number) {
    try {
      const { data: resp } = await axios.get<RankingResponse[]>(
        "/api/ranking/" + year
      );
      const rankings: Ranking[] = [];
      resp.forEach((r) => {
        rankings.push(this.createRanking(r));
      });
      return rankings;
    } catch (error) {
      logError("Failed to fetch AP rankings", error, { year });
      if (axios.isAxiosError(error)) return error.message;
      return "An unexpected error occurred";
    }
  },
  createRanking(r: RankingResponse) {
    const ranking: Ranking = {
      id: r.id,
      teamId: r.team_id,
      year: r.year,
      week: r.week,
      ranking: r.ranking,
      isPostseasonGame: r.postseason == 1,
      poll: r.poll,
      conference: r.conference,
      firstPlaceVotes: r.first_place_votes,
      points: r.points,
    };
    return ranking;
  },
};

export default RankingService;
