import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'roots-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})

export class NavComponent {
  userAuthenticated!: boolean
  
  ngOnInit(): void{
    
  }
}
