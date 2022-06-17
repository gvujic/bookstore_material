import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserFacade } from 'src/app/users/users-facade';

const SMALL_WIDTH_BREAKPOINT = 720

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit, OnDestroy {
  user:any = ''
  isAdmin:boolean = false
  userLogged:boolean = false
  logState:string = ''

  userName:string
  @ViewChild(MatSidenav) sidenav:MatSidenav
  showLoginForm:boolean = false
  isScreenSmall:boolean = true
  subscription:Subscription = new Subscription()

  constructor(private router:Router, private facade:UserFacade, private breakpointObserver: BreakpointObserver) {
    this.getScreenSize();
  }
  scrHeight:any;
  scrWidth:any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.scrHeight = window.innerHeight;
        this.scrWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.subscription.add(this.facade.authorised$.subscribe(isAuthorised => {
      if(isAuthorised){
        this.logState = 'logout'
        this.userLogged = true
        this.showLoginForm = false
        this.userName = localStorage.getItem('user')!
        this.isAdmin = localStorage.getItem('role') == 'admin'
      }else{
        this.logState = 'login'
        localStorage.clear()
        this.userLogged = false
        this.isAdmin = false
      }
    }))

    this.subscription.add(this.breakpointObserver
      .observe([`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`])
      .subscribe((state:BreakpointState) => {
        this.isScreenSmall = state.matches
      }))
  }
  
  loadBooks(){
    if(this.userLogged){
      this.router.navigate(['/books'])
    }else{
      this.showLoginForm = true
    }
  }

  loadUsers(){
    this.router.navigate(['/users/table'])
  }

  log(){
    if(!this.userLogged){
      this.showLoginForm = true
    }else{
      this.facade.logout()
    }
  }

  mouseEnterSidenav(){
    if(!this.isScreenSmall)
    this.sidenav.open()
  }

  mouseLeaveSidenav(){
    if(!this.isScreenSmall)
    this.sidenav.close()
  }

  hideLoginForm(){
    this.showLoginForm = false
  }

  ngOnDestroy(): void {
   this.subscription.unsubscribe()
  }
}
