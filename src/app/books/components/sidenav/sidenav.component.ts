import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Book } from '../../models/book';
import { BookGenre } from '../../models/bookGenre';
import { BooksFacade, BookState } from '../../books.facade';
import { DataOperation, DialogComponentFactory } from '../../dialog-component-factory';

const SMALL_WIDTH_BREAKPOINT = 720

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class SidenavComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenav:MatSidenav
  isScreenSmall:boolean = true
  genres:BookGenre[]
  isDarkTheme:boolean = false;
  subscription:Subscription = new Subscription()

  vm$:Observable<BookState> = this.facade.vm$

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router,
              public facade:BooksFacade,
              private dialogFactory:DialogComponentFactory
              ) {}
   
  ngOnInit(): void {
    this.subscription.add(this.facade.genres$.subscribe((genres) => {
      this.genres = genres
    }))

    this.subscription.add(this.breakpointObserver
    .observe([`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`])
    .subscribe((state:BreakpointState) => {
      this.isScreenSmall = state.matches
    }))

    this.subscription.add(this.router.events.subscribe(() => {
      if(this.isScreenSmall){
        this.sidenav.close()
      }
    }))
  }

  showBookDetails(book:Book){
    this.dialogFactory.create(DataOperation.Show, {book: book, genres: this.genres}).ManageData()
  }

  toggleTheme(){
    this.isDarkTheme = !this.isDarkTheme
  }

  ngOnDestroy(): void { 
    this.subscription.unsubscribe()
  }
}
