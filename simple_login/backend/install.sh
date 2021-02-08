# create image
docker build -t simple-login:1.0 .

# create container
docker container create --name simple-login -p 3001:3000 -e DBHOST=mongoserver simple-login:1.0

# start container
docker container start simple-login

# connect network 
docker network connect yt_network simple-login