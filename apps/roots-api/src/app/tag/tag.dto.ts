import { ITag } from '@roots/data'
import { IsDefined, IsString, MaxLength } from 'class-validator';


export class TagDto implements ITag {
    @IsString({message: 'Name moet van het type string zijn!'})
    name: string;
}