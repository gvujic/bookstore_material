import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  user:any = ''
  isAdmin:boolean = false

  constructor(private router:Router){
      this.user = localStorage.getItem('user')
      this.isAdmin = localStorage.getItem('role') == 'admin'

  }

  loadBooks(){
    this.router.navigate(['/books'])
  }

  loadUsers(){
    this.router.navigate(['/users/table'])
  }

  // logout(){
  //   localStorage.clear()
  //   this.router.navigate(['/login'])
  // }
}
