import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {

  registerForm:FormGroup
  showPassword:boolean = false
  headline:string = ''
  
  constructor(private dialogRef: MatDialogRef<EditUserComponent>, @Inject(MAT_DIALOG_DATA) data:any) {
    this.headline = data.id ? 'Edit user' : 'Register user'
    this.registerForm = new FormGroup({
      id: new FormControl(data.id ? data.id : 0),
      role: new FormControl(data.role, Validators.required),
      userName: new FormControl(data.userName, Validators.required),
      password: new FormControl(data.password, Validators.required)
    })
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword
  }

  registerUser(){
    this.dialogRef.close(this.registerForm.value)
  }

  dismiss(){
    this.dialogRef.close()
  }
}
