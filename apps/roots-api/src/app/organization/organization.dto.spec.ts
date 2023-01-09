import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateOrganizationDTO, UpdateOrganizationDTO } from './organization.dto';

describe('Organization DTO', () => {
    describe('CreateOrganizationDTO', () => {
        // Class validator is required
        it('has a required name', async () => {
            const model = plainToInstance(CreateOrganizationDTO, {})

            const err = await validate(model);

            expect(err.length).not.toBe(0);
            expect(err[0].constraints.isDefined).toContain(`Naam is verplicht!`);
        });

        it('has a required emailDomain', async () => {
            const model = plainToInstance(CreateOrganizationDTO, { name: 'Test' })

            const err = await validate(model);

            expect(err.length).not.toBe(0);
            expect(err[0].constraints.isDefined).toContain(`Email domein is verplicht!`);
        });

        // Class validator is isType
        it('name has a incorrect type', async () => {
            const model = plainToInstance(CreateOrganizationDTO, { name: 1 })

            const err = await validate(model);

            expect(err.length).not.toBe(0);
            expect(err[0].constraints.isString).toContain(`Naam moet van het type string zijn!`);
        });

        it('emailDomain has a incorrect type', async () => {
            const model = plainToInstance(CreateOrganizationDTO, { name: 'Test', emailDomain: 1 })

            const err = await validate(model);

            expect(err.length).not.toBe(0);
            expect(err[0].constraints.isString).toContain(`Email domein moet van het type string zijn!`);
        });
    })

    describe('UpdateOrganizationDTO', () => {
        // Class validator is required
        it('has a required name', async () => {
            const model = plainToInstance(UpdateOrganizationDTO, {})

            const err = await validate(model);

            expect(err.length).not.toBe(0);
            expect(err[0].constraints.isDefined).toContain(`Naam is verplicht!`);
        });

        it('has a required emailDomain', async () => {
            const model = plainToInstance(UpdateOrganizationDTO, { name: 'Test' })

            const err = await validate(model);

            expect(err.length).not.toBe(0);
            expect(err[0].constraints.isDefined).toContain(`Email domein is verplicht!`);
        });

        // Class validator is isType
        it('name has a incorrect type', async () => {
            const model = plainToInstance(UpdateOrganizationDTO, { name: 1 })

            const err = await validate(model);

            expect(err.length).not.toBe(0);
            expect(err[0].constraints.isString).toContain(`Naam moet van het type string zijn!`);
        });

        it('emailDomain has a incorrect type', async () => {
            const model = plainToInstance(UpdateOrganizationDTO, { name: 'Test', emailDomain: 1 })

            const err = await validate(model);

            expect(err.length).not.toBe(0);
            expect(err[0].constraints.isString).toContain(`Email domein moet van het type string zijn!`);
        });
    })
});