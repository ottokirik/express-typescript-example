import 'reflect-metadata';

import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';

import { BaseController } from '../common';
import { ValidateMiddleware } from '../common/validate.moddleware';
import { IConfigService } from '../config/config.service.interface';
import { HTTPError } from '../errors';
import { ILogger } from '../logger';
import { TYPES } from '../types';
import { UserLoginDto, UserRegisterDto } from './dto';
import { IUserController } from './user.controller.interface';
import { IUserService } from './user.service.interface';
import { AuthGuardMiddleware } from '../common/auth.guard.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/signin',
				method: 'post',
				func: this.signin,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/signup',
				method: 'post',
				func: this.signup,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuardMiddleware()],
			},
		]);
	}

	async signin(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const isCredentialsCorrect = await this.userService.validateUser(body);

		if (!isCredentialsCorrect) {
			return next(new HTTPError(401, 'Ошибка авторизации'));
		}

		const jwt = await this.signJWT(body.email, this.configService.get('JWT_SECRET'));

		this.ok(res, { jwt });
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

		this.ok(res, { email: user.email, id: user.id });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);

		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{ email, iat: Math.floor(Date.now() / 1000) },
				secret,
				{ algorithm: 'HS256' },
				(err, token) => {
					if (err) return reject(err);
					return resolve(token as string);
				},
			);
		});
	}
}
