/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/ban-types */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Tag } from './tag.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { environment } from 'apps/roots-app/src/environments/environment.prod';
import { OrganizationService } from '../organization/organization.service';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private organizationService: OrganizationService
  ) {}

  // Get all tags by organization
  getAllTagsByOrganization(organizationId: string): Observable<any[]> {
    return this.httpClient.get(
      environment.SERVER_API_URL + '/tags/organizations/' + organizationId
    ) as Observable<any[]>;
  }

  // Get tag by ID
  getTagById(tagId: string): Observable<any> {
    return this.httpClient.get(
      environment.SERVER_API_URL + '/tags/' + tagId
    ) as Observable<any>;
  }

  // Create tag and put in event
  postTagInEvent(
    tag: object,
    organizationId: string,
    eventId: string
  ): Observable<any> {
    return this.httpClient
      .post(
        environment.SERVER_API_URL +
          '/tags/new/organizations/' +
          organizationId +
          '/events/' +
          eventId,
        tag,
        this.authService.getHttpOptions()
      )
      .pipe(
        map((tag) => {
          this.toastr.success(
            'Tag is succesvol aangemaakt!',
            'Tag aangemaakt!'
          );
          return tag;
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          this.toastr.error(err.error.message, 'Tag niet aangemaakt!');
          return of(undefined);
        })
        // eslint-disable-next-line @typescript-eslint/ban-types
      ) as Observable<Object>;
  }

  // Create tag in put in organization
  postTagInOrganization(
    newTag: any,
    organizationId: string
  ): Observable<any> {
    return this.httpClient
      .post(
        environment.SERVER_API_URL +
          '/tags/new/organizations/' +
          organizationId,
        newTag,
        this.authService.getHttpOptions()
      )
      .pipe(
        map((tag) => {
          if (tag) {
            this.authService.getUserFromLocalStorage().subscribe((loggedInUser) => {
              this.organizationService
                .logCreate(loggedInUser, 'Aangemaakt', '(T) ' + newTag.name)
                .subscribe().unsubscribe;
            }).unsubscribe;

            this.toastr.success(
              'Tag is succesvol aangemaakt!',
              'Tag aangemaakt!'
            );
          }
          return tag;
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          this.toastr.error(err.error.message, 'Tag niet aangemaakt!');
          return of(undefined);
        })
        // eslint-disable-next-line @typescript-eslint/ban-types
      ) as Observable<Object>;
  }

  // Edit tag
  putTag(newTag: Tag, tagId: string): Observable<any> {
    return this.httpClient
      .put(
        environment.SERVER_API_URL + '/tags/' + tagId,
        newTag,
        this.authService.getHttpOptions()
      )
      .pipe(
        map((tag) => {
          if (tag) {
            this.authService.getUserFromLocalStorage().subscribe((loggedInUser) => {
              this.organizationService
                .logCreate(loggedInUser, 'Gewijzigd', '(T) ' + newTag.name)
                .subscribe().unsubscribe;
            }).unsubscribe;

            this.toastr.success(
              'Tag is succesvol aangepast!',
              'Tag aangepast!'
            );
          }

          return tag;
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          this.toastr.error(err.error.message, 'Tag niet aangepast!');
          return of(undefined);
        })
      ) as Observable<Object>;
  }

  // Delete tag
  deleteTag(tagId: string, organizationId: string): Observable<any> {
    return this.httpClient
      .delete(
        environment.SERVER_API_URL +
          '/tags/' +
          tagId +
          '/organization/' +
          organizationId,
        this.authService.getHttpOptions()
      )
      .pipe(
        map((tag) => {
          this.toastr.success('Tag is succesvol verwijdert', 'Tag verwijdert!');
          return tag;
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          this.toastr.error(err.error.message, 'Tag niet verwijdert!');
          return of(undefined);
        })
      ) as Observable<Object>;
  }
}
