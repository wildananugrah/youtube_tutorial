docker build -t client-chat:1.0 . 
docker container create --name client-chat -p 3000:3000 client-chat:1.0
docker container start client-chat
docker network connect simplechatnetwork client-chat