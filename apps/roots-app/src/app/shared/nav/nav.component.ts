import { Component, OnInit } from '@angular/core';
import { User } from '@roots/data';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../../pages/auth/auth.service';

@Component({
  selector: 'roots-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  userAuthenticated!: boolean;
  loggedInUser$!: Observable<User | undefined> 

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loggedInUser$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout();
  }
}
