import { Injectable, OnDestroy } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { BehaviorSubject, concatMap, distinctUntilChanged, map, Subscription } from "rxjs";
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
export class UserFacade implements OnDestroy{
    private store = new BehaviorSubject<UsersState>(_state)
    private state$ = this.store.asObservable()

    private errorOccurredSubject = new BehaviorSubject<string>('')
    errorMessage$ = this.errorOccurredSubject.asObservable()

    users$ = this.state$.pipe(map( state => state.users), distinctUntilChanged())
    authorised$ = this.state$.pipe(map(state => state.authorised), distinctUntilChanged())

    subscripitons:Subscription = new Subscription()

    constructor(private userService: UserService, 
                private router:Router,
                private _snackBar:MatSnackBar){
        this.subscripitons.add(this.userService.getAllUsers().subscribe(
            {
                next: users => {
                    this.updateState({..._state, users})
                    this.errorOccurredSubject.next("")
                },
                error: (e) => { this.errorOccurredSubject.next("Failed to fetch all users: "  + e.message) },
            }
        ))
    }

    addUser(user:User){
        this.subscripitons.add(this.userService.registerUser(user).pipe(
            concatMap(() => this.userService.getAllUsers().pipe(
                map(users => this.updateState({..._state, users}))
            ))
        ).subscribe(
            {
                next: () => {
                    this._snackBar.open("Saved user: " + user.userName, 'Confirm', {
                        horizontalPosition:'end',
                        verticalPosition:'top',
                        duration:3000,
                    }) 

                    this.errorOccurredSubject.next("")
                },
                error: (e) => { this.errorOccurredSubject.next("Failed to add user: " + e.message) },
            }
        ))
    }

    deleteUser(user:User){
        this.userService.deleteUser(user).pipe(
            concatMap(() => this.userService.getAllUsers().pipe(
                map(users => this.updateState({..._state, users}))
            ))
        ).subscribe({
            next: () => {
                this._snackBar.open("Deleted user: " + user.userName, 'Confirm', {
                    horizontalPosition:'end',
                    verticalPosition:'top',
                    duration:3000,
                })

                this.errorOccurredSubject.next("")
            },
            error: (e) => { this.errorOccurredSubject.next("Failed to delete user: " + e.message) }
        })
    }

    updateUser(user:User){
        this.userService.updateUser(user).pipe(
            concatMap(() => this.userService.getAllUsers().pipe(
                map(users => this.updateState({..._state, users}))
            ))
        ).subscribe({
            next:() => {
                this._snackBar.open("Updated user: " + user.userName, 'Confirm', {
                    horizontalPosition:'end',
                    verticalPosition:'top',
                    duration:3000,
                })
                this.errorOccurredSubject.next("")
            },
            error: (e) => { this.errorOccurredSubject.next("Failed to update user: " + e.message) }
        })            
    }

    provideAutorisation(user:User){{}
        this.subscripitons.add(this.userService.getAuthorisation(user).subscribe(
            {
                next: result => {
                    if(!result) return
                    localStorage.setItem('jwt', result.token)
                    localStorage.setItem('user', result.user)
                    localStorage.setItem('role', result.role)
                    localStorage.setItem('userId', result.id)
        
                    let authorised = true
                    this.updateState({..._state, authorised })
                    this.router.navigate(['home/welcome'])
        
                    this.errorOccurredSubject.next('')
                },
                error: err => {
                    this.errorOccurredSubject.next("Failed to provide authorisation: " + err.message)
                }
            }
        ))
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

    ngOnDestroy(): void {
        console.log("UserFacade - ngOnDestroy")
        this.subscripitons.unsubscribe()
    }
}