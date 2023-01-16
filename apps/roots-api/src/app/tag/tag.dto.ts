import { ITag } from '@roots/data'
import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';


export class TagDto implements ITag {
    @IsNotEmpty({message: 'Naam is verplicht!'})
    @IsDefined({message: 'Naam is verplicht!'})
    @MaxLength(15, {message: 'Naam is te lang!'})
    @IsString({message: 'Name moet van het type string zijn!'})
    name: string;
}