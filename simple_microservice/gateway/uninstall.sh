docker network disconnect yt_network gateway
docker container stop gateway
docker container rm gateway
docker image rm gateway:1.0