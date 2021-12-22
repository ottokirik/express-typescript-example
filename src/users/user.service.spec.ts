import 'reflect-metadata';

import { Container } from 'inversify';

import { UserModel } from '@prisma/client';

import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUserRepository } from './user.repository.interface';
import { UserService } from './user.service';
import { IUserService } from './user.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UserRepositoryMock: IUserRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

let createdUser: UserModel | null;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(UserRepositoryMock);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	userRepository = container.get<IUserRepository>(TYPES.UserRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

describe('User Service', () => {
	test('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		userRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);

		createdUser = await userService.createUser({
			email: 'jest@jest.ru',
			name: 'Аркадий',
			password: '12345678',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('12345678');
	});
});
