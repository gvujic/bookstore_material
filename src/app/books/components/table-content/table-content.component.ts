import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BooksFacade } from '../../books.facade';
import { DataOperation, DialogComponentFactory } from '../../dialog-component-factory';
import { Book } from '../../models/book';
import { BookGenre } from '../../models/bookGenre';
import { DialogModel } from '../../models/dialogModel';

@Component({
  selector: 'app-table-content',
  templateUrl: './table-content.component.html',
  styleUrls: ['./table-content.component.scss']
})
export class TableContentComponent implements OnDestroy, AfterViewInit{
  displayedColumns:string[] = ['image','author','title', 'bookGenreId', 'pagesNumber','price','description' ,'buttons']
  dataSource:MatTableDataSource<Book>
  genres:BookGenre[]
  subcription:Subscription = new Subscription()

  isDarkTheme:boolean = false

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public facade:BooksFacade, private dialogFactory:DialogComponentFactory) {}

  ngAfterViewInit(): void {
    this.subcription.add(this.facade.books$.subscribe((books) => {
      this.dataSource = new MatTableDataSource<Book>(books)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
        if (typeof data[sortHeaderId] === 'string') {
          return data[sortHeaderId].toLocaleLowerCase();
        }
      
        return data[sortHeaderId];
      };
    }))

    this.subcription.add(this.facade.genres$.subscribe((genres) => {
      this.genres = genres
    }))
  }

  openRemoveBookDialog(deleteBook:Book){
    let dialogModel:DialogModel =  { book:deleteBook, genres:[]}
    this.dialogFactory.create(DataOperation.Delete, dialogModel).ManageData()
  }
  
  openEditBookDialog(editBook:Book){
    let dialogModel:DialogModel =  { book:editBook, genres:this.genres }
    this.dialogFactory.create(DataOperation.Update, dialogModel).ManageData()
  }

  openAddBookDialog(){
    let dialogModel:DialogModel =  { book:new Book(), genres:this.genres }
    this.dialogFactory.create(DataOperation.Add, dialogModel).ManageData()
  }

  showBookDetails(book:Book){
    this.dialogFactory.create(DataOperation.Show, {book: book, genres: this.genres}).ManageData()
  }

  getBookImage(book:Book):string{
    return book.description.includes('+') ? '/assets/' + book?.title+ '.jpg' : '/assets/book.jpeg'
  }

  applyFilter(event: Event) { //tested
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe()
  }
}