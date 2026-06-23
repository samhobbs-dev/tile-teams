import requests, json, pymysql

mysql = {'host':'localhost', 'user':'root', 'password':'root', 'db':'cfbdb'}

# Fetch every full team name + id, save to SQL (FBS only for now)
endpoint = "https://api.collegefootballdata.com/teams/fbs"
headers = {
    "accept": "application/json",
    "Authorization": "Bearer WXIGJhaBXf3xQfx/Ctrh4seXMLjAojnbQKhpouBKgzZYVVXydpI6jourT5YJ45sA"
}

con = pymysql.connect(host=mysql['host'],user=mysql['user'],password=mysql['password'],database=mysql['db'])
try:
    cur = con.cursor()

    r = requests.get(endpoint, headers=headers)
    schools = r.json()
    for s in schools:
        id = s['id']
        name = (s['school'] + ' ' + s['mascot']).replace("'","\\'")
        print('Inserting '+str(id) + ' ' + name)
        cur.execute("INSERT INTO teams (id, name_full) VALUES ("+str(id)+",'"+name+"')")

    con.commit()

except Exception:
    con.rollback()
    print("Database exception")
    raise
finally:
    con.close()

