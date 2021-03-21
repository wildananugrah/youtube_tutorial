from requests_oauthlib import OAuth1Session
import urllib
from utils import *
import json

user_targets = ['detikcom', 'liputan6dotcom','kompascom','Beritasatu','merdekadotcom','tempodotco','KapanLagicom','tribunnews','VIVAcoid']

key = get_keys()
twitter = OAuth1Session(key['consumer_key'], client_secret=key['consumer_secret'], resource_owner_key=key['access_token'], resource_owner_secret=key['access_token_secret'])

responses = []
file = open('responses.json', 'a+')
for user in user_targets:
    q = urllib.parse.urlencode({'screen_name':user,'count': 200, 'tweet_mode':'extended'})
    url = f'https://api.twitter.com/1.1/statuses/user_timeline.json?{q}'
    twitter_response = twitter.get(url)
    for response in twitter_response.json():
        data  = { 'user' : user, 'text' : response['full_text'] }
        file.write(f"{json.dumps(data)}\n")
        
file.close()
