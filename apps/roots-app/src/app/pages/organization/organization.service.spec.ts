global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
import { HttpHeaders } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Organization, User } from "@roots/data";
import { environment } from "apps/roots-app/src/environments/environment";
import { Types } from "mongoose";
import { ToastrService } from "ngx-toastr";
import { of } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { OrganizationService } from "./organization.service";

describe('OrganizationService', () => {
    let organizationService: OrganizationService;
    let httpMock: HttpTestingController;
    let authServiceMock: any;
    let toastrServiceMock: any;
    const dummyParticipants: User[] = [
        {
            _id: new Types.ObjectId('6391333037ceb01d296c5982'),
            firstname: 'Klaas',
            lastname: 'Vaak',
            emailAddress: 'klaasvaak@gmail.com',
            password: 'Wachtwoord1',
            access_token: '',
            organization: new Types.ObjectId('6391333037ceb01d296c5982'),
            initials: 'KV',
            isActive: true
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
            isActive: true
        },
    ];

    const dummyOrganizations: Organization[] = [
        {
            _id: new Types.ObjectId('6391333037ceb01d296c5982'),
            name: 'Google',
            emailDomain: 'gmail.com',
            events: [],
            tags: [],
        },
        {
            _id: new Types.ObjectId('3277333037ceb01d296c5125'),
            name: 'Yahoo',
            emailDomain: 'yahoo.com',
            events: [],
            tags: [],
        }
    ]

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: ToastrService, useValue: toastrServiceMock }
            ]
        });

        organizationService = TestBed.inject(OrganizationService);
        httpMock = TestBed.inject(HttpTestingController);

        authServiceMock = {
            getUserFromLocalStorage: jest.fn().mockReturnValue(of(new User())),
            getHttpOptions: jest.fn().mockReturnValue(of({ headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + 'token'})
              }))
        }
    });

    it('Should create the service', () => {
        expect(organizationService).toBeTruthy();
    });

    it('Should return all participants when calling all participants', (done) => {
        const organizationId = '6391333037ceb01d296c5982';

        organizationService.getParticipants(organizationId).subscribe((participants) => {
            expect(participants.length).toBe(2);
            expect(participants[0]._id).toEqual(dummyParticipants[0]._id);
            expect(participants[1]._id).toEqual(dummyParticipants[1]._id);
            done();
        })

        const req = httpMock.expectOne(environment.SERVER_API_URL + `/organizations/${organizationId}/participants`);
        expect(req.request.url).toBe(environment.SERVER_API_URL + `/organizations/${organizationId}/participants`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyParticipants);
    });
})