import { App } from './app';
import { LoggerSevice } from './logger/logger.service';

const bootstrap = async () => {
  const app = new App(new LoggerSevice());
  await app.init();
};

bootstrap();
