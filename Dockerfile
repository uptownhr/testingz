FROM node:6.0.0

ADD ./ /app

WORKDIR /app

RUN npm install

EXPOSE "3000"

CMD node index.js