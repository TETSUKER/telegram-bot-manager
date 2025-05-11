import { diContainer } from './di-container';

interface EnvironmentConfig {
  HOST: string;
  PORT: string;
  PG_PORT: string;
  PG_DATABASE: string;
  PG_USERNAME: string;
  PG_PASSWORD: string;
}

type EnvironmentKey = keyof EnvironmentConfig;

export class Dotenv {
  public environments: EnvironmentConfig = {
    HOST: '',
    PORT: '',
    PG_PORT: '',
    PG_DATABASE: '',
    PG_USERNAME: '',
    PG_PASSWORD: '',
  };

  constructor() {
    const envKeys = Object.keys(this.environments) as EnvironmentKey[];

    for (const env of envKeys) {
      if (!process.env[env]) {
        throw new Error(`Environment with name: ${env} not declared in dotenv file. Envs which require to start: ${envKeys}`);
      }

      this.environments[env] = process.env[env];
    }
  }
}

diContainer.registerDependencies(Dotenv);
