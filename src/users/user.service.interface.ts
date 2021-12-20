import { UserModel } from '@prisma/client';
import { UserLoginDto, UserRegisterDto } from './dto';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
