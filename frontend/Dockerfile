FROM node:latest

WORKDIR /app

COPY package.json ./

RUN npm install && npm install -g serve

COPY . .

EXPOSE 3000

CMD ["sh", "start.sh"]
