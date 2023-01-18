import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LogDTO } from './log.dto';

describe('Log DTO - Unit tests', () => {
   
    // Class validator is isType
   it('editor has a incorrect type', async () => {
        const model = plainToInstance(LogDTO, { editor: 1 })

        const err = await validate(model);

        expect(err.length).not.toBe(0);
        expect(err[0].constraints.isString).toContain(`Editor moet van het type string zijn!`);
    });

    it('action has a incorrect type', async () => {
        const model = plainToInstance(LogDTO, { editor: 'Test', action: 1 })

        const err = await validate(model);

        expect(err.length).not.toBe(0);
        expect(err[0].constraints.isString).toContain(`Action moet van het type string zijn!`);
    });

    it('object has a incorrect type', async () => {
        const model = plainToInstance(LogDTO, { editor: 'Test', action: 'Test', object: 1 })

        const err = await validate(model);

        expect(err.length).not.toBe(0);
        expect(err[0].constraints.isString).toContain(`Object moet van het type string zijn!`);
    });

  
});