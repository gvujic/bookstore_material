import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from '../../models/book';
import { DialogModel } from '../../models/dialogModel';

@Component({
  selector: 'app-delete-book',
  templateUrl: './delete-book.component.html',
})
export class DeleteBookComponent {

  book:Book
  constructor(private dialogRef: MatDialogRef<DeleteBookComponent>,
    @Inject(MAT_DIALOG_DATA) data:DialogModel) {
      this.book = data.book
     }
     deleteBook(){
      this.dialogRef.close(this.book)
     }
     dismiss(){
       this.dialogRef.close(null)
     }
}
