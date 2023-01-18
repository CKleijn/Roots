import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate } from '@nestjs/common';
import { Public } from '../auth/auth.module';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDTO } from './organization.dto';
import { Organization } from './organization.schema';

describe('Event controller', () => {
    let app: TestingModule;
    let organizationController: OrganizationController;
    let organizationService: OrganizationService;
    let fakeGuard: CanActivate = { canActivate: () => true };

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [OrganizationController],
            providers: [{
                provide: OrganizationService,
                useValue: {
                    getById: jest.fn(),
                    getAll: jest.fn(),
                    create: jest.fn(),
                },
            }],
        })
        .overrideGuard(Public).useValue(fakeGuard)
        .compile();

        organizationController = app.get<OrganizationController>(OrganizationController);
        organizationService = app.get<OrganizationService>(OrganizationService);
    });

    it('should call getAll on the service', async () => {
        const exampleOrganizations: Organization[] = [
            {
                name: 'Organization1',
                emailDomain: 'organization1.com',
                events: [null],
                tags: [null],
                logs: [],
            },
            {
                name: 'Organization2',
                emailDomain: 'organization2.com',
                events: [null],
                tags: [null],
                logs: [],
            }
        ]

        const getOrganizations = jest.spyOn(organizationService, 'getAll')
            .mockImplementation(async () => exampleOrganizations);

        const results = await organizationController.getAll();

        expect(getOrganizations).toBeCalledTimes(1);
        expect(results).toHaveLength(2);
        expect(results[0]).toHaveProperty('name', exampleOrganizations[0].name);
        expect(results[0]).toHaveProperty('emailDomain', exampleOrganizations[0].emailDomain);
        expect(results[0]).toHaveProperty('events', exampleOrganizations[0].events);
        expect(results[0]).toHaveProperty('tags', exampleOrganizations[0].tags);
        expect(results[1]).toHaveProperty('name', exampleOrganizations[1].name);
        expect(results[1]).toHaveProperty('emailDomain', exampleOrganizations[1].emailDomain);
        expect(results[1]).toHaveProperty('events', exampleOrganizations[1].events);
        expect(results[1]).toHaveProperty('tags', exampleOrganizations[1].tags);
    });

    it('should call getById on the service', async () => {
        const exampleOrganization: Organization = {
            name: 'Organization1',
            emailDomain: 'organization1.com',
            events: [null],
            tags: [null],
            logs: [],
        }

        const getOrganization = jest.spyOn(organizationService, 'getById')
            .mockImplementation(async () => exampleOrganization);

        const organizationId = '638fd0ec2a2c5f2af03d4c94';

        const result = await organizationController.getById(organizationId);

        expect(getOrganization).toBeCalledTimes(1);
        expect(result).toHaveProperty('name', exampleOrganization.name);
        expect(result).toHaveProperty('emailDomain', exampleOrganization.emailDomain);
        expect(result).toHaveProperty('events', exampleOrganization.events);
        expect(result).toHaveProperty('tags', exampleOrganization.tags);
    });

    it('should call create on the service', async () => {
        const organization: CreateOrganizationDTO = {
            name: 'Organization2',
            emailDomain: 'organization2.com',
        }

        const exampleOrganization: Organization = {
            name: 'Organization2',
            emailDomain: 'organization2.com',
            events: [null],
            tags: [null],
            logs: [],
        }

        const createOrganization = jest.spyOn(organizationService, 'create')
            .mockImplementation(async () => exampleOrganization);

        const result = await organizationController.createCommunity(organization);

        expect(createOrganization).toBeCalledTimes(1);
        expect(result).toHaveProperty('name', exampleOrganization.name);
        expect(result).toHaveProperty('emailDomain', exampleOrganization.emailDomain);
        expect(result).toHaveProperty('events', exampleOrganization.events);
        expect(result).toHaveProperty('tags', exampleOrganization.tags);
    });
});