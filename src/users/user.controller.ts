import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { BaseController } from '../common';
import { HTTPError } from '../errors';
import { ILogger } from '../logger';
import { TYPES } from '../types';
import { IUserController } from './user.controller.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/signin', method: 'post', func: this.signin },
			{ path: '/signup', method: 'post', func: this.signup },
		]);
	}

	signin(req: Request, res: Response, next: NextFunction): void {
		this.ok<string>(res, 'signin');
	}

	signup(req: Request, res: Response, next: NextFunction): void {
		// this.ok<string>(res, 'signup');
		next(new HTTPError(401, 'тест'));
	}
}
