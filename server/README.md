## Backend NodeJS server

Simple http rest api writed in nodejs (without express).

## Development scripts
Make sure you have .env file with all env-s to start dev server.
```sh
# Install dependencies
npm install

# Run dev server on your local http://:::${port} address
npm run dev

# Builds the app for production to the `dist` folder
npm run build

# Run production mode
npm start
```

## Docker
```sh
# Build image
docker compose -f ../docker-compose.yml build tbm-server --no-cache

# Start container
docker compose -f ../docker-compose.yml up -d tbm-server
```

## ESLint

In VSCode install ESLint extension and in JSON user settings add line:
```
"eslint.options": { "overrideConfigFile": "eslint.config.mjs" }
```
