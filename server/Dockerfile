FROM node:20-alpine

WORKDIR /app

COPY src ./src
COPY package.json .
COPY tsconfig.json .

RUN npm install
RUN npm run build

EXPOSE 3020

ENV NODE_PATH=./dist

CMD ["node", "dist/index.js"]
