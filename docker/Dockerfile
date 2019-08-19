FROM node:10

RUN apt-get  update -y \
&& apt-get upgrade -y \
&& apt-get install iputils-ping -y \
&& apt-get install net-tools -y

LABEL maintainer "Norman Carcamo <normancarcamo@gmail.com>"

RUN mkdir -p /usr/src/app

COPY ../ /usr/src/app

WORKDIR /usr/src/app

RUN npm install

EXPOSE 3000

CMD node src/index.js
