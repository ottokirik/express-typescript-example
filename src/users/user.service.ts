import { injectable } from 'inversify';
import { UserRegisterDto, UserLoginDto } from './dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const user = new User(email, name);
		await user.setPassword(password);
		return user;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
