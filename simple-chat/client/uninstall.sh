docker network disconnect simplechatnetwork client-chat
docker container stop client-chat
docker container rm client-chat
docker image rm client-chat:1.0