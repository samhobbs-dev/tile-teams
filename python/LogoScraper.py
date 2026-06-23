import requests
import shutil
from bs4 import BeautifulSoup
from os.path import exists

file_path = 'D:\\LogoScraper\\'

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
    for link in soup.find_all('a', href=True):
        link_str = link['href']
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
    file_name = file_path + file.get('alt').split(')',1)[0].replace('/'," ") + ').png'
    if exists(file_name):
        print(file_name + ' already exists. Skipping...')
        return
    print('Saving '+file_name+'...')
    response = requests.get(file_url, stream=True)
    with open(file_name, 'wb') as out_file:
        shutil.copyfileobj(response.raw, out_file)

scrape_teams('/30/NCAA_Division_I_a-c/NCAA_a-c/logos/')
scrape_teams('/31/NCAA_Division_I_d-h/NCAA_d-h/logos/')
scrape_teams('/32/NCAA_Division_I_i-m/NCAA_i-m/logos/')
scrape_teams('/33/NCAA_Division_I_n-r/NCAA_n-r/logos/')
scrape_teams('/34/NCAA_Division_I_s-t/NCAA_s-t/logos/')
scrape_teams('/35/NCAA_Division_I_u-z/NCAA_u-z/logos/')
