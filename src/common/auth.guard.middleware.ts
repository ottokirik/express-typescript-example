import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors';

import { IMiddleware } from './middleware.interface';

export class AuthGuardMiddleware implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (!req.user) {
			return next(new HTTPError(401, 'Пользователь не авторизован'));
		}

		return next();
	}
}
