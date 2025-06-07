type Constructor<T = any> = new (...args: any[]) => T;

class DIContainer {
  private instances = new Map<Constructor, any>();
  private dependencies = new Map<Constructor, Constructor[]>();

  public registerDependencies<T>(type: Constructor<T>, deps: Constructor[] = []): void {
    if (this.dependencies.has(type)) {
      throw new Error(`Dependency ${type.name} already registered`);
    }
    if (type.length > deps.length) {
      throw new Error(`Dependency ${type.name} has more dependencies`);
    }
    if (type.length < deps.length) {
      throw new Error(`Dependency ${type.name} has less dependencies`);
    }

    this.dependencies.set(type, deps);
  }

  public get<T>(type: Constructor<T>): T {
    if (!this.dependencies.has(type)) {
      throw new Error(`Dependency ${type.name} not registered`);
    }

    if (!this.instances.has(type)) {
      const deps = this.dependencies.get(type) || [];
      const instances = deps.map(dep => this.get(dep));

      this.instances.set(type, new type(...instances));
    }

    return this.instances.get(type);
  }
}

export const diContainer = new DIContainer();
