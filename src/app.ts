import express, { Express } from 'express';
import { Server } from 'http';
import { ExceptionFilter } from './errors';
import { LoggerSevice } from './logger/logger.service';
import { UserController } from './users';

export class App {
  app: Express;
  server: Server;
  port: number;
  logger: LoggerSevice;
  userController: UserController;
  exceptionFilter: ExceptionFilter;

  constructor(logger: LoggerSevice, userController: UserController, exceptionFilter: ExceptionFilter) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
    this.userController = userController;
    this.exceptionFilter = exceptionFilter;
  }

  useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  useExceptionFilter() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.useRoutes();
    this.useExceptionFilter();
    this.server = this.app.listen(this.port);
    this.logger.log(`Сервер запущен на http://127.0.0.1:${this.port}`);
  }
}
