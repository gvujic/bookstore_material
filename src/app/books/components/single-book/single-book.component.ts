import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataOperation, DialogComponentFactory } from '../../dialog-component-factory';
import { Book } from '../../models/book';
import { BookGenre } from '../../models/bookGenre';
import { BooksComment } from '../../models/booksComment';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.scss']
})
export class SingleBookComponent{
  book:Book
  genres:BookGenre[]
  comments:BooksComment[]


  constructor(@Inject(MAT_DIALOG_DATA) data:any,
              private dialogFactory:DialogComponentFactory,
              private dialogRef: MatDialogRef<SingleBookComponent>,) {
                this.book = data.book
                this.genres = data.genres
                this.comments = data.book.comments
  }

  getBookImage(book:Book):string{
    return book.description.includes('+') ? '/assets/' + book?.title+ '.jpg' : '/assets/book.jpeg'
  }

  postComment(book:Book){
    this.dialogFactory.create(DataOperation.Comment, {book:book, genres:this.genres}).ManageData()
    this.dialogRef.close();
  }
}
