import { Optional } from '@nestjs/common';
import { IsDefined, IsString } from 'class-validator';

export class CreateCompanyDTO {
    @IsString({ message: 'Name must be a string!' })
    @IsDefined({ message: 'Name is required!' })
    name: string;

    @IsString({ message: 'Email domain must be a string!' })
    @IsDefined({ message: 'Email domain is required!' })
    emailDomain: string;
}

export class UpdateCompanyDTO {
    @Optional()
    @IsString({ message: 'Name must be a string!' })
    @IsDefined({ message: 'Name is required!' })
    name: string;

    @Optional()
    @IsString({ message: 'Email domain must be a string!' })
    @IsDefined({ message: 'Email domain is required!' })
    emailDomain: string;
}