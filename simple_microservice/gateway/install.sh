# create image
docker build -t gateway:1.0 . 

# create container
docker container create --name gateway -p 7000:7000 gateway:1.0

# start container
docker container start gateway

# connect network 
docker network connect yt_network gateway