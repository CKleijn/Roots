import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@roots/data';
import { environment } from 'apps/roots-app/src/environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$ = new BehaviorSubject<User | undefined>(undefined);
  private readonly CURRENT_USER = 'currentuser';
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.getUserFromLocalStorage()
      .pipe(
        switchMap((user: User | undefined) => {
          if (user) {
            this.currentUser$.next(user);
            return of(user);
          } else {
            return of(undefined);
          }
        })
      )
      .subscribe();
  }

  login(username: string, password: string): Observable<User | undefined> {
    return this.http
      .post<User>(
        `${environment.SERVER_API_URL}/auth/login`,
        { username: username, password: password },
        { headers: this.headers }
      )
      .pipe(
        map((user) => {
          this.saveUserToLocalStorage(user);
          this.currentUser$.next(user);

          //TODO: ALERT: success / "You have been logged in"

          return user;
        }),
        catchError((err: any) => {
          console.log('error.error.message:', err.error.message);
          //TODO: ALERT: error message / err.error.message || err.message

          return of(undefined);
        })
      );
  }

  register(userData: User): Observable<User | undefined> {
    return this.http
      .post<User>(`${environment.SERVER_API_URL}/auth/register`, userData, {
        headers: this.headers,
      })
      .pipe(
        map((user) => {
          this.saveUserToLocalStorage(user);
          this.currentUser$.next(user);

          //TODO: ALERT: success / "You have been registered"
          return user;
        }),
        catchError((error: any) => {
          console.log('error.error.message:', error.error.message);
          //TODO: ALERT: error message / err.error.message || err.message

          return of(undefined);
        })
      );
  }

  validateToken(userData: User): Observable<User | undefined> {
    const url = `${environment.SERVER_API_URL}/auth/profile`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userData.access_token,
      }),
    };
    return this.http.get<any>(url, httpOptions).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        this.logout();
        this.currentUser$.next(undefined);
        return of(undefined);
      })
    );
  }

  logout(): void {
    this.router.navigate(['/']);
    localStorage.removeItem(this.CURRENT_USER);
    this.currentUser$.next(undefined);

    //TODO: ALERT: "You have been logged out"
  }

  getUserFromLocalStorage(): Observable<User> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const localUser = JSON.parse(localStorage.getItem(this.CURRENT_USER)!);
    return of(localUser);
  }

  private saveUserToLocalStorage(user: User): void {
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
  }

  getHttpOptions(): object {
    let token;
    this.getUserFromLocalStorage()
      .subscribe((user) => {
        if (user) {
          token = user.access_token;
        }
      })
      .unsubscribe();

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };
  }
}