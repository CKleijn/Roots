import { Optional } from '@nestjs/common';
import { IsDefined, IsString } from 'class-validator';

export class CreateCompanyDTO {
    @IsString({ message: 'Naam moet van het type string zijn!' })
    @IsDefined({ message: 'Naam is verplicht!' })
    name: string;

    @IsString({ message: 'Email domein moet van het type string zijn!' })
    @IsDefined({ message: 'Email domein is verplicht!' })
    emailDomain: string;
}

export class UpdateCompanyDTO {
    @Optional()
    @IsString({ message: 'Naam moet van het type string zijn!' })
    @IsDefined({ message: 'Naam is verplicht!' })
    name: string;

    @Optional()
    @IsString({ message: 'Email domein moet van het type string zijn!' })
    @IsDefined({ message: 'Email domein is verplicht!' })
    emailDomain: string;
}