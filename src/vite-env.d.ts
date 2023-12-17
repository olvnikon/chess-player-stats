/// <reference types="vite/client" />

declare global {
  interface ObjectConstructor {
    groupBy<T, K>(array: T[], groupCB: (array: T) => string): Record<K, T[]>;
  }

  interface Array<T> {
    toReversed(): T[];
  }
}

export {};
