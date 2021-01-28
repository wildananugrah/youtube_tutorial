# create image
docker build -t user:1.0 . 

# create container
docker container create --name user user:1.0

# start container
docker container start user

# connect network 
docker network connect yt_network user