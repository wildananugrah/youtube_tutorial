import requests

URL = "https://www.googleapis.com/youtube/v3/commentThreads"
API_KEY = "AIzaSyDmv-nGpUbhw53AYA7kCNqXVJaD0dTfRyk"
VIDEO_ID = "bD9CCXtQ72E"

response = requests.get(f"{URL}?key={API_KEY}&videoId={VIDEO_ID}&part=snippet")
response_json = response.json()

# print(response_json)

comments = []
while True:
    for item in response_json["items"]:
        author = item["snippet"]["topLevelComment"]["snippet"]["authorDisplayName"]
        content = item["snippet"]["topLevelComment"]["snippet"]["textOriginal"]
        published_at = item["snippet"]["topLevelComment"]["snippet"]["publishedAt"]
        comments.append({
            "author": author,
            "content": content,
            "published_at": published_at
        })
        print(f"collecting from: {author}")
    
    if "nextPageToken" in response_json:
        page_token = response_json["nextPageToken"]
        response = requests.get(f"{URL}?key={API_KEY}&videoId={VIDEO_ID}&part=snippet&pageToken={page_token}")
        response_json = response.json()
    else:
        break

print(f"\n\n\ncomments:\n{comments}")
print(f"count comment: {len(comments)}")
print("finished.")