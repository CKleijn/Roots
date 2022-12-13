import { Optional } from '@nestjs/common';
import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
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

export class UpdateUserDto {
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
