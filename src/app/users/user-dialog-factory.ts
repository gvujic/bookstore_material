import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from "../books/models/User";
import { DeleteUserComponent } from "./delete-user/delete-user.component";
import { EditUserComponent } from "./edit-user/edit-user.component";
import { UserFacade } from "./users-facade";

@Injectable()
export class UserDialogFactory{
    constructor(private facade:UserFacade,  
        private _snackBar: MatSnackBar, 
        private dialog:MatDialog){}

    create(operation:UserOperation, user:User){
        switch(operation){
            case UserOperation.Add:
                return new AddUser(this._snackBar, this.dialog, user, this.facade)
            case UserOperation.Update:
                return new UpdateUser(this._snackBar, this.dialog, user, this.facade)
            default:
                return new DeleteUser(this._snackBar, this.dialog, user, this.facade)
        }
    }
}

export class UserManager{

    constructor(protected _snackBar:MatSnackBar, 
                protected dialog:MatDialog, 
                protected user:User, 
                protected facade:UserFacade){}

    protected ManageUser():void{}

    protected openSnackBar(message:string){
        this._snackBar.open(message, 'Confirm', {
          horizontalPosition:'end',
          verticalPosition:'top',
          duration:3000,
        })
    }
}

export class AddUser extends UserManager{
    public override ManageUser(): void {
        let dialogRef = this.dialog.open(EditUserComponent, {
            data: new User(),
            width:'450px'
        })

        dialogRef.afterClosed().subscribe(result => {
            if(!result) return

            this.facade.addUser(result)
            this.openSnackBar('Saved user: ' + result.userName)
        })
    }
}

export class UpdateUser extends UserManager{
    public override ManageUser(): void {
        let dialogRef = this.dialog.open(EditUserComponent, {
            data: this.user
        })

        dialogRef.afterClosed().subscribe(result => {
            if(!result) return

            this.facade.updateUser(result)
            this.openSnackBar('Updated user: ' + result.userName)

        })
    }
}

export class DeleteUser extends UserManager{
    public override ManageUser():void {
        let dialogRef = this.dialog.open(DeleteUserComponent, {
            data: this.user
        })

        dialogRef.afterClosed().subscribe(result => {
            if(!result) return

            this.facade.deleteUser(result)
            this.openSnackBar('Deleted: ' + result.userName)
        })
    }
}

export enum UserOperation{
    Add, 
    Update,
    Delete
}