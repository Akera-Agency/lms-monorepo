import Elysia from "elysia";

export interface BaseModule {
  repositories: {
    [key: string]: {
      import: new (...args: any[]) => any;
    };
  };
  services: {
    [key: string]: {
      import: new (...args: any[]) => any;
      inject: (new (...args: any[]) => any)[];
    };
  };
  controllers: Elysia<any, any>[];
}
