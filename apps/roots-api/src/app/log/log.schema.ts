import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ILog, IOrganization } from '@roots/data';
import { isDefined, IsDefined, IsString } from 'class-validator';

export type LogDocument = Log & Document;

@Schema()
export class Log implements ILog {
    @IsString({ message: 'Editor moet van het type string zijn!' })
    @Prop()
    editor: string;
    
    @IsString({ message: 'Action moet van het type string zijn!' })
    @Prop()
    action: string;
    
    @IsString({ message: 'Object moet van het type string zijn!' })
    @Prop()
    object: string;
    
    @Prop({default: new Date()})
    logStamp: Date;
  
}

export const LogSchema = SchemaFactory.createForClass(Log);
