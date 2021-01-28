from requests_oauthlib import OAuth1Session
import pymongo
import schedule
import datetime
import time

def job():
    start = datetime.datetime.now()
    print(f"started at: {start.strftime('%d-%m-%y %H:%M:%S')}")

    twitter = OAuth1Session('YOUR API KEY', client_secret='YOUR API KEY SECRET', resource_owner_key='YOUR ACCESS TOKEN', resource_owner_secret='YOUR ACCESS TOKEN SECRET')
    url = 'https://api.twitter.com/1.1/search/tweets.json?q=indonesia'
    response = twitter.get(url).json()

    data = []
    tweets = response["statuses"]

    for tweet in tweets:
        data.append({ 
            "tweet_id": tweet['id_str'], 
            "text": tweet['text'], 
            "screen_name": tweet['user']['screen_name'], 
            "posted_at": tweet['created_at'] })

    connection = pymongo.MongoClient("mongoserver", 27017)
    database = connection["yt_tweetapidb"]
    collection = database["tweet_search"]

    collection.insert_many(data)
    
    end = datetime.datetime.now()

    connection.close()

    print(f"finished in {end - start}")

schedule.every(5).seconds.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
