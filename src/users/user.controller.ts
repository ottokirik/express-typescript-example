import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { BaseController } from '../common';
import { ValidateMiddleware } from '../common/validate.moddleware';
import { HTTPError } from '../errors';
import { ILogger } from '../logger';
import { TYPES } from '../types';
import { UserLoginDto, UserRegisterDto } from './dto';
import { IUserController } from './user.controller.interface';
import { IUserService } from './user.service.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/signin',
				method: 'post',
				func: this.signin,
			},
			{
				path: '/signup',
				method: 'post',
				func: this.signup,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	signin(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		this.ok<string>(res, 'signin');
	}

	async signup(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.userService.createUser(body);

		if (!user) {
			return next(new HTTPError(422, 'Такой пользователь уже зарегистрирован'));
		}

		this.ok<Record<string, string>>(res, { email: user.email });
	}
}
