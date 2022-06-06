import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../books/models/User";

@Injectable()
export class UserService{
    constructor(private http:HttpClient){}

    getAuthorisation(user:any):Observable<any>{
        return this.http.post<User>(environment.serverAddress + 'users', user)
        // .pipe(catchError(this.handleError<any>('getAuthorisation')))
    }

    getAllUsers():Observable<User[]>{
        return this.http.get<User[]>(environment.serverAddress + 'users')
        .pipe(catchError(this.handleError<any>('getAllUsers')))
    }

    deleteUser(user:User):Observable<User>{
        return this.http.delete<User>(environment.serverAddress + 'users/' + user.id)
        .pipe(catchError(this.handleError<User>('deleteUser')))
    }

    updateUser(user:User):Observable<User>{

        const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
        const body = JSON.stringify(user);
        return this.http.put<User>(environment.serverAddress + "users", body, options)
        .pipe(catchError(this.handleError<User>('updateUser')))
    }

    registerUser(user:User):Observable<User>{
        return this.http.post<User>(environment.serverAddress + 'users/register', user)
        .pipe(catchError(this.handleError<any>('registerUser')))
    }

    private handleError<T>(operation = "operation", result?: T){ // defaultni parametar i opcioni
        return (error:any): Observable<T> => {
          console.error( error);
          return of(result as T);
        }
    }
}