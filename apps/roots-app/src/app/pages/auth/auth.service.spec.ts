global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
import { HttpHeaders } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from '@roots/data';
import { environment } from 'apps/roots-app/src/environments/environment';
import { Types } from 'mongoose';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthenticationService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let authServiceMock: any;
  let toastrServiceMock: any;
  let localStorageMock: any;
  let dummyParticipants: User[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [AuthService],
    });

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

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };

    localStorage = localStorageMock;

    localStorage.clear();

    authServiceMock = {
      getUserFromLocalStorage: jest.fn().mockReturnValue(of(new User())),
      getHttpOptions: jest.fn().mockReturnValue(
        of({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + 'token',
          }),
        })
      ),
    };
  });

  describe('Login', () => {
    it('login should return user', () => {
      const email = 'klaasvaak@gmail.com';
      const password = 'Wachtwoord1';

      authService.login(email, password).subscribe((user) => {
        expect(user).toBeDefined();
        expect(user?._id).toEqual(dummyParticipants[0]._id);
        expect(user?.firstname).toEqual(dummyParticipants[0].firstname);
        expect(user?.lastname).toEqual(dummyParticipants[0].lastname);
        expect(user?.emailAddress).toEqual(dummyParticipants[0].emailAddress);
        expect(user?.initials).toEqual(dummyParticipants[0].initials);
        expect(user?.organization).toEqual(dummyParticipants[0].organization);
        expect(user?.initials).toEqual(dummyParticipants[0].initials);
        expect(user?.isActive).toEqual(dummyParticipants[0].isActive);
      });

      const req = httpMock.expectOne(
        environment.SERVER_API_URL + `/auth/login`
      );
      expect(req.request.url).toBe(environment.SERVER_API_URL + `/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(dummyParticipants);
    });

    it('Unvalid Login, no user returned', () => {
      const email = 'klaaak@gmail.com';
      const password = 'Wachtwoord2';

      authService.login(email, password).subscribe((user) => {
        expect(user).toBeDefined();
        expect(user?._id).not.toEqual(dummyParticipants[0]._id);
        expect(user?.firstname).not.toEqual(dummyParticipants[0].firstname);
        expect(user?.lastname).not.toEqual(dummyParticipants[0].lastname);
        expect(user?.emailAddress).not.toEqual(
          dummyParticipants[0].emailAddress
        );
        expect(user?.initials).not.toEqual(dummyParticipants[0].initials);
        expect(user?.organization).not.toEqual(
          dummyParticipants[0].organization
        );
        expect(user?.initials).not.toEqual(dummyParticipants[0].initials);
        expect(user?.isActive).not.toEqual(dummyParticipants[0].isActive);
      });

      const req = httpMock.expectOne(
        environment.SERVER_API_URL + `/auth/login`
      );
      expect(req.request.url).toBe(environment.SERVER_API_URL + `/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(dummyParticipants);
    });
  });

  describe('ValidateToken', () => {
    it('validateToken should return user', () => {
      authService.validateToken(dummyParticipants[0]).subscribe((user) => {
        expect(user).toBeDefined();
        expect(user?._id).toEqual(dummyParticipants[0]._id);
        expect(user?.firstname).toEqual(dummyParticipants[0].firstname);
        expect(user?.lastname).toEqual(dummyParticipants[0].lastname);
        expect(user?.emailAddress).toEqual(dummyParticipants[0].emailAddress);
        expect(user?.initials).toEqual(dummyParticipants[0].initials);
        expect(user?.organization).toEqual(dummyParticipants[0].organization);
        expect(user?.initials).toEqual(dummyParticipants[0].initials);
        expect(user?.isActive).toEqual(dummyParticipants[0].isActive);
      });

      const req = httpMock.expectOne(
        environment.SERVER_API_URL + `/auth/profile`
      );
      expect(req.request.url).toBe(
        environment.SERVER_API_URL + `/auth/profile`
      );
      expect(req.request.method).toBe('GET');
      req.flush(dummyParticipants);
    });

    it('validateToken should return no user', () => {
      dummyParticipants = [];

      authService.validateToken(dummyParticipants[0]).subscribe((user) => {
        expect(user).not.toBeDefined();
      });

      const req = httpMock.expectOne(
        environment.SERVER_API_URL + `/auth/profile`
      );
      expect(req.request.url).toBe(
        environment.SERVER_API_URL + `/auth/profile`
      );
      expect(req.request.method).toBe('GET');
      req.flush(dummyParticipants);
    });
  });

  describe('Logout', () => {
    it('Logout should empty localStorage and currentUser', () => {
      authService.currentUser$ = new BehaviorSubject<User | undefined>(
        undefined
      );

      authService.logout();

      expect(authService.currentUser$.value).not.toBeDefined();
      expect(localStorage.length).toBe(0);
    });
  });

  describe('GetUserFromLocalStorage', () => {
    it('Should return a User', () => {
      localStorage.setItem('user', JSON.stringify(dummyParticipants[0]));

      authService.getUserFromLocalStorage().subscribe((user) => {
        expect(localStorage.length).toBe(1);
        expect(user).toEqual(of(dummyParticipants[0]));
      });
    });

    it('Should not return a User', () => {
      authService.getUserFromLocalStorage().subscribe((user) => {
        expect(localStorage.length).toBe(0);
        expect(user).not.toEqual(of(dummyParticipants[0]));
      });
    });
  });

  describe('SaveUserToLocalStorage', () => {
    it('Should save user to local storage', () => {
      authService.saveUserToLocalStorage(dummyParticipants[0]);

      expect(localStorage.length).toBe(1);
      expect(JSON.parse(localStorage.getItem('currentuser') as string)).toEqual(
        JSON.parse(JSON.stringify(dummyParticipants.at(0)))
      );
    });
  });

  describe('GetHttpOptions', () => {
    it('Should return httpOptions', () => {
        localStorage.setItem('currentuser', JSON.stringify(dummyParticipants.at(0)));

        const result = authService.getHttpOptions();
        expect(result).toBeDefined();
        expect(JSON.stringify(result)).toEqual(JSON.stringify({ headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + 'token',
          })}));
    });
  });
});
