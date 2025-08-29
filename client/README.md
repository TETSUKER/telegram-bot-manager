# Client

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Development scripts
```sh
# Install dependencies
npm install

# Run dev server on your http://localhost:3000
npm start

# Launches the test runner in the interactive watch mode
npm test

# Builds the app for production to the `build` folder
npm run build
```

## Docker
```sh
# Build image
docker build --no-cache -t tbm-client .

# Start container
docker run -d --name tbm-client -p 80:3000 tbm-client
```
