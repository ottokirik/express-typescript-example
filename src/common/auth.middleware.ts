import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { IMiddleware } from './middleware.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private readonly secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (!req.headers.authorization) return next();

		const token = req.headers.authorization.split(' ')[1];

		verify(token, this.secret, (err, payload) => {
			if (err) return next();
			if (payload) {
				req.user = payload.email;

				next();
			}
		});
	}
}
