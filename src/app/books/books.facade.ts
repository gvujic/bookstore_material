import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, combineLatest, concatMap, distinctUntilChanged, map, tap, Observable, Subscription } from "rxjs";
import { BooksService } from "./books.service";
import { Book } from "./models/book";
import { BookGenre } from "./models/bookGenre";
import { BooksComment } from "./models/booksComment";
import { BooksThumbsUp } from "./models/booksThumbsUp";

export interface Author{
    name:string
    authorBooks:Book[]
}

export interface BookState {
    books:Book[],
    filteredBooks:Book[],
    authors:Author[]
    genres:BookGenre[]
}

let _state: BookState = {
    books:[],
    filteredBooks:[],
    authors:[],
    genres:[]
}

@Injectable()
export class BooksFacade implements OnDestroy {
    private store = new BehaviorSubject<BookState>(_state)
    private state$ = this.store.asObservable()

    subsctiption:Subscription = new Subscription();

    books$ = this.state$.pipe(map(state => state.books), distinctUntilChanged())
    authors$ = this.state$.pipe(map(state => state.authors), distinctUntilChanged())
    genres$ = this.state$.pipe(map(state => state.genres), distinctUntilChanged())
    filteredBooks$ = this.state$.pipe(map(state => state.filteredBooks), distinctUntilChanged())

    vm$:Observable<BookState> = combineLatest([this.books$, this.authors$, this.genres$, this.filteredBooks$]).pipe(
        map(([books, authors, genres, filteredBooks]) => {
            return { books, authors, genres,filteredBooks }
        })
    )

    constructor(private service:BooksService){
        this.subsctiption.add(this.service.getAllBooks().subscribe((books) => {
            this.updateState({..._state, books})
            let filteredBooks = books
            this.updateState({..._state, filteredBooks})
        }))

        this.subsctiption.add(this.service.getAllBookGenres().subscribe((genres) => {
            this.updateState({..._state, genres})
        }))
    }

    getAuthors(state:BookState){
        let myArray:Author[] = []
        for (let i = 0; i < state.books.length; i++) {

            let nameTemp:string = state.books[i].author
            let booksTemp:Book[] = this.getBooksByAuthor(nameTemp, state.books)

            if(myArray.findIndex(x => x.name === nameTemp) > -1 ) continue;
            
            myArray.push({name:nameTemp, authorBooks:booksTemp})
        }

        return myArray
    }

    remove(book:Book){
        this.subsctiption.add(this.service.removeBook(book.id).pipe(
            concatMap(() => this.service.getAllBooks().pipe(
                map(books => this.updateState({..._state, books}))
            )),
            concatMap(() => this.service.getAllBookGenres().pipe(
                map(genres => this.updateState({..._state, genres}))
            ))
        ).subscribe())
    }

    add(book:Book){
        this.subsctiption.add(this.service.insertBook(book).pipe(
            concatMap(() => this.service.getAllBooks().pipe(
                map(books => this.updateState({..._state, books}))
            )),
            concatMap(() => this.service.getAllBookGenres().pipe(
                map(genres => this.updateState({..._state, genres}))
            ))
        ).subscribe())
    }

    update(book:Book){
        this.subsctiption.add(this.service.updateBook(book).pipe(
            concatMap(() => this.service.getAllBooks().pipe(
                map(books => this.updateState({..._state, books}))
            )),
            concatMap(() => this.service.getAllBookGenres().pipe(
                map(genres => this.updateState({..._state, genres}))
            ))
        ).subscribe())
    }

    comment(comment:BooksComment){
        this.subsctiption.add(this.service.commentBook(comment).pipe(
            concatMap(() => this.service.getAllBooks().pipe(
                map(books => this.updateState({..._state, books}))
            ))
        ).subscribe())
    }

    thumbsUp(thumbsUp:BooksThumbsUp){
        this.subsctiption.add(this.service.setThumbsUp(thumbsUp).pipe(
            concatMap(() => this.service.getAllBooks().pipe(
                map(books => this.updateState({..._state, books}))
            ))
        ).subscribe())
    }

    searchBook(term:string){        
        this.subsctiption.add(this.books$.pipe(
            map(books => {
                const filteredBooks = books.filter(book => 
                    book.author.toLocaleLowerCase().includes(term.toLocaleLowerCase()) || 
                    book.title.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
                    this.updateState({..._state, filteredBooks})
                }
            )
        ).subscribe())
    }

    private getBooksByAuthor(author:string, books:Book[]):Book[]{
        return books.filter(b => b.author === author)
    }

    private updateState(state:BookState){
        console.log(state)
        state.authors = this.getAuthors(state)
        this.store.next((_state = state))
    }

    ngOnDestroy(): void {
        this.subsctiption.unsubscribe()
    }
}