import { ILog, ITag } from '@roots/data'
import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';


export class LogDTO implements ILog {
    @IsString({ message: 'Editor moet van het type string zijn!' })
    editor: string;
    @IsString({ message: 'Action moet van het type string zijn!' })
    action: string;
    @IsString({ message: 'Object moet van het type string zijn!' })
    object: string;
    logStamp: Date;
    
}