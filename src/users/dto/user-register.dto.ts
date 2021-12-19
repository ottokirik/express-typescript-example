import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	@IsString({ message: 'Не указан пароль' })
	@MinLength(8, { message: 'Пароль не должен быть короче 8 символов' })
	password: string;

	@IsString({ message: 'Не указано имя' })
	name: string;
}
