import { IEvent } from '@roots/data';
import { IsDefined, IsString, MaxLength } from 'class-validator';

export class EventDto implements IEvent {
  @IsString({ message: 'Titel moet van het type string zijn!' })
  @IsDefined({ message: 'Titel is verplicht!' })
  @MaxLength(75, { message: 'Titel mag maximaal 75 karakters bevatten!' })
  title: string;

  @IsString({ message: 'Beschrijving moet van het type string zijn!' })
  @IsDefined({ message: 'Beschrijving is verplicht!' })
  @MaxLength(150, { message: 'Beschrijving mag maximaal 150 karakters bevatten!' })
  description: string;

  @IsString({ message: 'Inhoud moet van het type string zijn!' })
  @IsDefined({ message: 'Inhoud is verplicht!' })
  content: string;

  @IsDefined({ message: 'Gebeurtenisdatum is verplicht!' })
  eventDate: Date;
}
