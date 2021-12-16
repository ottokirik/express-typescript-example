import { Router, Response } from 'express';
import { injectable } from 'inversify';
import { ILogger } from '../logger';
import { IControllerRoute } from './route.interface';
import 'reflect-metadata';
import { ExpressReturnType } from '.';

const enum statusCodes {
	ok = 200,
	created = 201,
}

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, statusCode: number, message: T): ExpressReturnType {
		return res.type('application/json').status(statusCode).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send(res, statusCodes.ok, message);
	}

	public created(res: Response): ExpressReturnType {
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
