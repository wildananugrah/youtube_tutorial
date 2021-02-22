docker build -t app-server-chat:1.0 . 
docker container create --name app-server-chat -p 3001:3001 -e DBHOST=mongoserver app-server-chat:1.0
docker container start app-server-chat
docker network connect simplechatnetwork app-server-chat