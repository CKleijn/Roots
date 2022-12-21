import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Organization, User } from '@roots/data';

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
  ) { }

  getParticipants(organizationId: string): Observable<User[]> {
    return this.httpClient
      .get(
        environment.SERVER_API_URL + `/organizations/${organizationId}/participants`,
        this.authService.getHttpOptions()
      ) as Observable<User[]>
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
}
