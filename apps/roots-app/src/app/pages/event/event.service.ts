import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "apps/roots-app/src/environments/environment.prod";
import { Observable, catchError } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Event } from '../event/event.model'

@Injectable({
    providedIn: 'root'
})
export class EventService {
    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    getAllEvents(): Observable<Event[]> {
        return this.httpClient.get(environment.SERVER_API_URL + '/events') as Observable<Event[]>;
    }

    getEventById(eventId: string): Observable<Event> {
        return this.httpClient.get(environment.SERVER_API_URL + '/events/' + eventId) as Observable<Event>;
    }

    postEvent(event: Event, companyId: string): Observable<any> {
        return this.httpClient.post(environment.SERVER_API_URL + '/events/new/' + companyId,
            event,
            this.authService.getHttpOptions()
        ).pipe(
            catchError((error: any) => {
                throw new Error(error.error.message);
            })
        ) as Observable<Object>
    }

    putEvent(event: Event, eventId: string, companyId: string): Observable<any> {
        return this.httpClient.put(environment.SERVER_API_URL + '/events/' + companyId + '/' + eventId + '/edit',
            event,
            this.authService.getHttpOptions()
        ).pipe(
            catchError((error: any) => {
                throw new Error(error.error.message);
            })
        ) as Observable<Object>
    }
}