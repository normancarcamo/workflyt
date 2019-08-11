FROM node:10

WORKDIR /srv/www/workflyt

COPY . /workflyt

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
