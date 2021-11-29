import { App } from './app';
import { ExceptionFilter } from './errors';
import { LoggerSevice } from './logger/logger.service';
import { UserController } from './users';

const bootstrap = async () => {
  const logger = new LoggerSevice();

  const app = new App(logger, new UserController(logger), new ExceptionFilter(logger));
  await app.init();
};

bootstrap();
