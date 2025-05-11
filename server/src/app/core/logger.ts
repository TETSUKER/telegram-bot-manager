import { diContainer } from './di-container';

export class Logger {
  public successfulLog(message: string): void {
    console.info(`✅ ${message}`);
  }

  public infoLog(message: string): void {
    console.info(`ℹ️  ${message}`);
  }

  public errorLog(message: string): void {
    console.error(`🚨 ${message}`);
  }

  public warningLog(message: string): void {
    console.error(`⚠️ ${message}`);
  }
}

diContainer.registerDependencies(Logger);