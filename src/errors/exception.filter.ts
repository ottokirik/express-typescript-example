import { Request, Response, NextFunction } from 'express';
import { HTTPError, IExceptionFilter } from '.';
import { LoggerSevice } from '../logger';

export class ExceptionFilter implements IExceptionFilter {
  constructor(private logger: LoggerSevice) {}

  catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HTTPError) {
      this.logger.error(`[${err.context} Ошибка ${err.statusCode}]: ${err.message}`);
      return res.status(err.statusCode).json({ error: err.message });
    }

    this.logger.error(`${err.message}`);
    return res.status(500).json({ error: err.message });
  }
}
