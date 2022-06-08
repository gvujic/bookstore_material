import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, concatMap, distinctUntilChanged, map } from "rxjs";
import { User } from "../books/models/User";
import { UserService } from "./users-service.service";

export interface UsersState{
    users:User[]
    authorised:boolean
}

let _state:UsersState = {
    users:[],
    authorised:false
}

@Injectable()
export class UserFacade{
    private store = new BehaviorSubject<UsersState>(_state)
    private state$ = this.store.asObservable()

    private errorOccurredSubject = new BehaviorSubject<string>('')
    errorMessage$ = this.errorOccurredSubject.asObservable()

    users$ = this.state$.pipe(map( state => state.users), distinctUntilChanged())
    authorised$ = this.state$.pipe(map(state => state.authorised), distinctUntilChanged())

    constructor(private userService: UserService, private router:Router){
        this.userService.getAllUsers().subscribe(users => {
            this.updateState({..._state, users})
        })
    }

    addUser(user:User){
        this.userService.registerUser(user).pipe(
            concatMap(() => this.userService.getAllUsers().pipe(
                map(users => this.updateState({..._state, users}))
            ))
        ).subscribe()
    }

    deleteUser(user:User){
        this.userService.deleteUser(user).pipe(
            concatMap(() => this.userService.getAllUsers().pipe(
                map(users => this.updateState({..._state, users}))
            ))
        ).subscribe()
    }

    updateUser(user:User){
        this.userService.updateUser(user).pipe(
            concatMap(() => this.userService.getAllUsers().pipe(
                map(users => this.updateState({..._state, users}))
            ))
        ).subscribe()            
    }

    provideAutorisation(user:User){
        this.userService.getAuthorisation(user).subscribe(result => {
            if(!result) return

            localStorage.setItem('jwt', result.token)
            localStorage.setItem('user', result.user)
            localStorage.setItem('role', result.role)

            let authorised = true
            this.updateState({..._state, authorised })
            this.router.navigate(['home/welcome'])

            this.errorOccurredSubject.next('')
        }, 
        err => {
          this.errorOccurredSubject.next(err.message)
        })
    }

    logout(){
        localStorage.clear()        
        let authorised = false
        this.updateState({..._state, authorised })
        this.router.navigate(['home/welcome'])
    }

    private updateState(state:UsersState){
        this.store.next((_state = state))
    }
}