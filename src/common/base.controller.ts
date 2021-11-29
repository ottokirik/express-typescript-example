import { Router, Response } from 'express';
import { LoggerSevice } from '../logger/logger.service';
import { IControllerRoute } from './route.interface';

const enum statusCodes {
  ok = 200,
  created = 201,
}

export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: LoggerSevice) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  public send<T>(res: Response, statusCode: number, message: T): Response {
    return res.type('application/json').status(statusCode).json(message);
  }

  public ok<T>(res: Response, message: T): Response {
    return this.send(res, statusCodes.ok, message);
  }

  public created(res: Response): Response {
    return res.sendStatus(statusCodes.created);
  }

  protected bindRoutes(routes: IControllerRoute[]): void {
    routes.forEach((route) => {
      this.logger.log(`[${route.method}] ${route.path}`);

      // Сохранить контекст вызова
      const handler = route.func.bind(this);

      this.router[route.method](route.path, handler);
    });
  }
}
