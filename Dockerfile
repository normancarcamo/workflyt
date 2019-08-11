FROM node:10

RUN mkdir -p /home/node/app/workflyt

RUN chown -R node:node /home/node/app

WORKDIR /home/node/app/workflyt

COPY . ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
