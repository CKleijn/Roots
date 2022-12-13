import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "apps/roots-app/src/environments/environment.prod";
import { Observable, catchError } from "rxjs";
import { Event } from '../event/event.model'

@Injectable({
    providedIn: 'root'
})
export class EventService {
    constructor(private httpClient: HttpClient) { }

    getAllEvents(): Observable<Event[]> {
        return this.httpClient.get(environment.API_URL + 'events') as Observable<Event[]>;
    }

    getEventById(eventId: string): Observable<Event> {
        return this.httpClient.get(environment.API_URL + 'events/' + eventId) as Observable<Event>;
    }
}