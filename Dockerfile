FROM mhart/alpine-node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# RUN cd backend && npm install

# RUN cd client && npm install

EXPOSE 8080

ENV MONGODB_URI='mongodb://mongo/proj'

ENV REDIS_URL='redis://redis'

CMD ["npm", "start"]