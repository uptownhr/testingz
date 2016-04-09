# hackathon-starter-lite
lighter and easier version of hackathon starter

[![Build Status](https://travis-ci.org/uptownhr/hackathon-starter-lite.svg)](https://travis-ci.org/uptownhr/hackathon-starter-lite)
[![Dependency Status](https://david-dm.org/uptownhr/hackathon-starter-lite.svg)](https://david-dm.org/uptownhr/hackathon-starter-lite)
[![devDependency Status](https://david-dm.org/uptownhr/hackathon-starter-lite/dev-status.svg)](https://david-dm.org/uptownhr/hackathon-starter-lite)
[![Gitter chat](https://badges.gitter.im/uptownhr/hackathon-starter-lite.png)](https://gitter.im/uptownhr/hackathon-starter-lite)


## Requirements
- NodeJS
- MongoDB
- Redis
- Docker and Docker Compose *optional

## Getting Started
1. git clone git@github.com:uptownhr/hackathon-starter-lite
2. npm install
3. npm run dev

### Getting Started using Docker
If you have docker, all the project Requirements like Node, Mongo and Redis will automatically be installed and available. 

#### Docker Installation
1. [install docker](https://docs.docker.com/engine/installation/)
2. [install docker-compose](https://docs.docker.com/compose/install/)

#### Starting the project with Docker
1. git clone git@github.com:uptownhr/hackathon-starter-lite
2. cd hackathon-starter-lite
3. docker-compose up

## Docker Basics
If you are using docker here are some useful commands to know

### docker ps
This will show all the running processes started from docker-compose up
```
CONTAINER ID        IMAGE                      COMMAND                  CREATED             STATUS              PORTS                                      NAMES
f8a0b7b07f1c        node:5.8.0                 "npm run dev-docker"     16 hours ago        Up 16 hours         0.0.0.0:3000->3000/tcp                     hackathonstarterlite_app_1
517999e9ba29        mongo                      "/entrypoint.sh mongo"   16 hours ago        Up 16 hours         27017/tcp                                  hackathonstarterlite_mongo_1
26bd3d194207        redis                      "/entrypoint.sh redis"   16 hours ago        Up 16 hours         6379/tcp                                   hackathonstarterlite_redis_1
```
### docker exec
This will allow you to issue additional commands inside a running container.

Useful to get shell access.

`docker exec -it hackathonstarterlite_app_1 bash`

Get into mongo shell.

`docker exec -it hackathonstarterlite_mongo_1 bash`


##Instruction to creating "customized admin CRUD pages"

General Summary:
  You will first create a new model for the data you want to copy/read/update/delete.  You will be creating two jade files: one for displaying all data in collection, another one for viewing and editing one specific dataset from collection.  You will also edit the Admin.js file in '/controllers' to set the route as well as the function of the route.  In Admin.js, you will create 6 routes:
      1. to list and display entire data collection.
      2. to create and enter New set of data into the collection
      3. to view/edit 1 specific data set from collection by ID
      4. to save data into the mongoDB
      5. to update specific data set from collection by ID
      6. to remove specific data set from collection by ID
  Using these routes, you will add functionality into the route to manipulate the data and display the data using the two jade files you created.

1.  create a new model schema for a new mongoDB.  
    a. example: create a new model in '/models'.  Filename can be whatever name you decide: i.e. "newModel.js"
    b. add "var mongoose = require('mongoose');" at the top line.
    c. create your own custom schema
       example:
           "var newSchema = new mongoose.Schema({
              name: {type: String},
              email: {type: String},
              description: {type: String}
            })"
    d.  complete the model by adding: "module.exports = mongoose.model('name of new collection', newSchema)
        where 'name of new collection' is the name of the new schema you want to create.
    e.  Look to Project.js and Post.js for an indepth example of what a schema should look like. 

2.  open "Admin.js" in "/controllers"
    a.  add your newly created model to the top portion of "Admin.js"
        example: NewModel = models.'name of new collection' //without quotes

3.  create and add the 6 routes in "Admin.js" with GET: NEW collection, LIST of collection, EDIT/VIEW collection, REMOVE       collection AND POST: SAVE collection AND UPDATE collection
    a.  example: 
        //LIST
          router.get('/posts', function(req,res){
          }
        //New
          router.get('/post/new', function(req,res){
          }
        //EDIT/View
          router.get('/post/view/:id', function(req,res){
          }
        //SAVE
          router.post('/post/save', function(req,res){
          }
        //UPDATE
          router.post('/post/update/:id', function(req,res){
          }
        //REMOVE
          router.get('/post/delete/:id', function(req,res){
          }

4.  create two new jade files in '/views/admin': One for displaying all data in mongoDB collection and One for viewing and     editing one specific set of data in the collection.
      example: blogListing.jade for displaying all data AND blogEditView.jade for editing/viewing specific data
    a.  open projects.jade and project.jade in '/views/admin'
    b.  copy the content of projects.jade into your newly created jade file for displaying all data in mongoDB; in our             example it is 'blogListing.jade'.  
    c.  copy the content of project.jade into your newly created jade file for editing/viewing single specific data; in our         example it is 'blogEditView.jade'
