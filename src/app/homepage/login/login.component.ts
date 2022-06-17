import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/books/models/User';
import { UserDialogFactory, UserOperation } from '../../users/user-dialog-factory';
import { UserFacade } from '../../users/users-facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy{

  loginForm:FormGroup
  showPassword: boolean = false;
  errorMessage:string = ''
  subcriptions:Subscription = new Subscription()

  @Output() closeWindow = new EventEmitter()

  constructor(private facade:UserFacade, private factory:UserDialogFactory) {
    this.loginForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  logIn(){

    this.subcriptions.add(this.facade.errorMessage$.subscribe(error => {
      this.errorMessage = error
    }))

    this.facade.provideAutorisation(this.loginForm.value);
  }

  registerUser(){
    this.factory.create(UserOperation.Add, new User()).ManageUser()
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword
  }

  dismiss(){
    this.closeWindow.emit()
  }

  ngOnDestroy(): void {
    console.log("LoginComponent - ngOnDestroy")
    this.subcriptions.unsubscribe()
  }
}
