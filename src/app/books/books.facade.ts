import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable } from "rxjs";
import { BooksService } from "./books.service";
import { Book } from "./models/book";
import { BookGenre } from "./models/bookGenre";

export interface Author{
    name:string
    authorBooks:Book[]
}

export interface BookState {
    books:Book[]
    authors:Author[]
    genres:BookGenre[]
}

let _state: BookState = {
    books:[],
    authors:[],
    genres:[]

}

@Injectable()
export class BooksFacade {

    private store = new BehaviorSubject<BookState>(_state)
    private state$ = this.store.asObservable()

    books$ = this.state$.pipe(map(state => state.books), distinctUntilChanged())
    authors$ = this.state$.pipe(map(state => state.authors), distinctUntilChanged())
    genres$ = this.state$.pipe(map(state => state.genres), distinctUntilChanged())

    vm$:Observable<BookState> = combineLatest([this.books$, this.authors$, this.genres$]).pipe(
        map(([books, authors, genres]) => {
            return { books, authors, genres }
        })
    )

    constructor(private service:BooksService){
        
        this.service.getAllBooks().subscribe((books) => {
            this.updateState({..._state, books})
        })

        this.service.getAllBookGenres().subscribe((genres) => {
            this.updateState({..._state, genres})
        })
    }

    private updateState(state:BookState){
        state.authors = this.getAuthors(state)
        this.store.next((_state = state))
    }

    getAuthors(state:BookState){ // tested
        let myArray:Author[] = []

        for (let i = 0; i < state.books.length; i++) {

            let nameTemp:string = state.books[i].author
            let booksTemp:Book[] = this.getBooksByAuthor(nameTemp, state.books)

            if(myArray.findIndex(x => x.name === nameTemp) > -1 ) continue;
            
            myArray.push({name:nameTemp, authorBooks:booksTemp})
        }

        return myArray
    }

    getGenresSnapshot(): BookState{
        return {..._state, genres: {..._state.genres } }
    }

    remove(book:Book){
        this.service.removeBook(book.id).subscribe(() => {
            this.service.getAllBooks().subscribe((books) => {
                this.updateState({..._state, books})
                this.service.getAllBookGenres().subscribe((genres) => {
                    this.updateState({..._state, genres})
                })
            })
        })
    }

    add(book:Book){
        this.service.insertBook(book).subscribe(() => {
            this.service.getAllBooks().subscribe((books) => {
                this.updateState({..._state, books})
                this.service.getAllBookGenres().subscribe((genres) => {
                    this.updateState({..._state, genres})
                })
            })
        })
    }

    update(book:Book){
        this.service.updateBook(book).subscribe(() => {
            this.service.getAllBooks().subscribe((books) => {
                this.updateState({..._state, books})
                this.service.getAllBookGenres().subscribe((genres) => {
                    this.updateState({..._state, genres})
                })
            })
        })
    }

    private getBooksByAuthor(author:string, books:Book[]):Book[]{ //tested
        return books.filter(b => b.author === author)
    }
}