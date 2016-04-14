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

## Getting Started
The easiest way to get started and workflow we recommend is by using docker. Docker handles the service depencies for the application to run. For example, Mongodb and Redis will be started and connected using containers. You do not have to worry about installation steps or muddying your host machine with additional services. 

If you have docker available, you can get started in two steps.

### Steps
1. git clone git@github.com:uptownhr/hackathon-starter-lite
2. cd hackathon-starter-lite
3. docker-compose up

### Docker Installation
1. [install docker](https://docs.docker.com/engine/installation/)
2. [install docker-compose](https://docs.docker.com/compose/install/)

## Guides and Examples
- [getting started without docker](docs/getting-started-without-docker.md)
- [creating admin crud pages](docs/crud.md)
- [adding passport oauth providers](docs/passport.md)
- [docker basics](docs/docker.md)

[all guides](docs)
