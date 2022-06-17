import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserFacade } from 'src/app/users/users-facade';
import { BooksFacade } from '../../books.facade';

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
  shearchTerm:string

  searchForm:FormGroup
  
  constructor(private router:Router, private facade:UserFacade, private bookFacade:BooksFacade) { 
    this.isAdmin = localStorage.getItem('role') === 'admin' ? true : false
    this.userName = localStorage.getItem('user')!

    this.searchForm = new FormGroup({
      term: new FormControl()
    })
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

  shearch(){
    console.log("toolbar search: " + this.searchForm.controls['term'].value)
    this.bookFacade.searchBook(this.searchForm.controls['term'].value)
  }
}  
