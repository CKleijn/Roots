import { Optional } from '@nestjs/common';
import { IsDefined, IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Firstname must be a string!' })
  @IsDefined({ message: 'Firstname is required!' })
  firstname: string;

  @IsString({ message: 'Lastname must be a string!' })
  @IsDefined({ message: 'Lastname is required!' })
  lastname: string;

  @IsEmail()
  @IsString({ message: 'Email must be a string!' })
  @IsDefined({ message: 'Email is required!' })
  emailAddress: string;

  @IsString({ message: 'Password must be a string!' })
  @IsDefined({ message: 'Password is required!' })
  @Matches(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"),{ message: 'Password not strong enough! Must contain at least: 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number!' })
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
