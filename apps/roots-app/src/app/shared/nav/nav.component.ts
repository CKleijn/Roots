import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'roots-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  userAuthenticated!: boolean;

  constructor(private toastr: ToastrService) {}

  logout() {
    localStorage.clear()
    this.toastr.success('You are succesfully logged out', 'Log out successful');
    this.userAuthenticated = false;
  }

  login(){
    this.toastr.success('You are succesfully logged in', 'Log in successful');
    this.userAuthenticated = true;
  }

  ngOnInit(): void {
    // this.authService.getUserFromLocalStorage().subscribe((user) => {
    //   if (user == undefined) {
    //     this.userAuthenticated = false;
    //   } else {
    //     this.userAuthenticated = true;
    //   }
    // });
  }
}
