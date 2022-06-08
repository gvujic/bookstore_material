import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/books/models/User';
import { UserDialogFactory, UserOperation } from '../../users/user-dialog-factory';
import { UserFacade } from '../../users/users-facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginForm:FormGroup
  showPassword: boolean = false;
  errorMessage:string = ''
  constructor(private facade:UserFacade, private factory:UserDialogFactory) {
    this.loginForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }
  
  ngOnInit(): void {
    this.facade.errorMessage$.subscribe(error => {
      this.errorMessage = error
    })
  }

  logIn(){
    this.facade.provideAutorisation(this.loginForm.value);
  }

  registerUser(){
    this.factory.create(UserOperation.Add, new User()).ManageUser()
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword
  }
}
