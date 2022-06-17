import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserFacade } from 'src/app/users/users-facade';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() sidenavToggle = new EventEmitter()
  @Output() toggleTheme = new EventEmitter()
  isTableView:boolean = false
  isAdmin:boolean = true
  userName:string
  
  constructor(private router:Router, private facade:UserFacade) { 
    this.isAdmin = localStorage.getItem('role') === 'admin' ? true : false
    this.userName = localStorage.getItem('user')!
  }

  changeView(){
    if(this.isTableView){
      this.isTableView = false
      this.router.navigate(['/books'])
    }else{
      this.isTableView = true
      this.router.navigate(['books/table'])
    }
  }

  logOut(){
    this.facade.logout()
  }

  showUsers(){
    this.router.navigate(['users/table'])
  }
}  
