/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/ban-types */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, catchError, map, of } from "rxjs";
import { Tag } from './tag.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from "../auth/auth.service";
import { environment } from "apps/roots-app/src/environments/environment.prod";
import { OrganizationService } from "../organization/organization.service";

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
        ) as Observable<Object>
    }

    deleteTag(tagId:string,organizationId:string): Observable<any> {
        return this.httpClient.delete(environment.SERVER_API_URL + '/tags/' + tagId +'/organization/' + organizationId,
        this.authService.getHttpOptions()
        ).
        pipe(
            map((tag) => {
                this.toastr.success('Tag is succesvol verwijdert', 'Tag verwijdert!');
                return tag;
            }),
            catchError((err:any) => {
                window.scroll(0,0);
                this.toastr.error(err.error.message, 'Tag niet verwijdert!');
                return of(undefined);
            })
        ) as Observable<Object>
    }
}