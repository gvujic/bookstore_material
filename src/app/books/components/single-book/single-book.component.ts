import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from '../../models/book';
import { BookGenre } from '../../models/bookGenre';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.scss']
})
export class SingleBookComponent{
  book:Book
  genres:BookGenre[]
  comments:Comment[]


  constructor(@Inject(MAT_DIALOG_DATA) data:any) {
                this.book = data.book
                this.genres = data.genres
                this.comments = data.book.comments
  }

  getBookImage(book:Book):string{
    return book.description.includes('+') ? '/assets/' + book?.title+ '.jpg' : '/assets/book.jpeg'
  }

  log(data:any){
    console.table(data)
  }
}
