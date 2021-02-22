docker network disconnect simplechatnetwork socket-server-chat
docker container stop socket-server-chat
docker container rm socket-server-chat
docker image rm socket-server-chat:1.0