FROM node:8.11.4

WORKDIR /srv/www/workflyt

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "prod"]
