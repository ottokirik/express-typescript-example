import { Request, Response, NextFunction } from 'express';

import { BaseController } from '../common';
import { HTTPError } from '../errors';
import { LoggerSevice } from '../logger';

export class UserController extends BaseController {
  constructor(logger: LoggerSevice) {
    super(logger);
    this.bindRoutes([
      { path: '/signin', method: 'post', func: this.signin },
      { path: '/signup', method: 'post', func: this.signup },
    ]);
  }

  signin(req: Request, res: Response, next: NextFunction) {
    this.ok<string>(res, 'signin');
  }

  signup(req: Request, res: Response, next: NextFunction) {
    // this.ok<string>(res, 'signup');
    next(new HTTPError(401, 'тест'));
  }
}
