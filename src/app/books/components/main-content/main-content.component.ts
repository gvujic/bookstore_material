import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Book } from '../../models/book';
import { BookGenre } from '../../models/bookGenre';
import { BooksFacade, BookState } from '../../books.facade';
import { DataOperation, DialogComponentFactory } from '../../dialog-component-factory';
import { BooksThumbsUp } from '../../models/booksThumbsUp';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent implements OnInit {
  subsctiption:Subscription = new Subscription();
  genres:BookGenre[]
  vm$:Observable<BookState> = this.facade.vm$;
  
  constructor(public facade:BooksFacade, private dialogFactory:DialogComponentFactory){}

  ngOnInit(): void {
    this.subsctiption.add(this.facade.genres$.subscribe((genres) => {
      this.genres = genres
    }))
  }

  showBookDialog(book:Book){
    this.dialogFactory.create(DataOperation.Show, {book:book, genres:this.genres}).ManageData()
  }

  getBookImage(book:Book):string{
    return book.description.includes('+') ? '/assets/' + book?.title+ '.jpg' : '/assets/book.jpeg'
  }

  checkComments(book:Book){
    this.showBookDialog(book);
  }

  setThumbsUp(book:Book){
    let userId = 0
    if(localStorage.getItem('userId')){
      userId = +localStorage.getItem('userId')!
    }

    this.facade.thumbsUp(
      { bookId:book.id,
        userId: userId,
        userName:localStorage.getItem('user')!
      })
  }

  checkCurrentUserLiked(book:Book):boolean{
    return book.thumbsUps.filter(x => x.userId === +localStorage.getItem('userId')!).length > 0
  }

  getAllThubmsUps(thumbs:BooksThumbsUp[]){
    return thumbs.map((x) =>  x.userName).join(', ')
  }

  ngOnDestroy(): void {
    this.subsctiption.unsubscribe();
  }
}
