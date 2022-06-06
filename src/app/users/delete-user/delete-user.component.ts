import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/books/models/User';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent {

  user:User
  constructor(private dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) data:any) { 
      this.user = data
    }

  deleteUser(){
    this.dialogRef.close(this.user)
  }

  dismiss(){
    this.dialogRef.close()
  }

}
