import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../pages/auth/auth.service';

@Component({
  selector: 'roots-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  userAuthenticated!: boolean;

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout()
  }

  ngOnInit(): void {
    this.authService.getUserFromLocalStorage().subscribe((user) => {
      if (user == undefined) {
        this.userAuthenticated = false;
      } else {
        this.userAuthenticated = true;
      }
    });
  }
}
