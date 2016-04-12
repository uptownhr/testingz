# Docker Basics
If you are using docker here are some useful commands to know

## docker ps
This will show all the running processes started from docker-compose up
```
CONTAINER ID        IMAGE                      COMMAND                  CREATED             STATUS              PORTS                                      NAMES
f8a0b7b07f1c        node:5.8.0                 "npm run dev-docker"     16 hours ago        Up 16 hours         0.0.0.0:3000->3000/tcp                     hackathonstarterlite_app_1
517999e9ba29        mongo                      "/entrypoint.sh mongo"   16 hours ago        Up 16 hours         27017/tcp                                  hackathonstarterlite_mongo_1
26bd3d194207        redis                      "/entrypoint.sh redis"   16 hours ago        Up 16 hours         6379/tcp                                   hackathonstarterlite_redis_1
```
## docker exec
This will allow you to issue additional commands inside a running container.

Useful to get shell access.

`docker exec -it hackathonstarterlite_app_1 bash`

Get into mongo shell.

`docker exec -it hackathonstarterlite_mongo_1 mongo`

## docker restart

Sometimes nodemon crashes and fails to restart

`docker restart hackathonstarterlite_app_1`
