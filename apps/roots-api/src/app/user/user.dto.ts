import { Optional } from '@nestjs/common';
import { IUser } from '@roots/data';
import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto implements IUser {
  @IsString({ message: 'Firstname must be a string!' })
  @IsDefined({ message: 'Firstname is required!' })
  firstname: string;

  @IsString({ message: 'Firstname must be a string!' })
  @IsDefined({ message: 'Firstname is required!' })
  lastname: string;

  @IsEmail()
  @IsString({ message: 'Email must be a string!' })
  @IsDefined({ message: 'Email is required!' })
  emailAddress: string;

  @IsString({ message: 'Password must be a string!' })
  @IsDefined({ message: 'Password is required!' })
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  password: string;
}

export class UpdateUserDto implements IUser {
  @Optional()
  @IsString({ message: 'Firstname must be a string!' })
  @IsDefined({ message: 'Firstname is required!' })
  firstname: string;

  @Optional()
  @IsString({ message: 'Firstname must be a string!' })
  @IsDefined({ message: 'Firstname is required!' })
  lastname: string;

  @Optional()
  @IsEmail()
  @IsString({ message: 'Email must be a string!' })
  @IsDefined({ message: 'Email is required!' })
  emailAddress: string;

  @Optional()
  @IsString({ message: 'Password must be a string!' })
  @IsDefined({ message: 'Password is required!' })
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  password: string;
}
