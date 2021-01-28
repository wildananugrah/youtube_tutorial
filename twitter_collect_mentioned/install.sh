# create image
docker build -t twitter_collect_mentioned:1.0 . 

# create container
docker container create --name twitter_collect_mentioned_bni -e database_host=pg -e tweet_user=@bni twitter_collect_mentioned:1.0
docker container create --name twitter_collect_mentioned_mandiri -e database_host=pg -e tweet_user=@bankmandiri twitter_collect_mentioned:1.0
docker container create --name twitter_collect_mentioned_bri -e database_host=pg -e tweet_user=@BANKBRI_ID twitter_collect_mentioned:1.0
docker container create --name twitter_collect_mentioned_bca -e database_host=pg -e tweet_user=@HaloBCA twitter_collect_mentioned:1.0

# start container
docker container start twitter_collect_mentioned_bni twitter_collect_mentioned_mandiri twitter_collect_mentioned_bri twitter_collect_mentioned_bca

# connect network
docker network connect twitter_net twitter_collect_mentioned_bni
docker network connect twitter_net twitter_collect_mentioned_mandiri
docker network connect twitter_net twitter_collect_mentioned_bri
docker network connect twitter_net twitter_collect_mentioned_bca