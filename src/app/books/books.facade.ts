import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, concatMap, distinctUntilChanged, map, Observable, tap } from "rxjs";
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
    comments:Comment[]
}

let _state: BookState = {
    books:[],
    authors:[],
    genres:[],
    comments:[]
}

@Injectable()
export class BooksFacade {
    private store = new BehaviorSubject<BookState>(_state)
    private state$ = this.store.asObservable()

    books$ = this.state$.pipe(map(state => state.books), distinctUntilChanged())
    authors$ = this.state$.pipe(map(state => state.authors), distinctUntilChanged())
    genres$ = this.state$.pipe(map(state => state.genres), distinctUntilChanged())
    comments$ = this.state$.pipe(map(state => state.comments), distinctUntilChanged())

    vm$:Observable<BookState> = combineLatest([this.books$, this.authors$, this.genres$, this.comments$]).pipe(
        map(([books, authors, genres, comments]) => {
            return { books, authors, genres, comments }
        })
    )

    constructor(private service:BooksService){
        this.service.getAllBooks().subscribe((books) => {
            this.updateState({..._state, books})
        })

        this.service.getAllBookGenres().subscribe((genres) => {
            this.updateState({..._state, genres})
        })

        this.service.getAllComments().subscribe((comments) => {
            this.updateState({..._state, comments})
        })
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
        this.service.removeBook(book.id).pipe(
            concatMap(() => this.service.getAllBooks().pipe(
                tap(books => console.log(JSON.stringify(books))),
                map(books => this.updateState({..._state, books}))
            )),
            concatMap(() => this.service.getAllBookGenres().pipe(
                tap(genres => console.log(JSON.stringify(genres))),
                map(genres => this.updateState({..._state, genres}))
            ))
        ).subscribe()
    }

    add(book:Book){
        this.service.insertBook(book).pipe(
            concatMap(() => this.service.getAllBooks().pipe(
                tap(x => console.log("get all books")),
                map(books => this.updateState({..._state, books}))
            )),
            concatMap(() => this.service.getAllBookGenres().pipe(
                tap(x => console.log("get all genres")),
                map(genres => this.updateState({..._state, genres}))
            ))
        ).subscribe()
    }

    update(book:Book){
        this.service.updateBook(book).pipe(
            concatMap(() => this.service.getAllBooks().pipe(
                map(books => this.updateState({..._state, books}))
            )),
            concatMap(() => this.service.getAllBookGenres().pipe(
                map(genres => this.updateState({..._state, genres}))
            ))
        ).subscribe()
    }

    comment(comment:Comment){
        this.service.commentBook(comment).pipe(
            concatMap(() => this.service.getAllBooks().pipe(
                map(books => this.updateState({..._state, books}))
            )),
            concatMap(() => this.service.getAllComments().pipe(
                map(comments => this.updateState({..._state, comments}))
            ))
        ).subscribe()  
    }

    private getBooksByAuthor(author:string, books:Book[]):Book[]{
        return books.filter(b => b.author === author)
    }

    private updateState(state:BookState){
        state.authors = this.getAuthors(state)
        this.store.next((_state = state))
    }
}