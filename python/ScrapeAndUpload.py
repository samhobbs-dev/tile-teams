headers = {
    "accept": "application/json",
    "Authorization": "Bearer WXIGJhaBXf3xQfx/Ctrh4seXMLjAojnbQKhpouBKgzZYVVXydpI6jourT5YJ45sA"
}
from supabase import create_client, Client
import requests#, pymysql

# import psycopg2

url: str = "https://yjejnpbtzxghuxajfdqk.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqZWpucGJ0enhnaHV4YWpmZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzMjc4MjYsImV4cCI6MjAzMzkwMzgyNn0.6sEB4BL6UGf7vP4XVL8dIxl5DiE5-R6WvO00_8AAsbI"
supabase: Client = create_client(url, key)

# TODO ask user for year
current_year = 2025
BATCH_SIZE = 1000

try:
    # Teams (update if necessary)
    # endpoint = "https://api.collegefootballdata.com/teams"
    # req = requests.get(endpoint, headers=headers)
    # teams = req.json()
    # teams_rows = []
    # for t in teams:
    #     response = (
    #         supabase
    #         .table("teams")
    #         .select("*")
    #         .eq("id", t['id'])
    #         .limit(1)
    #         .execute()
    #     )
    #     if len(response.data) > 0:
    #         continue
    #     school = t.get("school") or ""
    #     mascot = t.get("mascot") or ""
    #     full_name = f"{school} {mascot}".strip()
    #     teams_rows.append({
    #         "id": t['id'],
    #         "name_full": full_name,
    #         "name_school": t['school'],
    #         "mascot": t['mascot'],
    #     })
    # for i in range(0, len(teams_rows), BATCH_SIZE):
    #     batch = teams_rows[i:i + BATCH_SIZE]

    #     supabase.table("teams").insert(batch).execute()
    
    # Games
    # endpoint = "https://api.collegefootballdata.com/games"
    # params = {"year" : str(current_year) }
    # req = requests.get(endpoint, headers=headers, params=params)
    # games = req.json()
    # game_rows = []
    # for g in games:
    #     game_rows.append({
    #         "year": int(current_year),
    #         "week": g['week'],
    #         "id_home_team": g['homeId'],
    #         "id_away_team": g['awayId'],
    #         "points_home": g['homePoints'],
    #         "points_away": g['awayPoints'],
    #         "completed": 1 if g['completed'] == True else 0,
    #         "postseason": 1 if g['seasonType'] == 'postseason' else 0,
    #         "conference_game": 1 if g['conferenceGame'] == True else 0
    #     })
    # for i in range(0, len(game_rows), BATCH_SIZE):
    #     batch = game_rows[i:i + BATCH_SIZE]

    #     supabase.table("games").insert(batch).execute()

    # # Rankings
    # # Regular season & postseason
    # endpoint = "https://api.collegefootballdata.com/rankings"
    # # Load all teams once into a lookup map
    # teams = supabase.table("teams").select("id,name_school").execute()

    # team_map = {
    #     t["name_school"]: t["id"]
    #     for t in teams.data
    # }
    # ranking_rows = []
    # for season_type in ["regular","postseason"]:
    #     params = { "year" : str(current_year), "seasonType" : season_type }        
    #     req = requests.get(endpoint, headers=headers, params=params)
    #     seasons = req.json()
    #     for s in seasons:             
    #         year = s['season']
    #         week = s['week']
    #         polls = s['polls']
    #         for p in polls:
    #             poll_name = p['poll']
    #             ranks = p['ranks']
    #             for r in ranks:
    #                 school = r["school"]

    #                 team_id = team_map.get(school)
    #                 if team_id is None:
    #                     continue  # skip unknown teams instead of querying DB

    #                 postseason = 1 if season_type == "postseason" else 0

    #                 ranking_rows.append({
    #                     "team_id": team_id,
    #                     "year": year,
    #                     "week": week,
    #                     "postseason": postseason,
    #                     "poll": poll_name,
    #                     "first_place_votes": r.get("firstPlaceVotes"),
    #                     "points": r.get("points"),
    #                     "conference": r.get("conference"),
    #                     "ranking": r.get("rank")
    #                 })

    # for i in range(0, len(ranking_rows), BATCH_SIZE):
    #     batch = ranking_rows[i:i + BATCH_SIZE]

    #     supabase.table("rankings").insert(batch).execute()

    # Records
    endpoint = "https://api.collegefootballdata.com/records"
    params = {"year" : str(current_year) }
    req = requests.get(endpoint, headers=headers, params=params)
    records = req.json()
    record_rows = []
    for r in records:
        if r['conference'] in [
                    'ACC',
                    'American Athletic',
                    'Big 12',
                    'Big Ten',
                    'Conference USA',
                    'FBS Independents',
                    'Mid-American',
                    'Mountain West',
                    'Pac-12',
                    'SEC',
                    'Sun Belt']:
            record_rows.append({
                "year": int(current_year),
                "team_id": r['teamId'],
                "division": r['division'],
                "conference": r['conference'],
                "win_total": r['total']['wins'],
                "loss_total": r['total']['losses'],
                "tie_total": r['total']['ties'],
                "win_conf": r['conferenceGames']['wins'],
                "loss_conf": r['conferenceGames']['losses'],
                "tie_conf": r['conferenceGames']['ties'],
            })

    for i in range(0, len(record_rows), BATCH_SIZE):
        batch = record_rows[i:i + BATCH_SIZE]

        supabase.table("records").insert(batch).execute()


except Exception:
    # con.rollback()
    print("Database exception")
    raise