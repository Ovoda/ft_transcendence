FROM node:16.15.0

WORKDIR /app

COPY package.json ./

RUN npm install -g npm@8.12.1
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start"] 

