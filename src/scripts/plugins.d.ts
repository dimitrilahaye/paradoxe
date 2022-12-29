// global.d.ts
declare namespace Phaser {
    interface Scene {
      store: {
        set(key: string, data: any): void;
        get<T>(key: string): T | null;
      }
    }
  }