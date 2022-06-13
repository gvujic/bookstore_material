import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserFacade } from 'src/app/users/users-facade';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  user:any = ''
  isAdmin:boolean = false
  userLogged:boolean = false
  logState:string = ''

  welcomeMsg:string = 'Login and check our books'

  constructor(private router:Router, private facade:UserFacade) {
    this.welcomeMsg = 'Welcome to bookstore ' + localStorage.getItem('user')
    this.isAdmin = localStorage.getItem('role') == 'admin'
  }

  ngOnInit(): void {
    this.facade.authorised$.subscribe(result => {
      if(result){
        this.logState = 'logout'
        this.userLogged = true
      }else{
        this.logState = 'login'
        localStorage.clear()
        this.userLogged = false
        this.isAdmin = false
        this.welcomeMsg = 'Login and check our books'
      }
    })
  }
  
  loadBooks(){
    this.router.navigate(['/books'])
  }

  loadUsers(){
    this.router.navigate(['/users/table'])
  }

  log(){
    if(!this.userLogged){
      this.router.navigate(['home/login'])
    }else{
      this.facade.logout()
    }
  }
}
