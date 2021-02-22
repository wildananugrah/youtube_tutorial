docker network disconnect simplechatnetwork app-server-chat
docker container stop app-server-chat
docker container rm app-server-chat
docker image rm app-server-chat:1.0