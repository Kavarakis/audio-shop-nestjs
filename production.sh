docker network create povionet
docker-compose up -d
docker build -t povio-nest-app .
docker run -p3000:3000 --name povio-app-docker --network povionet povio-nest-app