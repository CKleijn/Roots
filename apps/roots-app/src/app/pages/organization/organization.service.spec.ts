/* eslint-disable @typescript-eslint/no-non-null-assertion */
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Log, Organization, User } from "@roots/data";
import { environment } from "apps/roots-app/src/environments/environment";
import { Types } from "mongoose";
import { ToastrModule } from "ngx-toastr";
import { OrganizationService } from "./organization.service";

describe('OrganizationService', () => {
    let organizationService: OrganizationService;
    let httpMock: HttpTestingController;
    let dummyParticipants: User[] = [];
    let dummyOrganization: Organization | undefined;
    let dummyUser: User | undefined;
    let dummyLogs: Log[] = [];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                ToastrModule.forRoot()
            ],
            providers: [
                OrganizationService,
                {
                    useValue: {
                        loggedInUser: {
                        firstName: jest.fn().mockResolvedValue('Kasper') ,
                        lastName: jest.fn().mockResolvedValue('van den Enden')
                    } 
                }
                }
            ]
        });

        organizationService = TestBed.inject(OrganizationService);
        httpMock = TestBed.inject(HttpTestingController);

        dummyParticipants = [
            {
                _id: new Types.ObjectId('6391333037ceb01d296c5982'),
                firstname: 'Klaas',
                lastname: 'Vaak',
                emailAddress: 'klaasvaak@gmail.com',
                password: 'Wachtwoord1',
                access_token: '',
                organization: new Types.ObjectId('6391333037ceb01d296c5982'),
                initials: 'KV',
                isActive: true,
                isVerified: true,
            },
            {
                _id: new Types.ObjectId('63913b615640812705d69976'),
                firstname: 'Peter',
                lastname: 'Pan',
                emailAddress: 'peterpan@gmail.com',
                password: 'Wachtwoord1',
                access_token: '',
                organization: new Types.ObjectId('6391333037ceb01d296c5982'),
                initials: 'PP',
                isActive: true,
                isVerified: true,
            },
        ];

        const loggedInUser = {
            firstName: 'Kasper',
            lastName: 'van den Enden'
        }

        dummyLogs = [
            {
                editor: loggedInUser.firstName + ' ' + loggedInUser.lastName,
                action:'AANGEMAAKT',
                object:'EVENT',
                logStamp:new Date()
            },
            {
                editor:loggedInUser.firstName + ' ' + loggedInUser.lastName,
                action:'GEWIJZIGD',
                object:'TAG',
                logStamp:new Date()
            }
        ]
        
        dummyOrganization = {
            _id: new Types.ObjectId('6391333037ceb01d296c5982'),
            name: 'Google',
            emailDomain: 'gmail.com',
            events: [],
            tags: [],
            logs: [],
        }
    
        dummyUser = {
            _id: new Types.ObjectId('6391333037ceb01d296c6961'),
            firstname: 'John',
            lastname: 'Doe',
            emailAddress: 'johndoe@gmail.com',
            password: 'secret',
            access_token: '',
            organization: new Types.ObjectId('6391333037ceb01d296c5982'),
            initials: 'JD',
            isActive: true,
            isVerified: true,
        }
    });

    it('Should create the service', () => {
        expect(organizationService).toBeTruthy();
    });

    it('Should return all participants when calling all participants', (done) => {
        const organizationId = '6391333037ceb01d296c5982';

        organizationService.getParticipants(organizationId).subscribe((participants) => {
            expect(participants).toBeDefined();
            expect(participants.length).toBe(2);
            expect(participants[0]._id).toEqual(dummyParticipants[0]._id);
            expect(participants[0].firstname).toEqual(dummyParticipants[0].firstname);
            expect(participants[0].lastname).toEqual(dummyParticipants[0].lastname);
            expect(participants[0].emailAddress).toEqual(dummyParticipants[0].emailAddress);
            expect(participants[0].password).toEqual(dummyParticipants[0].password);
            expect(participants[0].access_token).toEqual(dummyParticipants[0].access_token);
            expect(participants[0].organization).toEqual(dummyParticipants[0].organization);
            expect(participants[0].initials).toEqual(dummyParticipants[0].initials);
            expect(participants[0].isActive).toEqual(dummyParticipants[0].isActive);
            expect(participants[1]._id).toEqual(dummyParticipants[1]._id);
            expect(participants[1].firstname).toEqual(dummyParticipants[1].firstname);
            expect(participants[1].lastname).toEqual(dummyParticipants[1].lastname);
            expect(participants[1].emailAddress).toEqual(dummyParticipants[1].emailAddress);
            expect(participants[1].password).toEqual(dummyParticipants[1].password);
            expect(participants[1].access_token).toEqual(dummyParticipants[1].access_token);
            expect(participants[1].organization).toEqual(dummyParticipants[1].organization);
            expect(participants[1].initials).toEqual(dummyParticipants[1].initials);
            expect(participants[1].isActive).toEqual(dummyParticipants[1].isActive);
            done();
        })

        const req = httpMock.expectOne(environment.SERVER_API_URL + `/organizations/${organizationId}/participants`);
        expect(req.request.url).toBe(environment.SERVER_API_URL + `/organizations/${organizationId}/participants`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyParticipants);
    });

    it('Should return no participants when calling all participants', (done) => {
        dummyParticipants = [];
        const organizationId = undefined;

        organizationService.getParticipants(organizationId!).subscribe((participants) => {
            expect(participants).toBeDefined();
            expect(participants.length).toBe(0);
            done();
        })

        const req = httpMock.expectOne(environment.SERVER_API_URL + `/organizations/${organizationId}/participants`);
        expect(req.request.url).toBe(environment.SERVER_API_URL + `/organizations/${organizationId}/participants`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyParticipants);
    });

    it('Should return organization when calling organization by id', (done) => {
        const organizationId = '6391333037ceb01d296c5982';

        organizationService.getById(organizationId).subscribe((organization) => {
            expect(organization).toBeDefined();
            expect(organization._id).toEqual(dummyOrganization!._id);
            expect(organization.name).toEqual(dummyOrganization!.name);
            expect(organization.emailDomain).toEqual(dummyOrganization!.emailDomain);
            expect(organization.events).toEqual(dummyOrganization!.events);
            expect(organization.tags).toEqual(dummyOrganization!.tags);
            done();
        })

        const req = httpMock.expectOne(environment.SERVER_API_URL + `/organizations/${organizationId}`);
        expect(req.request.url).toBe(environment.SERVER_API_URL + `/organizations/${organizationId}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyOrganization!);
    });

    it('Should return no organization when calling organization by id', (done) => {
        dummyOrganization = null!;
        const organizationId = undefined;

        organizationService.getById(organizationId!).subscribe((organization) => {
            expect(organization).toBeDefined();
            expect(organization).toEqual(null);
            expect(organization).toBeNull();
            done();
        })

        const req = httpMock.expectOne(environment.SERVER_API_URL + `/organizations/${organizationId}`);
        expect(req.request.url).toBe(environment.SERVER_API_URL + `/organizations/${organizationId}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyOrganization);
    });

    it('Should return organization when calling create', (done) => {
        organizationService.create(dummyOrganization!).subscribe((organization) => {
            expect(organization).toBeDefined();
            expect(organization._id).toEqual(dummyOrganization!._id);
            expect(organization.name).toEqual(dummyOrganization!.name);
            expect(organization.emailDomain).toEqual(dummyOrganization!.emailDomain);
            expect(organization.events).toEqual(dummyOrganization!.events);
            expect(organization.tags).toEqual(dummyOrganization!.tags);
            done();
        })

        const req = httpMock.expectOne(environment.SERVER_API_URL + `/organizations`);
        expect(req.request.url).toBe(environment.SERVER_API_URL + `/organizations`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.name).toEqual(dummyOrganization!.name);
        expect(req.request.body.emailDomain).toEqual(dummyOrganization!.emailDomain);
        expect(req.request.body.events).toEqual(dummyOrganization!.events);
        expect(req.request.body.tags).toEqual(dummyOrganization!.tags);
        req.flush(dummyOrganization!);
    });

    it('Should return user when calling status by id', (done) => {
        const userId = '6391333037ceb01d296c6961';

        organizationService.status(userId).subscribe((user) => {
            expect(user).toBeDefined();
            expect(user._id).toEqual(dummyUser!._id);
            expect(user.firstname).toEqual(dummyUser!.firstname);
            expect(user.lastname).toEqual(dummyUser!.lastname);
            expect(user.emailAddress).toEqual(dummyUser!.emailAddress);
            expect(user.password).toEqual(dummyUser!.password);
            expect(user.access_token).toEqual(dummyUser!.access_token);
            expect(user.organization).toEqual(dummyUser!.organization);
            expect(user.initials).toEqual(dummyUser!.initials);
            expect(user.isActive).toEqual(dummyUser!.isActive);
            done();
        })

        const req = httpMock.expectOne(environment.SERVER_API_URL + `/users/${userId}/status`);
        expect(req.request.url).toBe(environment.SERVER_API_URL + `/users/${userId}/status`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({});
        req.flush(dummyUser!);
    });

    
    // it('Should return logs when calling log', (done) => {
    //     const organizationId = '6391333037ceb01d296c6961';

    //     organizationService.log(organizationId).subscribe((logs) => {
    //         expect(logs.length).toBe(2);
    //         expect(logs[0].editor).toContain(dummyLogs[0].editor);
    //         expect(logs[0].action).toContain(dummyLogs[0].action);
    //         expect(logs[0].object).toContain(dummyLogs[0].object);
    //         expect(logs[0].logStamp).toContain(dummyLogs[0].logStamp);
    //         expect(logs[1].action).toContain(dummyLogs[1].action);
    //         expect(logs[1].object).toContain(dummyLogs[1].object);
    //         expect(logs[1].object).toContain(dummyLogs[1].object);
    //         expect(logs[1].logStamp).toContain(dummyLogs[1].logStamp);
          
    //         done();
    //     })

    //     // const req = httpMock.expectOne(environment.SERVER_API_URL + `/log/${organizationId}`);
    //     // expect(req.request.url).toBe(environment.SERVER_API_URL + `/log/${organizationId}`);
    //     // expect(req.request.method).toBe('GET');
    //     // expect(req.request.body).toEqual(null);
    //     // req.flush(dummyLogs!);
    // });
   
    // it('Should return a log when calling log', (done) => {
    //     const organizationId = '6391333037ceb01d296c6961';

    //     organizationService.log(organizationId).subscribe((logs) => {
    //         expect(logs.length).toBe(2);
    //         expect(logs[0].editor).toContain(dummyLogs[0].editor);
    //         expect(logs[0].action).toContain(dummyLogs[0].action);
    //         expect(logs[0].object).toContain(dummyLogs[0].object);
    //         expect(logs[0].logStamp).toContain(dummyLogs[0].logStamp);
    //         expect(logs[1].action).toContain(dummyLogs[1].action);
    //         expect(logs[1].object).toContain(dummyLogs[1].object);
    //         expect(logs[1].object).toContain(dummyLogs[1].object);
    //         expect(logs[1].logStamp).toContain(dummyLogs[1].logStamp);
          
    //         done();
    //     })

    //     // const req = httpMock.expectOne(environment.SERVER_API_URL + `/log/${organizationId}`);
    //     // expect(req.request.url).toBe(environment.SERVER_API_URL + `/log/${organizationId}`);
    //     // expect(req.request.method).toBe('GET');
    //     // expect(req.request.body).toEqual(null);
    //     // req.flush(dummyLogs!);
    // });
})