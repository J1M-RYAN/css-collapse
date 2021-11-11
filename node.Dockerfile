FROM node:16

WORKDIR /usr/src/app

COPY backend/package*.json ./backend/

WORKDIR /usr/src/app/backend

RUN npm ci 

COPY ./backend .

WORKDIR /usr/src/app

COPY ui/ ./ui/

EXPOSE 3000

WORKDIR /usr/src/app/backend

CMD [ "npm", "start" ]
