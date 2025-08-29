import { diContainer } from './di-container';

interface EnvironmentConfig {
  HOST: string;
  PG_HOST: string;
  PG_PORT: string;
  PG_DATABASE: string;
  PG_USERNAME: string;
  PG_PASSWORD: string;
}

type EnvironmentKey = keyof EnvironmentConfig;

export class Dotenv {
  public environments: EnvironmentConfig = {
    HOST: '0.0.0.0',
    PG_HOST: 'db',
    PG_PORT: '5432',
    PG_DATABASE: 'telegram_bot_manager',
    PG_USERNAME: 'postgres',
    PG_PASSWORD: '',
  };

  constructor() {
    const envKeys = Object.keys(this.environments) as EnvironmentKey[];

    for (const env of envKeys) {
      if (process.env[env]) {
        this.environments[env] = process.env[env];
      }
    }
  }
}

diContainer.registerDependencies(Dotenv);
