import express, { Express } from 'express';
import { userRouter } from './users';
import { Server } from 'http';

export class App {
  app: Express;
  server: Server;
  port: number;

  constructor() {
    this.app = express();
    this.port = 8000;
  }

  useRoutes() {
    this.app.use('/users', userRouter);
  }

  public async init() {
    this.useRoutes();
    this.server = this.app.listen(this.port);

    console.log(`Сервер запущен на http://127.0.0.1:${this.port}`);
  }
}
