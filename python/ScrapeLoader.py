import shutil
from bs4 import BeautifulSoup
from os.path import exists
import requests # json, pymysql, os
import boto3
from supabase import create_client, Client
# import psycopg2

url: str = "https://yjejnpbtzxghuxajfdqk.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqZWpucGJ0enhnaHV4YWpmZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzMjc4MjYsImV4cCI6MjAzMzkwMzgyNn0.6sEB4BL6UGf7vP4XVL8dIxl5DiE5-R6WvO00_8AAsbI"
supabase: Client = create_client(url, key)

s3 = boto3.resource('s3')
# pg = {
#     'host': 'https://yjejnpbtzxghuxajfdqk.supabase.co',  # e.g., 'db.your-supabase-instance.supabase.co'
#     'port': '5432',  # Default PostgreSQL port
#     'user': 'your_database_user',
#     'password': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqZWpucGJ0enhnaHV4YWpmZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzMjc4MjYsImV4cCI6MjAzMzkwMzgyNn0.6sEB4BL6UGf7vP4XVL8dIxl5DiE5-R6WvO00_8AAsbI',
#     'dbname': 'cfbdb'  # Your database name
# }

# try:
#     con = psycopg2.connect(
#         host=pg['host'],
#         port=pg['port'],
#         user=pg['user'],
#         password=pg['password'],
#         dbname=pg['dbname']
#     )
#     print("Connection successful")
# except Exception as e:
#     print(f"An error occurred: {e}")

headers = {
    "accept": "application/json",
    "Authorization": "Bearer WXIGJhaBXf3xQfx/Ctrh4seXMLjAojnbQKhpouBKgzZYVVXydpI6jourT5YJ45sA"
}
file_path = 'D:\\LogoScraper\\'
#--------------------------SCRAPE FUNCTIONS--------------------------
def scrape_teams(link):
    url = 'https://www.sportslogos.net/teams/list_by_league' + link
    print('Requesting '+url+'...')
    teams_page = requests.get(url)
    soup = BeautifulSoup(teams_page.content, 'html.parser')
    # Account for both logo walls for present & past teams
    for logo_wall in soup.find_all('ul', attrs={'class' : 'logoWall'}):
        for team_link in logo_wall.find_all('a', href=True):
            link = team_link['href']
            scrape_team(link)

def scrape_team(link):
    url = 'https://www.sportslogos.net' + link
    print('Requesting '+url+'...')
    team_page = requests.get(url)
    # Find links to all logos
    soup = BeautifulSoup(team_page.content, 'html.parser')
    for html_link in soup.find_all('a', href=True):
        link_str = html_link['href']
        if 'Primary_Logo' in link_str:
            print('Current logo: '+link_str)
            logo_url = 'https://www.sportslogos.net' + link_str
            logo_page = requests.get(logo_url)
            soup = BeautifulSoup(logo_page.content, 'html.parser')
            main_logo = soup.find('div', attrs={'id' : 'mainLogo'})
            file = main_logo.find('img')
            save_logo(file)

def save_logo(file):
    file_url = file.get('src')
    # TODO test this new parsing method
    file_name = file_path + file.get('alt').split(' - ')[0].replace('/',' ')+'.png'
    if exists(file_name):
        print(file_name + ' already exists. Skipping...')
        return
    print('Saving '+file_name+'...')
    response = requests.get(file_url, stream=True)
    with open(file_name, 'wb') as out_file:
        shutil.copyfileobj(response.raw, out_file)

#--------------------------LOADER FUNCTIONS--------------------------
def fetch_team_id(school_dic,school_name):
    # TODO NOTE not all schools are represented here
    # Fix is to rename all applicable schools to correct one in DB manually (see missing.txt)
    # Name full only matters for matching w/Sports Logos; preferred school name is still in DB
    # Some teams did not play CFB, have logos have null team id
    if 'FIU' in school_name:
        return school_dic['Florida International Golden Panthers']
    elif 'Hawaii' in school_name:
        return school_dic['Hawai\'i Rainbow Warriors']
    elif 'Ragin Cajuns' in school_name:
        return school_dic['Louisiana Ragin\' Cajuns']
    elif 'Miami (Ohio)' in school_name:
        return school_dic['Miami (OH) RedHawks']
    elif 'Louisiana-Monroe' in school_name:
        return school_dic['Louisiana Monroe Warhawks']
    elif 'North Carolina State' in school_name:
        return school_dic['NC State Wolfpack']
    elif 'Southern Miss' in school_name:
        return school_dic['Southern Mississippi Golden Eagles']
    elif 'Texas-SA' in school_name:
        return school_dic['UT San Antonio Roadrunners']
    elif 'Massachusetts' in school_name:
        return school_dic['UMass Minutemen']
    elif 'Central Florida' in school_name:
        return school_dic['UCF Knights']
    elif 'San Jose' in school_name:
        return school_dic['San José State Spartans']
    elif 'Dixie State' in school_name:
        return school_dic['Utah Tech Trailblazers']
    elif 'Arkansas State' in school_name:
        return school_dic['Arkansas State Red Wolves']
    else:
        try:
            return school_dic[school_name]
        except:
            return -1

def load_images():
    con = pymysql.connect(host=mysql['host'],user=mysql['user'],password=mysql['password'],database=mysql['db'])
    # Load image filenames to DB - manually upload downloaded images to hosting service
    missing_file = open("missing.txt","w")
    missing_file.write("Missing schools: \n")
    missing_school_current = ''
    try:
        cur = con.cursor()
        # Fetch schools from DB
        cur.execute("SELECT id,name_full FROM teams")
        schools = cur.fetchall()
        school_dic = {}
        for row in schools:
            id = row[0]
            name = row[1]
            school_dic.update({name : id})

        # Iterate over all images, store based on format & matching
        for file in os.listdir(file_path):
            filename = os.fsdecode(file)
            # blob_value = open(file_path + filename,'rb').read()
            school_name = filename.split(' Logo')[0]
            years = filename.rsplit('(',1)[1].split(')')[0]
            print(filename)
            year_list = years.split('-')
            if  len(year_list) == 1:
                start_year = last_year = year_list[0]
            else:
                start_year, last_year = year_list

            # Fetch team's ID from school list
            team_id = fetch_team_id(school_dic,school_name)
            print('Team ID: '+str(team_id))

            print('Saving '+school_name+' '+years+'...')
            if team_id != -1:
                if last_year == 'Pres':
                    sql = 'INSERT INTO logos(team_id,image,year_first) VALUES(%s,%s,%s)'
                    args = (team_id,filename,start_year)
                # Deal w/issue where SL logo years are listed as single, fixing inconsistency
                elif start_year == last_year:
                    sql = 'INSERT INTO logos(team_id,image,year_first,year_last) VALUES(%s,%s,%s,%s)'
                    args = (team_id,filename,start_year,last_year)
                else:
                    sql = 'INSERT INTO logos(team_id,image,year_first,year_last) VALUES(%s,%s,%s,%s)'
                    args = (team_id,filename,start_year,int(last_year)-1)
            else:
                if missing_school_current != school_name:
                    # Write which schools didn't make it for fixing
                    missing_file.write(school_name+"\n")   
                    missing_school_current = school_name

                # Add logo to DB even if team id wasn't found (TODO is this a good idea??)
                if last_year == 'Pres':
                    sql = 'INSERT INTO logos(image,year_first) VALUES(%s,%s)'
                    args = (filename,start_year)
                # Deal w/issue where SL logo years are listed as single, fixing inconsistency
                elif start_year == last_year:
                    sql = 'INSERT INTO logos(image,year_first,year_last) VALUES(%s,%s,%s)'
                    args = (filename,start_year,last_year)
                else:
                    sql = 'INSERT INTO logos(image,year_first,year_last) VALUES(%s,%s,%s)'
                    args = (filename,start_year,int(last_year)-1)
            cur.execute(sql,args)

        con.commit()
    except Exception:
        con.rollback()
        print("Database exception")
        raise
    finally:
        con.close()
        missing_file.close()

def fetch_teams():
    # cur = con.cursor()
    print('Fetching & saving teams...')
    # Fetch every full team name + id, save to SQL
    endpoint = "https://api.collegefootballdata.com/teams"
    r = requests.get(endpoint, headers=headers)
    schools = r.json()
    for s in schools:
        id = s['id']
        school_name = s['school'].replace("'","\'")
        mascot = s['mascot']
        if mascot != None:
            mascot.replace("'","\'")
            full_name = school_name + ' ' + mascot
        else:
            full_name = school_name
        # Check if school is already present
        # cur.execute("SELECT * FROM teams where id = %s",str(id))
        response = supabase.table('teams').select("id").eq("id", id).execute()
        if (response.data):
            ()
            # Update if already present
            # print('Updating '+str(id) + ' ' + school_name)
            # sql = "UPDATE teams SET name_school = %s, mascot = %s, name_full = %s WHERE id = %s"
            # args = (school_name,mascot,full_name,str(id))
        else:   
            # Add if absent
            print('Inserting '+str(id) + ' ' + school_name)
            sql = "INSERT INTO teams (id, name_school, mascot, name_full) VALUES (%s,%s,%s,%s)"
            args = (str(id),school_name,mascot,full_name)
            data = {
                'id': id,
                'name_school': school_name,
                'mascot': mascot,
                'name_full': full_name
            }
            supabase.table('teams').insert(data).execute()
        # cur.execute(sql,args)
    # con.commit()

def fetch_team_records():
    # cur = con.cursor()
    print('Fetching team records...')
    # Fetch & save team records for each year from 1897 to 2022 (iterated)
    endpoint = "https://api.collegefootballdata.com/records"
    # Second parameter is year after last record year
    for current_year in range(2023,2025):
        params = { "year" : str(current_year) }
        print('Current year: '+str(current_year))
        r = requests.get(endpoint, headers=headers, params=params)
        records = r.json()
        for record in records:
            print('Inserting '+record['team']+' '+str(record['year']))
            year = record['year']
            # Get team id by searching DB
            # cur.execute("SELECT id FROM teams where name_school = %s",record['team'])
            response = supabase.table("teams").select("id").eq("name_school",record['team']).execute()
            # team_id = cur.fetchone()[0]
            # print(response)
            if len(response.data) > 0:
                team_id = response.data[0]['id']
                division = record['division']
                conference = record['conference']
                win_total = record['total']['wins']
                loss_total = record['total']['losses']
                tie_total = record['total']['ties']
                win_conf = record['conferenceGames']['wins']
                loss_conf = record['conferenceGames']['losses']
                tie_conf = record['conferenceGames']['ties']
                data = {
                    'year': year,
                    'team_id': team_id,
                    'division': division,
                    'conference': conference,
                    'win_total': win_total,
                    'loss_total': loss_total,
                    'tie_total': tie_total,
                    'win_conf': win_conf,
                    'loss_conf': loss_conf,
                    'tie_conf': tie_conf
                }
                if conference in [
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
                    supabase.table('records').insert(data).execute()
            else:
                print(record['team']+'not found!')
        # Due to massive number of records, commit after each year as an interval
        # con.commit()    

def fetch_games():
    # cur = con.cursor()
    data = {}
    # Fetch & save games, each year from 1869 to 2022
    print('Fetching all games...')
    endpoint = "https://api.collegefootballdata.com/games"
    # Second parameter is year after last record year
    for current_year in range(2023,2025):
        print('Current year: '+str(current_year))
        # Regular season & postseason
        for season_type in ["regular","postseason"]:
            params = { "year" : str(current_year), "seasonType" : season_type }        
            r = requests.get(endpoint, headers=headers, params=params)
            games = r.json()
            for g in games:
                year = g['season']
                week = g['week']
                postseason = 1 if season_type == "postseason" else 0
                id_home_team = g['home_id']
                id_away_team = g['away_id']
                points_home = g['home_points']
                points_away = g['away_points']
                completed = 1 if g['completed'] == True else 0
                # Sometimes conference game is null in CFDB, will be false in ours
                conference_game = 1 if g['conference_game'] == True else 0
                if completed == True:
                    # Account for CFDB bug where some games are marked as completed yet have no points (null)
                    if points_home == None and points_away == None:
                        data = {
                            'year': year,
                            'week': week,
                            'postseason': postseason,
                            'id_home_team': id_home_team,
                            'id_away_team': id_away_team,
                            'points_home': None,
                            'points_away': None,
                            'completed': completed,
                            'conference_game': conference_game
                        }
                    else:
                        data = {
                            'year': year,
                            'week': week,
                            'postseason': postseason,
                            'id_home_team': id_home_team,
                            'id_away_team': id_away_team,
                            'points_home': points_home,
                            'points_away': points_away,
                            'completed': completed,
                            'conference_game': conference_game
                        }
                else:
                    data = {
                            'year': year,
                            'week': week,
                            'postseason': postseason,
                            'id_home_team': id_home_team,
                            'id_away_team': id_away_team,
                            'completed': completed,
                            'conference_game': conference_game
                        }
                # print(data)
                supabase.table('games').insert(data).execute()
                # cur.execute(sql,args)       
        # Due to massive number of records, commit after each year as an interval
        # con.commit()   

# Fetch every full team name + id, save to SQL
try:
    fetch_team_records()
    # fetch_teams()
    # fetch_games()
except Exception:
    # con.rollback()
    print("Database exception")
    raise
# finally:
    # con.close()

# Scrape every team, save images to drive
# scrape_teams('/30/NCAA_Division_I_a-c/NCAA_a-c/logos/')
# scrape_teams('/31/NCAA_Division_I_d-h/NCAA_d-h/logos/')
# scrape_teams('/32/NCAA_Division_I_i-m/NCAA_i-m/logos/')
# scrape_teams('/33/NCAA_Division_I_n-r/NCAA_n-r/logos/')
# scrape_teams('/34/NCAA_Division_I_s-t/NCAA_s-t/logos/')
# scrape_teams('/35/NCAA_Division_I_u-z/NCAA_u-z/logos/')
# load_images()

