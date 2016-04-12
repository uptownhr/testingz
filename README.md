[![Build Status](https://travis-ci.org/uptownhr/hackathon-starter-lite.svg)](https://travis-ci.org/uptownhr/hackathon-starter-lite)
[![Dependency Status](https://david-dm.org/uptownhr/hackathon-starter-lite.svg)](https://david-dm.org/uptownhr/hackathon-starter-lite)
[![devDependency Status](https://david-dm.org/uptownhr/hackathon-starter-lite/dev-status.svg)](https://david-dm.org/uptownhr/hackathon-starter-lite)
[![Gitter chat](https://badges.gitter.im/uptownhr/hackathon-starter-lite.png)](https://gitter.im/uptownhr/hackathon-starter-lite)

# hackathon-starter-lite
Taking [Hackathon Starter](https://github.com/sahat/hackathon-starter) to the next level. 

A framework written with Express. We aim to provide more than just a login boilerplate. 

## Features
- Login
- Admin
- Posts
- Projects
- Products
- Files

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

## Guides and Examples
- [creating admin crud pages](docs/crud.md)
- [adding passport oauth providers](docs/passport.md)
- [docker basics](docs/docker.md)

[all guides](docs)
