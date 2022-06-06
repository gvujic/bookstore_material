import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserFacade } from 'src/app/users/users-facade';

@Component({
  selector: 'app-home-page-toolbar',
  templateUrl: './home-page-toolbar.component.html',
  styleUrls: ['./home-page-toolbar.component.scss']
})
export class HomePageToolbarComponent {
  userLogged:boolean = false
  logState:string = ''
  constructor(private router:Router, private facade:UserFacade) { 
    this.facade.authorised$.subscribe(result => {
      console.log("HomePageToolbarComponent result: " + result)
      if(result){
        this.logState = 'logout'
        this.userLogged = true
        this.router.navigate(['home/login'])
      }else{
        this.logState = 'login'
        localStorage.clear()
        this.userLogged = false
        this.router.navigate(['home/login'])
      }
    })
  }

  log(){
    if(!this.userLogged){
      this.router.navigate(['home/login'])
    }else{
      this.facade.logout()
    }
  }

  navigateWelcome(){
    this.router.navigate(['home/welcome'])
  }
}
