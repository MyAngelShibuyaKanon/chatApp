FROM node:22-alpine

WORKDIR /app 

COPY package*.json /app

RUN npm install 

COPY . /app

RUN npm install -g nodemon 

EXPOSE 8727


CMD ["nodemon", "/app/src/server.ts"]
