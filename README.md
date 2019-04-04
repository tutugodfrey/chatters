# chatters
A chatting application build with graphQL

[![CircleCI](https://circleci.com/gh/tutugodfrey/chatters.svg?style=svg)](https://circleci.com/gh/tutugodfrey/chatters)
[![Coverage Status](https://coveralls.io/repos/github/tutugodfrey/chatters/badge.svg)](https://coveralls.io/github/tutugodfrey/chatters)
[![Maintainability](https://api.codeclimate.com/v1/badges/53f4cdebf6c9b1b94604/maintainability)](https://codeclimate.com/github/tutugodfrey/chatters/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/53f4cdebf6c9b1b94604/test_coverage)](https://codeclimate.com/github/tutugodfrey/chatters/test_coverage)

## Building the docker images
Instruction for building image can be found in the docker files. Environment variables required for the application to run are described in .env.example. These can be supplied at runtime or at build time. The default values specified for ARG is are expected to be overridden during build with --build-arg or from env at runtime from an env file or e argument passed to the run command. If you are providing the variable from an env file the run command  below is sufficient to start your container. Provide the appropriate values where necessary.

**Build Command**
- docker build --build-arg APP_PORT=9000 --build-arg JWT_SECRET='' --build-arg ADMIN_PASS='' -t repo/chatters:latest .

**Run Command**
- docker run -d --env-file=.env --name chatters repo/chatters:latest

## Author
Tutu Godfrey<godfrey_tutu@yahoo.com>
