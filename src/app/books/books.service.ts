import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { Book } from "./models/book";
import { BookGenre } from "./models/bookGenre";

@Injectable()
export class BooksService{

    constructor(private http:HttpClient){}

    updateBook(updatedBook:Book):Observable<Book>{
        const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
        const body = JSON.stringify(updatedBook);
        return this.http.put<Book>(environment.serverAddress + "books", body, options)
    }

    insertBook(newBook:Book):Observable<Book>{
        const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
        const body = JSON.stringify(newBook);
        return this.http.post<Book>(environment.serverAddress + "books", body, options)
    }

    getAllBooks():Observable<Book[]>{
        return this.http.get<Book[]>(environment.serverAddress + "books")
        .pipe(catchError(this.handleError<Book[]>('getAllBooks')))
    }

    getAllBookGenres():Observable<BookGenre[]>{
        return this.http.get<BookGenre[]>(environment.serverAddress+ "bookgenres")
        .pipe(catchError(this.handleError<BookGenre[]>('getAllBookGenres')))
    }

    removeBook(id:number){
        return this.http.delete(environment.serverAddress + "books/" + id)
        .pipe(catchError(this.handleError<Book[]>('removeBook')))
    }

    private handleError<T>(operation = "operation", result?: T){ // defaultni parametar i opcioni
        return (error:any): Observable<T> => {
          console.error(error);
          return of(result as T);
        }
    }

}