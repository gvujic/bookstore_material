import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { User } from "../books/models/User";
import { DeleteUserComponent } from "./delete-user/delete-user.component";
import { EditUserComponent } from "./edit-user/edit-user.component";
import { UserFacade } from "./users-facade";

@Injectable()
export class UserDialogFactory{
    constructor(private facade:UserFacade,  
        private dialog:MatDialog){}

    create(operation:UserOperation, user:User){
        switch(operation){
            case UserOperation.Add:
                return new AddUser(this.dialog, user, this.facade)
            case UserOperation.Update:
                return new UpdateUser(this.dialog, user, this.facade)
            default:
                return new DeleteUser(this.dialog, user, this.facade)
        }
    }
}

export class UserManager{

    constructor(protected dialog:MatDialog, 
                protected user:User, 
                protected facade:UserFacade){}

    protected ManageUser():void{}
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
        })
    }
}

export enum UserOperation{
    Add, 
    Update,
    Delete
}