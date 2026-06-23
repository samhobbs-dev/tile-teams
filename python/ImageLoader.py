import requests, json, pymysql, os

mysql = {'host':'localhost', 'user':'root', 'password':'root', 'db':'cfbdb'}
con = pymysql.connect(host=mysql['host'],user=mysql['user'],password=mysql['password'],database=mysql['db'])
directory = 'D:\\LogoScraper\\'

def fetch_team_id(school_dic,school_name):
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
    else:
        try:
            return school_dic[school_name]
        except:
            return -1

try:
    cur = con.cursor()
    # Fetch schools from DB
    cur.execute("SELECT * FROM teams")
    schools = cur.fetchall()
    school_dic = {}
    for row in schools:
        #id = row['id']
        #name = row['name_full']
        id = row[0]
        name = row[1]
        school_dic.update({name : id})

    # Iterate over all images, store based on format & matching
    for file in os.listdir(directory):
        filename = os.fsdecode(file)
        blob_value = open(directory + filename,'rb').read()
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

        if team_id != -1:
            print('Saving '+school_name+' '+years+'...')
            if last_year != 'Pres':
                sql = 'INSERT INTO logos(team_id,image,year_first,year_last) VALUES(%s,%s,%s,%s)'
                args = (team_id,blob_value,start_year,int(last_year)-1)
            else:
                sql = 'INSERT INTO logos(team_id,image,year_first) VALUES(%s,%s,%s)'
                args = (team_id,blob_value,start_year)
            cur.execute(sql,args)
            
    con.commit()

except Exception:
    con.rollback()
    print("Database exception")
    raise
finally:
    con.close()