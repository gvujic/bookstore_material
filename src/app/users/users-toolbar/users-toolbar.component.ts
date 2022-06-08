import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserFacade } from '../users-facade';

@Component({
  selector: 'app-users-toolbar',
  templateUrl: './users-toolbar.component.html',
  styleUrls: ['./users-toolbar.component.scss']
})
export class UsersToolbarComponent {
  constructor(private router:Router, private facade:UserFacade) {} 

  navigateHome(){
    this.router.navigate(['home/'])
  }

  navigateBooks(){
    this.router.navigate(['books/table'])
  }

  logOut(){
    this.facade.logout()
  }
}
