import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserRegisterDto, UserLoginDto } from './dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const user = new User(email, name);
		const salt = Number(this.configService.get('PASSWORD_SALT'));
		await user.setPassword(password, salt);
		return user;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
