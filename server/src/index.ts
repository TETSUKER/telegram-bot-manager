import { App } from 'app/app';
import { diContainer } from 'app/core/di-container';
import { createServer } from 'node:http';
import { AddressInfo } from 'node:net';


const app = diContainer.get(App);

app.start();

// const server = createServer((req, res) => {
//   res.end('Hello world');
// });

// server.listen(3000, 'localhost', () => {
//   const addr = server.address() as AddressInfo;
//   console.log(`Server running at http://${addr.address}:${addr.port}`);
// });