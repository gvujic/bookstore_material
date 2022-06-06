import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from '../../models/book';
import { BookGenre } from '../../models/bookGenre';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss']
})
export class EditBookComponent{
  book:Book
  genres:BookGenre[]
  editBookForm:FormGroup
  constructor(private dialogRef: MatDialogRef<EditBookComponent>,
    @Inject(MAT_DIALOG_DATA) data:any) {
      this.book = data.book,
      this.genres = data.genres

      this.editBookForm = new FormGroup({
        title:  new FormControl(this.book.title, Validators.required),
        author:  new FormControl(this.book.author, Validators.required),
        price:  new FormControl(this.book.price, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
        pagesNumber :  new FormControl(this.book.pagesNumber,  [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
        bookGenreId:  new FormControl(this.book.bookGenreId, Validators.required),
        description:  new FormControl(this.book.description, Validators.required),
        id: new FormControl(this.book.id? this.book.id : 0)
      })
     }

  saveBook(){
    this.dialogRef.close(this.editBookForm.value);
  }
  
  dismiss(){
    this.dialogRef.close(null)
  }
}
