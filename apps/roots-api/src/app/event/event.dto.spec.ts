import { EventDto } from './event.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('Event DTO - Unit tests', () => {
    // Valid DTO
    it('Valid DTO', async () => {
        const bodyDto = {
            title:'Test',
            description:'Test',
            content:'Test',
            eventDate: new Date(),
            tags:[],
            isActive:true
        }

        const eventDto = plainToInstance(EventDto, bodyDto);
        const err = await validate(eventDto);

        expect(err.length).toBe(0);
    });
  
    // REQUIRED
    it('No required title was given', async () => {
        const bodyDto = {
            description:'Test',
            content:'Test',
            eventDate: new Date(),
            tags:[]
        }

        const eventDto = plainToInstance(EventDto, bodyDto);
        const err = await validate(eventDto);

        expect(err.length).not.toBe(0);
        expect(JSON.stringify(err)).toContain('Titel is verplicht!');
    });

    // REQUIRED
    it('No required description was given', async () => {
        const bodyDto = {
            title:'Test',
            content:'Test',
            eventDate: new Date(),
            tags:[]
        }

        const eventDto = plainToInstance(EventDto, bodyDto);
        const err = await validate(eventDto);

        expect(err.length).not.toBe(0);
        expect(JSON.stringify(err)).toContain('Beschrijving is verplicht!');
    });
    it('No required content was given', async () => {
        const bodyDto = {
            title:'Test',
            description:'Test',
            eventDate: new Date(),
            tags:[]
        }

        const eventDto = plainToInstance(EventDto, bodyDto);
        const err = await validate(eventDto);

        expect(err.length).not.toBe(0);
        expect(JSON.stringify(err)).toContain('Inhoud is verplicht!');
    });
    it('No required eventDate was given', async () => {
        const bodyDto = {
            title:'Test',
            description:'Test',
            content: 'Test',
            tags:[]
        }

        const eventDto = plainToInstance(EventDto, bodyDto);
        const err = await validate(eventDto);

        expect(err.length).not.toBe(0);
        expect(JSON.stringify(err)).toContain('Gebeurtenisdatum is verplicht!');
    });

    // UNVALID TYPES
    it('Title is not valid String', async () => {
        const bodyDto = {
            title:0,
            description:'Test',
            content:'Test',
            eventDate: new Date(),
            tags:[]
        }
        

        const eventDto = plainToInstance(EventDto, bodyDto);
        const err = await validate(eventDto);

        expect(err.length).not.toBe(0);
        expect(JSON.stringify(err)).toContain('Titel moet van het type string zijn!');
    });

    it('Description is not valid String', async () => {
        const bodyDto = {
            title:'Test',
            description:0,
            content:'Test',
            eventDate: new Date(),
            tags:[]
        }

        const eventDto = plainToInstance(EventDto, bodyDto);
        const err = await validate(eventDto);

        expect(err.length).not.toBe(0);
        expect(JSON.stringify(err)).toContain('Beschrijving moet van het type string zijn!');
    });
    
    it('Content is not valid String', async () => {
        const bodyDto = {
            title:'Test',
            description:'Test',
            content:0,
            eventDate: new Date(),
            tags:[]
        }

        const eventDto = plainToInstance(EventDto, bodyDto);
        const err = await validate(eventDto);

        expect(err.length).not.toBe(0);
        expect(JSON.stringify(err)).toContain('Inhoud moet van het type string zijn!');
    });

    it('Content is not valid String', async () => {
        const bodyDto = {
            title:'Test',
            description:'Test',
            content:0,
            eventDate: new Date(),
            tags:[],
            isActive:''
        }

        const eventDto = plainToInstance(EventDto, bodyDto);
        const err = await validate(eventDto);

        expect(err.length).not.toBe(0);
        expect(JSON.stringify(err)).toContain('IsActive moet van het type boolean');
    });
  
    // MAX LENGTH
    it('Title (76)> 75 characters', async () => {
        const bodyDto = {
            title:'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST',
            description:'Test',
            content:' Test',
            eventDate: new Date(),
            tags:[]
        }

        const eventDto = plainToInstance(EventDto, bodyDto);
        const err = await validate(eventDto);

        expect(err.length).not.toBe(0);
        expect(JSON.stringify(err)).toContain('Titel mag maximaal 75 karakters bevatten!');
    });
    it('Desctription (152) > 75 characters', async () => {
        const bodyDto = {
            title:'Test',
            description:'TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST',
            content:' Test',
            eventDate: new Date(),
            tags:[]
        }

        const eventDto = plainToInstance(EventDto, bodyDto);
        const err = await validate(eventDto);

        expect(err.length).not.toBe(0);
        expect(JSON.stringify(err)).toContain('Beschrijving mag maximaal 150 karakters bevatten!');
    });
});