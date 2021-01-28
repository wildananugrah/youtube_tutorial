from requests_oauthlib import OAuth1Session
from datetime import datetime
import urllib
import os
from getkey import *
import psycopg2
import schedule
import time

# database config
DATABASE_NAME = os.environ.get('database_name') if os.environ.get('database_name') != None else "twitter"
DATABASE_USER = os.environ.get('database_user') if os.environ.get('database_user') !=  None else "twitter"
DATABASE_HOST = os.environ.get('database_host') if os.environ.get('database_host') !=  None else "localhost"
DATABASE_PASS = os.environ.get('database_pass') if os.environ.get('database_pass') != None else "twitter!!"

# config
TWEET_USER = os.environ.get('tweet_user') if os.environ.get('tweet_user') != None else "@bni"

def get_mention_tweets():
    key = twitter_key()
    twitter = OAuth1Session(key['consumer_key'], client_secret=key['consumer_secret'], resource_owner_key=key['access_token'], resource_owner_secret=key['access_token_secret'])
    q = urllib.parse.urlencode({'q':TWEET_USER,'count': 100, 'tweet_mode':'extended'})
    url = f'https://api.twitter.com/1.1/search/tweets.json?{q}'
    response = twitter.get(url)
    data = []
    if(response.status_code == 200):
        response_json = response.json()
        for status in response_json['statuses']:
            created_at = datetime.strptime(status["created_at"],"%a %b %d %H:%M:%S +0000 %Y")
            data.append({
                'posted_at': created_at,
                'tweet_id': status['id_str'],
                'text' : status['full_text'].replace("\'",""),
                'tweet_link': f"https://www.twitter.com/{status['user']['screen_name']}/status/{status['id_str']}",
                'author_screen_name': status['user']['screen_name'],
                'author_protected': status['user']['protected'],
                'author_followers_count': status['user']['followers_count'],
                'author_statuses_count': status['user']['statuses_count'],
                'author_verified': status['user']['verified']
            })
    else:
        print(response.json())
    
    return data

def insert_to_db(tweets):
    connection = psycopg2.connect(f"dbname='{DATABASE_NAME}' user='{DATABASE_USER}' host='{DATABASE_HOST}' password='{DATABASE_PASS}'")
    cursor = connection.cursor()
    print("DB connected")

    for tweet in tweets:
        query = f"SELECT * FROM tweet_posts WHERE tweet_id='{tweet['tweet_id']}'"
        cursor.execute(query)

        if(cursor.rowcount == 1):
            print(f"skipping tweetid: {tweet['tweet_id']}")
            continue
        else:
            print(f"inserting tweetid: {tweet['tweet_id']}")
            query = f"""
            INSERT INTO tweet_posts(id, tweet_id, tweet_user, content, tweet_link, author, author_followers_count, author_statuses_count, author_verified,author_protected, posted_at, created_at, updated_at)
            VALUES(uuid_generate_v1(),'{tweet['tweet_id']}','{TWEET_USER}','{tweet['text']}','{tweet['tweet_link']}','{tweet['author_screen_name']}','{tweet['author_followers_count']}','{tweet['author_statuses_count']}','{tweet['author_verified']}','{tweet['author_protected']}','{tweet['posted_at']}',current_timestamp, current_timestamp)
            """
        cursor.execute(query)
        connection.commit()

    cursor.close()
    connection.close()

def job():
    start = datetime.now()
    print(f"started at: {start}")
    tweets = get_mention_tweets()
    insert_to_db(tweets)
    end = datetime.now()
    print(f"finished in: {end - start}")

job()

schedule.every(int(10)).seconds.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)