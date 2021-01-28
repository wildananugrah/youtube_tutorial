import requests
from requests_oauthlib import OAuth1Session
import datetime
import psycopg2
import schedule
import time
from getkey import *

HOST = "localhost"
DATABASE = "youtube"
USER = "youtube"
PASSWORD = "youtube!!"

GMAPS_BASE_URL = "https://maps.googleapis.com/maps/api/directions/json?"

def get_user_list():
    try:
        connection = psycopg2.connect(host=HOST,database=DATABASE,user=USER,password=PASSWORD)
        cursor = connection.cursor()

        print("db connected")

        query = f"SELECT id, screen_name, origin, destination FROM users"

        cursor.execute(query)
        rows = cursor.fetchall()
        data = []

        for row in rows:
            print(f"get list {row[1]}..")
            data.append({
                "id": row[0],
                "screen_name": row[1],
                "origin": row[2],
                "destination": row[3]
            })

        cursor.close()
        connection.close()

        return data
    except Exception as err:
        print(f"ERROR {err}")

def get_traffic_data_from_gmaps(users):
    try:
        data = []
        for user in users:
            API_KEY = gmaps_key()
            print("connecting gmaps api..")
            response = requests.get(f"{GMAPS_BASE_URL}origin={user['origin']}&destination={user['destination']}&departure_time=now&key={API_KEY}")
            response_json = response.json()

            # print(response_json)

            distance = response_json["routes"][0]["legs"][0]["distance"]["value"] # in metres
            duration = response_json["routes"][0]["legs"][0]["duration"]["value"] # in seconds normal
            duration_in_traffic = response_json["routes"][0]["legs"][0]["duration_in_traffic"]["value"] # in seconds current traffic
            duration_in_traffic_text = response_json["routes"][0]["legs"][0]["duration_in_traffic"]["text"] # in seconds current traffic

            status = "NORMAL"
            if (duration_in_traffic / duration) > 1.5:
                status = "TRAFFICJAM"
            
            print(f"{user['screen_name']} {status} {duration_in_traffic_text}..")

            data.append({
                "id": user['id'],
                "screen_name": user['screen_name'],
                "origin": user['origin'],
                "destination": user['destination'],
                "distance": distance,
                "duration": duration,
                "duration_in_traffic": duration_in_traffic,
                "duration_in_traffic_text": duration_in_traffic_text,
                "status": status
            })

        return data
    except Exception as err:
        print(f"ERROR {err}")

def post_tweet(traffic_data):
    _twitter_key = twitter_key()
    print(_twitter_key)
    twitter = OAuth1Session(_twitter_key['consumer_key'], client_secret=_twitter_key['consumer_secret'], resource_owner_key=_twitter_key['access_token'], resource_owner_secret=_twitter_key['access_token_secret'])
    url = "https://api.twitter.com/1.1/statuses/update.json"
    status = f"Hi @{traffic_data['screen_name']} traffic from {traffic_data['origin']} to {traffic_data['destination']} is not normal, it takes {traffic_data['duration_in_traffic_text']}."
    response = twitter.post(url, data={"status": status})

    print(f"status: {status} {response.status_code}")

def updated_data(traffic_data):
    try:
        connection = psycopg2.connect(host=HOST,database=DATABASE,user=USER,password=PASSWORD)
        cursor = connection.cursor()

        distance = traffic_data["distance"]
        duration = traffic_data["duration"]
        duration_in_traffic = traffic_data["duration_in_traffic"]
        status = traffic_data["status"]
        id = traffic_data["id"]

        print(f"updating {id} status: {status}..")

        query = f"UPDATE users SET distance='{distance}', duration='{duration}', duration_in_traffic='{duration_in_traffic}', status='{status}' WHERE id='{id}'"

        cursor.execute(query)
        connection.commit()

        cursor.close()
        connection.close()
    except Exception as err:
        print(f"ERROR {err}")

def job():
    start = datetime.datetime.now()
    print(f"started at: {start}")
    # getting list from database
    users = get_user_list()
    # getting data from gmaps
    traffic_data_list = get_traffic_data_from_gmaps(users)
    # checking
        # if not normal then post tweet and mention
    for traffic_data in traffic_data_list:
        if traffic_data["status"] != "NORMAL":
            post_tweet(traffic_data)
        # update status in db
        updated_data(traffic_data)

    end =  datetime.datetime.now()
    print(f"finished in: {end - start}")

job()

schedule.every(60).minutes.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
