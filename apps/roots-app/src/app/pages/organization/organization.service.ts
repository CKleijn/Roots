/* eslint-disable @typescript-eslint/ban-types */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILog, Log, Organization, User } from '@roots/data';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  getParticipants(organizationId: string): Observable<User[]> {
    return this.httpClient.get(
      environment.SERVER_API_URL +
        `/organizations/${organizationId}/participants`,
      this.authService.getHttpOptions()
    ) as Observable<User[]>;
  }

  getById(organizationId: string): Observable<Organization> {
    return this.httpClient.get(
      environment.SERVER_API_URL + `/organizations/${organizationId}`,
      this.authService.getHttpOptions()
    ) as Observable<Organization>;
  }

  create(organization: Organization): Observable<any> {
    return this.httpClient
      .post(
        environment.SERVER_API_URL + '/organizations',
        organization,
        this.authService.getHttpOptions()
      )
      .pipe(
        map((organization) => {
          this.toastr.success(
            'Je hebt succesvol een organisatie aangemaakt!',
            'Organisatie aangemaakt'
          );

          return organization;
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          this.toastr.error(err.error.message, 'Organisatie niet aangemaakt');
          return of(undefined);
        })
        // eslint-disable-next-line @typescript-eslint/ban-types
      ) as Observable<Object>;
  }

  status(id: string): Observable<any> {
    return this.httpClient
      .post(
        environment.SERVER_API_URL + '/users/' + id + '/status',
        {},
        this.authService.getHttpOptions()
      )
      .pipe(
        map((user: any) => {
          const status = user.isActive ? 'geactiveerd' : 'gedeactiveerd';

          this.toastr.success(
            `Je hebt het account succesvol ${status}`,
            'Account status veranderd'
          );
          return user;
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          this.toastr.error(err.error.message, 'Account status niet veranderd');
          return of(undefined);
        })
        // eslint-disable-next-line @typescript-eslint/ban-types
      ) as Observable<Object>;
  }

  log(organizationId: string): Observable<any> {
    return this.httpClient
      .get(
        environment.SERVER_API_URL + '/log/' + organizationId,
        this.authService.getHttpOptions()
      )
      .pipe(
        map((log: any) => {
          return log;
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          this.toastr.error(err.error.message, 'Log is niet gevonden');
          return of(undefined);
        })
      ) as Observable<Object>;
  }

  logCreate(
    loggedInUser: any,
    action: string,
    object: string
  ): Observable<any> {
    const log: Log = {
      editor: loggedInUser.firstname + ' ' + loggedInUser.lastname,
      action: action,
      object: object,
      logStamp: new Date(),
    };
    console.log(log)
    const organizationId = loggedInUser.organization.toString();
    return this.httpClient
      .put(
        environment.SERVER_API_URL + '/log/' + organizationId,
        log,
        this.authService.getHttpOptions()
      )
      .pipe(
        map((organization) => {
          this.toastr.success('log aangemaakt');

          return organization;
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          this.toastr.error(err.error.message, 'Log mislukt');
          return of(undefined);
        })
      ) as Observable<Object>;
  }
}
