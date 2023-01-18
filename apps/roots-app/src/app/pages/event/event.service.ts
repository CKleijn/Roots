import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { environment } from 'apps/roots-app/src/environments/environment';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Event } from '../event/event.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { OrganizationService } from '../organization/organization.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private organizationService: OrganizationService
  ) {}

  // Get all events
  getAllEvents(organizationId: string): Observable<Event[]> {
    return this.httpClient.get(
      environment.SERVER_API_URL + `/events/organization/${organizationId}`
    ) as Observable<Event[]>;
  }

  // Get an amount of events
  getEventsPerPage(
    old_records: number,
    new_records: number,
    organizationId: string,
    show_archived_events: boolean
  ): Observable<any[]> {
    return this.httpClient.get(
      environment.SERVER_API_URL +
        `/events/${organizationId}/filter?old_records=${old_records}&new_records=${new_records}&show_archived_events=${show_archived_events}`
    ) as Observable<any[]>;
  }

  // Search events by term
  getEventsByTerm(
    term: string,
    organizationId: string,
    show_archived_events: boolean
  ): Observable<any> {
    return this.httpClient.get(
      environment.SERVER_API_URL +
        `/events/${organizationId}/filter?term=${term}&show_archived_events=${show_archived_events}`
    );
  }

  // Get event by ID
  getEventById(eventId: string): Observable<Event> {
    return this.httpClient.get(
      environment.SERVER_API_URL + '/events/' + eventId
    ) as Observable<Event>;
  }

  // Create an event
  postEvent(event: Event, companyId: string): Observable<any> {
    return this.httpClient
      .post(
        environment.SERVER_API_URL + '/events/new/' + companyId,
        event,
        this.authService.getHttpOptions()
      )
      .pipe(
        map(() => {
          this.authService.getUserFromLocalStorage().subscribe((loggedInUser) => {
            this.organizationService
              .logCreate(loggedInUser, 'Aangemaakt', '(G) ' + event.title)
              .subscribe().unsubscribe;
          }).unsubscribe;

          this.toastr.success(
            'Gebeurtenis is succesvol aangemaakt!',
            'Gebeurtenis aangemaakt!'
          );
          return this.router.navigate([`organizations/${companyId}/timeline`]);
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          if (
            err.error.message ===
            `The value of \"offset\" is out of range. It must be >= 0 && <= 17825792. Received 17825794`
          ) {
            this.toastr.error(
              'De inhoud van deze gebeurtenis overschreid de maximale grootte van 15 MB!',
              'Gebeurtenis niet aangemaakt!'
            );
          } else {
            this.toastr.error(
              err.error.message,
              'Gebeurtenis niet aangemaakt!'
            );
          }
          return of(undefined);
        })
        // eslint-disable-next-line @typescript-eslint/ban-types
      ) as Observable<Object>;
  }

  // Update an event
  putEvent(event: Event, eventId: string, companyId: string): Observable<any> {
    return this.httpClient
      .put(
        environment.SERVER_API_URL +
          '/events/' +
          companyId +
          '/' +
          eventId +
          '/edit',
        event,
        this.authService.getHttpOptions()
      )
      .pipe(
        map(() => {
          this.authService.getUserFromLocalStorage().subscribe((loggedInUser) => {
            this.organizationService
              .logCreate(loggedInUser, 'Gewijzigd', '(G) ' + event.title)
              .subscribe().unsubscribe;
          }).unsubscribe;

          this.toastr.success(
            'Gebeurtenis is succesvol aangepast!',
            'Gebeurtenis aangepast!'
          );
          return this.router.navigate([
            `organizations/${companyId}/events/${eventId}`,
          ]);
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          if (err.status === 304) {
            this.toastr.error(
              'De inhoud van deze gebeurtenis overschreid de maximale grootte van 15 MB!',
              'Gebeurtenis niet aangemaakt!'
            );
          } else {
            this.toastr.error(
              err.error.message,
              'Gebeurtenis niet aangemaakt!'
            );
          }
          return of(undefined);
        })
        // eslint-disable-next-line @typescript-eslint/ban-types
      ) as Observable<Object>;
  }

  // Archive an event
  archiveEvent(
    isActive: boolean,
    eventId: string,
    companyId: string
  ): Observable<any> {
    return this.httpClient
      .put(
        environment.SERVER_API_URL +
          '/events/' +
          companyId +
          '/' +
          eventId +
          '/archive?isActive=' +
          isActive,

        this.authService.getHttpOptions()
      )
      .pipe(
        map((event: any) => {
          if (event) {
            this.authService.getUserFromLocalStorage().subscribe((loggedInUser) => {
              this.organizationService
                .logCreate(
                  loggedInUser,
                  isActive ? 'Gearchiveerd' : 'Gedearchiveerd',
                  '(G) ' + event.title
                )
                .subscribe();
            });

            this.toastr.success(
              'Gebeurtenis is succesvol ' +
                (!isActive ? 'gearchiveerd!' : 'gedearchiveerd!')
            );
          }
          return event;
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          this.toastr.error(
            err.error.message,
            'Gebeurtenis niet ' +
              (!isActive ? 'gearchiveerd!' : 'gedearchiveerd!')
          );
          return of(undefined);
        })
        // eslint-disable-next-line @typescript-eslint/ban-types
      ) as Observable<Object>;
  }
}
