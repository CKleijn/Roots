import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../../../../../src/environments/environment.prod";
import { Observable, catchError, map, of } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import { Tag } from './tag.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class TagService {
    constructor(private httpClient: HttpClient, private authService: AuthService, private toastr: ToastrService) { }

    getAllTagsByOrganization(organizationId: string): Observable<any[]> {
        return this.httpClient.get(environment.SERVER_API_URL + '/tags/organizations/' + organizationId) as Observable<any[]>;
    }

    getTagById(tagId: string): Observable<any> {
        return this.httpClient.get(environment.SERVER_API_URL + '/tags/' + tagId) as Observable<any>;
    }

    postTagInEvent(tag: object, organizationId: string, eventId: string): Observable<any> {
        return this.httpClient.post(environment.SERVER_API_URL + '/tags/new/organizations/' + organizationId + '/events/' + eventId,
            tag,
            this.authService.getHttpOptions()
        ).pipe(
            map((tag) => {
                this.toastr.success('Tag is succesvol aangemaakt!', 'Tag aangemaakt!');
                return tag;
            }),
            catchError((err: any) => {
                window.scroll(0, 0)
                this.toastr.error(err.error.message, 'Tag niet aangemaakt!');
                return of(undefined);
            })
            // eslint-disable-next-line @typescript-eslint/ban-types
        ) as Observable<Object>
    }

    postTagInOrganization(tag: object, organizationId: string): Observable<any> {
        return this.httpClient.post(environment.SERVER_API_URL + '/tags/new/organizations/' + organizationId,
            tag,
            this.authService.getHttpOptions()
        ).pipe(
            map((tag) => {
                this.toastr.success('Tag is succesvol aangemaakt!', 'Tag aangemaakt!');
                return tag;
            }),
            catchError((err: any) => {
                window.scroll(0, 0)
                this.toastr.error(err.error.message, 'Tag niet aangemaakt!');
                return of(undefined);
            })
            // eslint-disable-next-line @typescript-eslint/ban-types
        ) as Observable<Object>
    }

    putTag(tag: Tag, tagId: string): Observable<any> {
        return this.httpClient.put(environment.SERVER_API_URL + '/tags/' + tagId,
            tag,
            this.authService.getHttpOptions()
        ).pipe(
            map((tag) => {
                this.toastr.success('Tag is succesvol aangepast!', 'Tag aangepast!');
                return tag;
            }),
            catchError((err: any) => {
                window.scroll(0, 0)
                this.toastr.error(err.error.message, 'Tag niet aangepast!');
                return of(undefined);
            })
            // eslint-disable-next-line @typescript-eslint/ban-types
        ) as Observable<Object>
    }
}