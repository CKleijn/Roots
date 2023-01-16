import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@roots/data';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
    private toastr: ToastrService
  ) {
    // Get current user out of the local storage
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

  // Login user and store in local storage
  login(username: string, password: string): Observable<User | undefined> {
    return this.http
      .post<User>(
        `${environment.SERVER_API_URL}/auth/login`,
        { username: username, password: password },
        { headers: this.headers }
      )
      .pipe(
        map((user) => {
          if (user.isVerified) {
            this.saveUserToLocalStorage(user);
            this.currentUser$.next(user);

            this.toastr.success(
              'Je bent succesvol ingelogd!',
              'Inloggen succesvol!'
            );
          }

          return user;
        }),
        catchError((err: any) => {
          this.toastr.error(err.error.message, 'Inloggen gefaald!');

          return of(undefined);
        })
      );
  }

  // Register new user
  register(userData: User): Observable<User | undefined> {
    return this.http
      .post<User>(`${environment.SERVER_API_URL}/auth/register`, userData, {
        headers: this.headers,
      })
      .pipe(
        map((user) => {
          this.toastr.success(
            'Controleer je mailbox voor de verificatiecode!',
            'Registratie succesvol!'
          );
          return user;
        }),
        catchError((err: any) => {
          this.toastr.error(err.error.message, 'Registratie gefaald!');
          return of(undefined);
        })
      );
  }

  // Validate JWT token
  validateToken(userData: User): Observable<User | undefined> {
    const url = `${environment.SERVER_API_URL}/auth/profile`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userData?.access_token,
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

  // Log user out / delete from local storage
  logout(): void {
    this.router.navigate(['/']);
    localStorage.clear();
    this.currentUser$.next(undefined);

    this.toastr.success('Je bent succesvol uitgelogd!', 'Uitloggen succesvol!');
  }

  // Get user from local storage
  getUserFromLocalStorage(): Observable<User> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const localUser = JSON.parse(localStorage.getItem(this.CURRENT_USER)!);

    return of(localUser);
  }

  // Save user in the local storage
  saveUserToLocalStorage(user: User): void {
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
  }

  // Verify new account (user)
  verifyAccount(userData: any) {
    return this.http
      .post<User>(`${environment.SERVER_API_URL}/auth/verify`, userData, {
        headers: this.headers,
      })
      .pipe(
        map((user) => {
          this.saveUserToLocalStorage(user);
          this.currentUser$.next(user);
          this.toastr.success(
            'Je hebt je account succesvol geverifieerd!',
            'Verificatie succesvol!'
          );
          return user;
        }),
        catchError((err: any) => {
          this.toastr.error(err.error.message, 'Verificatie gefaald!');
          return of(undefined);
        })
      );
  }

  // Send new verification mail
  resendVerificationMail(emailAddress: string) {
    return this.http
      .post<User>(
        `${environment.SERVER_API_URL}/auth/resend`,
        { emailAddress },
        {
          headers: this.headers,
        }
      )
      .pipe(
        map(() => {
          this.toastr.success(
            'Bekijk je mailbox voor de nieuwe verificatiecode!',
            'Verificatiecode opnieuw gestuurd!'
          );
        }),
        catchError((err: any) => {
          this.toastr.error(
            err.error.message,
            'Verificatiemail versturen gefaald!'
          );
          return of(undefined);
        })
      );
  }

  // Reset password
  resetPassword(tokenId: string, password: string) {
    return this.http
      .post<User>(
        `${environment.SERVER_API_URL}/auth/reset_password`,
        { tokenId, password },
        {
          headers: this.headers,
        }
      )
      .pipe(
        map(() => {
          this.toastr.success(
            'Je hebt je wachtwoord succesvol opnieuw ingesteld!',
            'Wachtwoord instellen succesvol!'
          );
        }),
        catchError((err: any) => {
          this.toastr.error(err.error.message, 'Wachtwoord instellen gefaald!');
          return of(undefined);
        })
      );
  }

  // Send forgot password mail
  sendForgotPasswordMail(emailAddress: string) {
    return this.http
      .post<User>(
        `${environment.SERVER_API_URL}/auth/forgot_password`,
        { emailAddress },
        {
          headers: this.headers,
        }
      )
      .pipe(
        map((result) => {
          this.toastr.success(
            'Bekijk je mailbox voor het opnieuw instellen van je wachtwoord!',
            'Wachtwoord vergeten mail gestuurd!'
          );
          return result;
        }),
        catchError((err: any) => {
          this.toastr.error(
            err.error.message,
            'Wachtwoord vergeten mail versturen gefaald!'
          );
          return of(undefined);
        })
      );
  }

  // Get the HTTP options for a request
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
