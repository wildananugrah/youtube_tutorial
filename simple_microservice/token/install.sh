# create image
docker build -t token:1.0 . 

# create container
docker container create --name token token:1.0

# start container
docker container start token

# connect network 
docker network connect yt_network token