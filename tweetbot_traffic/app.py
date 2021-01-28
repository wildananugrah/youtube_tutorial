from getkey import *
import psycopg2
import urllib
import requests
import time
import datetime
import schedule
from requests_oauthlib import OAuth1Session

DB_HOST = "localhost"
DB_NAME = "youtube"
DB_USER = "youtube"
DB_PASS = "youtube!!"
MY_TWITTER_ACCOUNT = "@wildananugrah03"
TWIITER_SEARCH_URL = "https://api.twitter.com/1.1/search/tweets.json"
GOOGLE_MAPS_URL = "https://maps.googleapis.com/maps/api/directions/json?"
TWITTER_POST_URL = "https://api.twitter.com/1.1/statuses/update.json"

def get_tweet_mentions():
    try:
        
        # database
        connection = psycopg2.connect(host=DB_HOST,database=DB_NAME,user=DB_USER,password=DB_PASS)
        cursor = connection.cursor()

        query = "SELECT tweet_id FROM tweet_mentions ORDER BY created_at DESC LIMIT 1"
        cursor.execute(query)
        row = cursor.fetchone()

        tweet_id = None
        if(row != None):
            print(f"last tweet id: {row[0]}")
            tweet_id = row[0]

        # twitter
        key = twitter_key()
        twiiter = OAuth1Session(key['consumer_key'], client_secret=key['consumer_secret'], resource_owner_key=key['access_token'], resource_owner_secret=key['access_token_secret'])

        twitter_query = {}
        twitter_query['q'] = MY_TWITTER_ACCOUNT
        twitter_query['result_type'] = 'recent'
        if(tweet_id != None):
            twitter_query['since_id'] = tweet_id
        
        q = urllib.parse.urlencode(twitter_query)
        response = twiiter.get(f"{TWIITER_SEARCH_URL}?{q}")
        response_json = response.json()

        data = []
        for status in response_json['statuses']:
            created_at = status['created_at']
            content = status['text'].replace(MY_TWITTER_ACCOUNT, "").strip()
            screen_name = status['user']['screen_name']
            tweet_id = status['id_str']

            print(f"{screen_name} : {content}")
            
            query = f"SELECT * FROM tweet_mentions WHERE tweet_id='{tweet_id}'"
            cursor.execute(query)

            if(content.lower().startswith("duration") and cursor.rowcount == 0):
                content = content.split("?")
                keyword = content[0].strip()
                places = content[1].split(",")
                origin = places[0].strip()
                destination = places[1].strip()

                print(f"{keyword}: {origin} to {destination} by @{screen_name}")

                data.append({
                    'tweet_id': tweet_id,
                    'screen_name': screen_name,
                    'origin': origin,
                    'destination': destination
                })
        
        cursor.close()
        connection.close()

        return data

    except Exception as err:
        print(f"ERROR {err}")

def get_gmaps_traffic_data(tweets):
    try:
        API_KEY = gmaps_key()
        data = []
        for tweet in tweets:
            print("connecting to gmaps api..")

            screen_name = tweet['screen_name']
            origin = tweet['origin']
            destination = tweet['destination']
            tweet_id = tweet['tweet_id']

            response = requests.get(f"{GOOGLE_MAPS_URL}origin={origin}&destination={destination}&departure_time=now&key={API_KEY}")
            response_json = response.json()

            if(response.status_code != 200):
                print(f"{screen_name} {response.status_code}..")
                data.append({ "code": "ERROR", "screen_name": screen_name, "tweet_id": tweet_id, "message" : "Something went wrong!" })
            elif(len(response_json["routes"]) == 0): 
                print(f"{screen_name} routes: {len(response_json['routes'])}..")
                data.append({ "code": "ERROR", "screen_name": screen_name, "tweet_id": tweet_id, "message" : "We can not find the routes!" })
            else:
                routes = response_json['routes'][0]['legs'][0]
                distance = routes['distance']['value']
                duration = routes['duration']['value']
                duration_in_traffic = routes['duration_in_traffic']['value']
                duration_in_traffic_text = routes['duration_in_traffic']['text']

                status = "NORMAL"
                if((duration_in_traffic / duration) > 1.2):
                    status = "TRAFFICJAM"
                
                print(f"{screen_name} {status} {duration_in_traffic_text}..")

                data.append({
                    "code":"OK",
                    "tweet_id":tweet_id,
                    "screen_name": screen_name,
                    "origin": origin,
                    "destination": destination,
                    "distance": distance,
                    "duration": duration,
                    "duration_in_traffic": duration_in_traffic,
                    "duration_in_traffic_text": duration_in_traffic_text,
                    "status" :status,
                    "message": ""
                })

        return data
    except Exception as err:
        print(f"ERROR {err}")

def post_tweet(data_list):
    try:
        
        key = twitter_key()
        twitter = OAuth1Session(key['consumer_key'], client_secret=key['consumer_secret'], resource_owner_key=key['access_token'], resource_owner_secret=key['access_token_secret'])

        for data in data_list:
            status = ""
            screen_name = data['screen_name']
            origin = data['origin']
            destination = data['destination']
            duration_in_traffic_text = data['duration_in_traffic_text']
            message = data['message']

            if(data['code'] == 'OK'):
                status = f"Hi @{screen_name} driving from {origin} to {destination} takes {duration_in_traffic_text} now."
            else:
                status = f"hi @{screen_name} {message}"
            
            response = twitter.post(TWITTER_POST_URL, data={'status': status})
            print(f"post tweet mention @{screen_name} {response.status_code}")

    except Exception as err:
        print(f"ERROR {err}")

def insert_to_database(data_list):
    try:
        connection = psycopg2.connect(host=DB_HOST,database=DB_NAME,user=DB_USER,password=DB_PASS)
        cursor = connection.cursor()

        for data in data_list:
            tweet_id = data['tweet_id']
            screen_name = data['screen_name']
            duration = data['duration']
            distance = data['distance']
            duration_in_traffic = data['duration_in_traffic']
            status = data['status']

            query = f"SELECT * FROM tweet_mentions WHERE tweet_id='{tweet_id}'"

            cursor.execute(query)

            if(cursor.rowcount == 1):
                continue

            query = ""
            if(data['code'] == "ERROR"):
                query = f"INSERT INTO tweet_mentions(id, tweet_id, screen_name, created_at, updated_at) VALUES(uuid_generate_v4(),'{tweet_id}','{screen_name}',current_timestamp, current_timestamp)"
            else:
                query = f"""
                    INSERT INTO tweet_mentions(id, tweet_id, screen_name,distance, duration, duration_in_traffic, status, created_at, updated_at) 
                    VALUES(uuid_generate_v4(),'{tweet_id}','{screen_name}','{distance}','{duration}','{duration_in_traffic}','{status}',current_timestamp, current_timestamp)
                """
            
            cursor.execute(query)
            connection.commit()

        cursor.close()
        connection.close()
    except Exception as err:
        print(f"ERROR {err}")

def job():
    start = datetime.datetime.now()
    print(f"started at: {start}")
    # getting tweet mentions
    tweets = get_tweet_mentions()
    # getting gmaps traffic data
    traffic_data_list = get_gmaps_traffic_data(tweets)
    # post a tweet
    post_tweet(traffic_data_list)
    # insert to database
    insert_to_database(traffic_data_list)
    end = datetime.datetime.now()
    print(f"finished in {end - start}")

job()

schedule.every(5).seconds.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
