import { diContainer } from './di-container';

export class Logger {
  public successfulLog(message: string): void {
    console.info(`✅ ${new Date().toLocaleString()} | ${message}`);
  }

  public infoLog(message: string): void {
    console.info(`ℹ️  ${new Date().toLocaleString()} | ${message}`);
  }

  public errorLog(message: string): void {
    console.error(`🚨 ${new Date().toLocaleString()} | ${message}`);
  }

  public warningLog(message: string): void {
    console.error(`⚠️ ${new Date().toLocaleString()} | ${message}`);
  }
}

diContainer.registerDependencies(Logger);