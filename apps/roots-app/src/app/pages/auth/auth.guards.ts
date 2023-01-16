import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@roots/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class LoggedInAuthGuard implements CanActivate, CanActivateChild {
  //
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map((user: User | undefined) => {
        if (user) {
          return true;
        } else {
          console.log('not logged in, reroute to /');
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate();
  }
}

@Injectable()
export class SaveEditedWorkGuard {
  constructor(private modalService: NgbModal) {}
}
