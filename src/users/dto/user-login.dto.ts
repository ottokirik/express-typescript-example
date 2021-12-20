import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	@IsString({ message: 'Не указан пароль' })
	@MinLength(8, { message: 'Пароль не должен быть короче 8 символов' })
	password: string;
}
