import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../books/models/User";

@Injectable()
export class UserService{
    constructor(private http:HttpClient){}

    getAuthorisation(user:any):Observable<any>{
        return this.http.post<User>(environment.serverAddress + 'users', user)
    }

    getAllUsers():Observable<User[]>{
        return this.http.get<User[]>(environment.serverAddress + 'users')
    }

    deleteUser(user:User):Observable<User>{
        return this.http.delete<User>(environment.serverAddress + 'users/' + user.id)
    }

    updateUser(user:User):Observable<User>{

        const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
        const body = JSON.stringify(user);
        return this.http.put<User>(environment.serverAddress + "users", body, options)
    }

    registerUser(user:User):Observable<User>{
        return this.http.post<User>(environment.serverAddress + 'users/register', user)
    }
}