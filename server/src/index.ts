import { App } from 'app/app';
import { diContainer } from 'app/core/di-container';

const app = diContainer.get(App);

app.start();
