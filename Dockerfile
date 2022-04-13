FROM node:12.13-alpine

WORKDIR /app

COPY package*.json ./

RUN npm instal

COPY . .

COPY ./dist ./dist

CMD ["npm", "run", "start:dev"]
