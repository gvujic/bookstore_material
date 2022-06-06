import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from '../../models/book';
import { BookGenre } from '../../models/bookGenre';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.scss']
})
export class SingleBookComponent{
  book:Book
  genres:BookGenre[]

  constructor(@Inject(MAT_DIALOG_DATA) data:any) {
                this.book = data.book
                this.genres = data.genres
  }

  getBookImage(book:Book):string{
    return book.description.includes('+') ? '/assets/' + book?.title+ '.jpg' : '/assets/book.jpeg'
  }
}
