import requests
import shutil
from bs4 import BeautifulSoup
from os.path import exists

file_path = 'D:\\LogoScraper\\'

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
    file_name = file_path + file.get('alt').rsplit(')',2)[0].replace('/'," ") + ').png'
    if exists(file_name):
        print(file_name + ' already exists. Skipping...')
        return
    print('Saving '+file_name+'...')
    response = requests.get(file_url, stream=True)
    with open(file_name, 'wb') as out_file:
        shutil.copyfileobj(response.raw, out_file)

#scrape_team('/logos/list_by_team/6846/Miami_Ohio_Redskins/')
scrape_team('/logos/list_by_team/749/Miami_Ohio_Redhawks')

