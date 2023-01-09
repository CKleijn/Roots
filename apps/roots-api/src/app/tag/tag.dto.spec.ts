import { validate } from "class-validator";
import { TagDto } from "./tag.dto";

describe('User Dto Tests', () => {
    describe('Required field', () => {
        it('has a required name', async () => {
            const err = await validate(new TagDto());
            expect(err.length).not.toBe(0);
            expect(err[0].constraints.isDefined).toContain(`Naam is verplicht!`);
        });

        it('has a required name', async () => {
            const err = await validate(new TagDto());
            expect(err.length).not.toBe(0);
            expect(err[0].constraints.isNotEmpty).toContain(`Naam is verplicht!`);
        });

    });

    describe('Check name input is valid', () => {
        it('has too long name', async () => {
            const model = new TagDto();
            model.name = 'TestTestTestTestTestTestTestTestTest';

            const err = await validate(new TagDto());
            expect(err.length).not.toBe(0);
            expect(err[0].constraints.maxLength).toContain(`Naam is te lang!`);
        });

        it('has false data type name', async () => {
            const model = new TagDto() as any;
            model.name = 12345;

            const err = await validate(new TagDto());
            expect(err.length).not.toBe(0);
            expect(err[0].constraints.isString).toContain(`Name moet van het type string zijn!`);
        });

    });

})