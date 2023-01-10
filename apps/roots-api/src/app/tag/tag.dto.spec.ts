import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { TagDto } from './tag.dto';

describe('Tag DTO - Unit tests', () => {
    // Class validator is isNotEmpty and isDefined
    it('has a required name (isNotEmpty)', async () => {
        const model = plainToInstance(TagDto, {})

        const err = await validate(model);

        expect(err.length).not.toBe(0);
        expect(err[0].constraints.isNotEmpty).toContain(`Naam is verplicht!`);
    });

    it('has a required name (isDefined)', async () => {
        const model = plainToInstance(TagDto, {})

        const err = await validate(model);

        expect(err.length).not.toBe(0);
        expect(err[0].constraints.isDefined).toContain(`Naam is verplicht!`);
    });

    // Class validator maxLength
    it('name has too much characters', async () => {
        const model = plainToInstance(TagDto, { name: 'TESTTESTTESTTESTTESTTESTTESTTESTTEST' })

        const err = await validate(model);

        expect(err.length).not.toBe(0);
        expect(err[0].constraints.maxLength).toContain(`Naam is te lang!`);
    });

    // Class validator is isString
    it('name has a incorrect type', async () => {
        const model = plainToInstance(TagDto, { name: 1 })

        const err = await validate(model);

        expect(err.length).not.toBe(0);
        expect(err[0].constraints.isString).toContain(`Name moet van het type string zijn!`);
    });
});