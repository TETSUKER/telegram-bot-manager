type Constructor<T = any> = new (...args: any[]) => T;

class DIContainer {
  private instances = new Map<Constructor, any>();

  public registerDependencies<T>(type: Constructor<T>, deps: Constructor[] = []): void {
    if (!this.instances.has(type)) {

      if (type.length > deps.length) {
        throw new Error(`Dependency ${type.name} has more dependencies`);
      }

      if (type.length < deps.length) {
        throw new Error(`Dependency ${type.name} has less dependencies`);
      }

      const dependencies = deps.map((dep) => this.get(dep));
      this.instances.set(type, new type(...dependencies));
    } else {
      throw new Error(`Dependency ${type.name} already registered`);
    }
  }

  public get<T>(type: Constructor<T>): T {
    if (!this.instances.has(type)) {
      throw new Error(`Dependency ${type.name} not registered`);
    }
    return this.instances.get(type);
  }
}

export const diContainer = new DIContainer();
