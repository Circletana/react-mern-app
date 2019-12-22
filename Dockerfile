FROM mhart/alpine-node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g nodemon

RUN npm install

COPY . .

EXPOSE 8080

ENV MONGODB_URI='mongodb://localhost:27017/proj'

ENV REDIS_URL='redis://redis'

CMD ["npm", "run", "dev"]