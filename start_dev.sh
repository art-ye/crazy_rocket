#!/bin/bash

ROOT_DIR=$PWD;
DOTENV=./.env;
MESSAGING_SYSTEM="nats"

hash pm2
PM2_EXISTS_STATUS=$?

if [ $PM2_EXISTS_STATUS = 1 ]; then
  echo "\e[31mInstalling pm2\n"
  sudo npm i -g pm2
fi

if [ ! -z $1 ]; then
  MESSAGING_SYSTEM=$1
fi

echo -e "Checking .env file exists\n"
if [ ! -f $DOTENV ]; then
  echo -e "\e[1mCreating .env...\n\e[31mIf you want to change environment variables check .env file"
  cp ./.env.example $DOTENV
fi

if [ $MESSAGING_SYSTEM = 'kafka' ]; then
  docker-compose -f $ROOT_DIR/docker-compose.dev.yml up -d redis postgres zookeeper kafka;
else
  docker-compose -f $ROOT_DIR/docker-compose.dev.yml up -d redis postgres nats;
fi

npm i
npm run migrate