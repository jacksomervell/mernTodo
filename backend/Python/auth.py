import asyncio, sys, getopt, time, requests, json

session = requests.session()

url = 'https://users.premierleague.com/accounts/login/'

leagueID = sys.argv[1]

payload = {
 'password': 'Bl4ckb0ard',
 'login': 'jacksomervell@gmail.com',
 'redirect_uri': 'https://fantasy.premierleague.com/a/login',
 'app': 'plfpl-web'
}
session.post(url, data=payload)

response = session.get('https://fantasy.premierleague.com/api/leagues-classic/'+leagueID+'/standings/')

print(leagueID)
print(response.text)