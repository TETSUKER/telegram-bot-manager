import { App } from 'app/app';
import { diContainer } from 'app/core/di-container';

const app = diContainer.get(App);

app.start();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.trace('Stack trace for uncaught exception');
  process.exit(1);
});
