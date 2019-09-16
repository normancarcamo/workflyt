FROM node:10

ARG NODE_ENV=development

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

EXPOSE 3000

CMD npm run dev
