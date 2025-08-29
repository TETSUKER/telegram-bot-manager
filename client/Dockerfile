FROM node:20-alpine AS build

WORKDIR /app

COPY public ./public
COPY src ./src
COPY package.json .
COPY tailwind.config.js .
COPY tsconfig.json .

RUN npm install
RUN npm run build --production

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/build ./build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build"]
