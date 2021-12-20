import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserRegisterDto, UserLoginDto } from './dto';
import { User } from './user.entity';
import { IUserRepository } from './user.repository.interface';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const user = new User(email, name);
		const salt = Number(this.configService.get('PASSWORD_SALT'));
		await user.setPassword(password, salt);

		const existedUser = await this.userRepository.find(email);
		if (existedUser) return null;

		return await this.userRepository.create(user);
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
