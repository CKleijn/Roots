import { Injectable } from '@angular/core';
import { HttpClient } from'@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) {}

  getEvents(): Observable<any> {
    return this.httpClient.get(
      `http://localhost:27017/api/events`,
    );
  }
}
