FROM node:18.19

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

CMD [ "npm", "run", "dev" ]
