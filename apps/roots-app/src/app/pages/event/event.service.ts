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
        return this.httpClient.get(environment.SERVER_API_URL + '/events') as Observable<Event[]>;
    }

    getEventById(eventId: string): Observable<Event> {
        return this.httpClient.get(environment.SERVER_API_URL + '/events/' + eventId) as Observable<Event>;
    }

    postEvent(event: Event,companyId:string) {
        console.log('(POST)',event)
        return this.httpClient.post<Event>(environment.SERVER_API_URL + '/events/new/' + companyId, event) as Observable<any>
    }

    putEvent(event: Event, eventId:string | null, companyId:string): Observable<any> {
        console.log('(PUT)',event)
        return this.httpClient.put<Event>(environment.SERVER_API_URL + '/events/' + eventId +'/' + companyId, event) as Observable<any>
    }
}