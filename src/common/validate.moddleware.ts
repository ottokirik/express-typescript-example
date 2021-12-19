import { Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { IMiddleware } from './middleware.interface';
import { validate } from 'class-validator';
import { HTTPError } from '../errors';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ body }: Request, res: Response, next: NextFunction): void {
		// Создаст экземпляр класса
		const instance = plainToClass(this.classToValidate, body);

		validate(instance).then((errors) => {
			if (errors.length > 0) {
				const message = errors
					?.map(({ constraints }) => {
						if (!constraints) return;
						return Object.values(constraints)
							.map((i) => i)
							.join(' ');
					})
					.join('/');
				return next(new HTTPError(422, message));
			} else {
				return next();
			}
		});
	}
}
