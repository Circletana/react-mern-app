FROM mhart/alpine-node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN cd backend && npm install

RUN cd client && npm install

EXPOSE 8080

ENV MONGO_URI='mongodb://mongo/proj'

CMD ["npm", "start"]