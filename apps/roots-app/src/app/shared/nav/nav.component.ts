import { Component, OnInit } from '@angular/core';
import { User } from '@roots/data';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../../pages/auth/auth.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'roots-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  userAuthenticated!: boolean;
  loggedInUser$!: Observable<User | undefined> 

  constructor(private authService: AuthService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loggedInUser$ = this.authService.currentUser$;
  }

  logout() {
    this.modalService.dismissAll()
    this.authService.logout();
  }

  open(content: any) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
	}


}
