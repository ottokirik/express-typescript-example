import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { HTTPError, IExceptionFilter } from '.';
import { ILogger } from '../logger';
import { TYPES } from '../types';
import 'reflect-metadata';
import { ExpressReturnType } from '../common';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(
		err: Error | HTTPError,
		req: Request,
		res: Response,
		next: NextFunction,
	): ExpressReturnType {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context} Ошибка ${err.statusCode}]: ${err.message}`);
			return res.status(err.statusCode).json({ error: err.message });
		}

		this.logger.error(`${err.message}`);
		return res.status(500).json({ error: err.message });
	}
}
