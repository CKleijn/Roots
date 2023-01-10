import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { environment } from "apps/roots-app/src/environments/environment.prod";
import { Observable, catchError, map, of } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Event } from '../event/event.model'
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class EventService {

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  getAllEvents(): Observable<Event[]> {
    return this.httpClient.get(
      environment.SERVER_API_URL + '/events'
    ) as Observable<Event[]>;
  }

    getEventsPerPage(old_records: number, new_records: number, organizationId: string): Observable<any[]> {
        return this.httpClient.get(environment.SERVER_API_URL + `/events/${organizationId}/filter?old_records=${old_records}&new_records=${new_records}`) as Observable<any[]>;
    }

    getEventById(eventId: string): Observable<Event> {
        return this.httpClient.get(environment.SERVER_API_URL + '/events/' + eventId) as Observable<Event>;
    }

  postEvent(event: Event, companyId: string): Observable<any> {
    return this.httpClient
      .post(
        environment.SERVER_API_URL + '/events/new/' + companyId,
        event,
        this.authService.getHttpOptions()
      )
      .pipe(
        map((event) => {
          this.toastr.success(
            'Gebeurtenis is succesvol aangemaakt!',
            'Gebeurtenis aangemaakt!'
          );
          return event;
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          this.toastr.error(err.error.message, 'Gebeurtenis niet aangemaakt!');
          return of(undefined);
        })
        // eslint-disable-next-line @typescript-eslint/ban-types
      ) as Observable<Object>;
  }

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
        map((event) => {
          this.toastr.success(
            'Gebeurtenis is succesvol aangepast!',
            'Gebeurtenis aangepast!'
          );
          return event;
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          this.toastr.error(err.error.message, 'Gebeurtenis niet aangepast!');
          return of(undefined);
        })
        // eslint-disable-next-line @typescript-eslint/ban-types
      ) as Observable<Object>;
  }
  
  archiveEvent(isActive: boolean, eventId: string, companyId: string): Observable<any> {
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
        map((event) => {
          this.toastr.success(
            'Gebeurtenis is succesvol ' + (!isActive ? 'gearchiveerd!' : 'geactiveerd!')
          );
          return event;
        }),
        catchError((err: any) => {
          window.scroll(0, 0);
          this.toastr.error(err.error.message, 'Gebeurtenis niet ' + (!isActive ? 'gearchiveerd!' : 'geactiveerd!'));
          return of(undefined);
        })
        // eslint-disable-next-line @typescript-eslint/ban-types
      ) as Observable<Object>;
  }

}