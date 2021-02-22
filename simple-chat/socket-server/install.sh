docker build -t socket-server-chat:1.0 . 
docker container create --name socket-server-chat -p 3002:3002 socket-server-chat:1.0
docker container start socket-server-chat
docker network connect simplechatnetwork socket-server-chat