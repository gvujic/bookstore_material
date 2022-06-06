import { Injectable } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { MatSnackBar } from "@angular/material/snack-bar"
import { BooksFacade } from "./books.facade"
import { DeleteBookComponent } from "./components/delete-book/delete-book.component"
import { EditBookComponent } from "./components/edit-book/edit-book.component"
import { SingleBookComponent } from "./components/single-book/single-book.component"
import { DialogModel } from "./models/dialogModel"

@Injectable()
export class DialogComponentFactory{
    
    constructor(private facade:BooksFacade,  
                private _snackBar: MatSnackBar, 
                private dialog:MatDialog){}

    create(dataOperation:DataOperation, dialogModel:DialogModel): any{

        switch(dataOperation){
            case DataOperation.Add:
                return new DataAdd(dialogModel, this.facade, this._snackBar, this.dialog)
            case DataOperation.Delete:
                return new DataDelete(dialogModel, this.facade, this._snackBar, this.dialog)
            case DataOperation.Update:
                return new DataUpdate(dialogModel, this.facade, this._snackBar, this.dialog)
            default:
                return new DataShow(dialogModel, this.facade, this._snackBar, this.dialog)
        }
    }
}

export class DataManager{
    constructor(protected dialogModel:DialogModel,
                protected facade:BooksFacade, 
                protected _snackBar: MatSnackBar,
                protected dialog:MatDialog){}

    protected ManageData():void{}

    protected openSnackBar(message:string){
        this._snackBar.open(message, 'Confirm', {
          horizontalPosition:'end',
          verticalPosition:'top',
          duration:3000,
        })
      }
}

export class DataAdd extends DataManager{

    public override ManageData(): void {
        let dialogRef = this.dialog.open(EditBookComponent, {
            width:"450px",
            data: this.dialogModel
        })

        dialogRef.afterClosed().subscribe(result => {
            if(!result) return
            this.facade.add(result)
            this.openSnackBar('Saved: ' + result.title)
        })
    }
}

export class DataDelete extends DataManager{

    public override ManageData(): void {
        let dialogRef = this.dialog.open(DeleteBookComponent, {
            width:"450px",
            data: this.dialogModel
        })

        dialogRef.afterClosed().subscribe(result => {
            if(!result) return
            this.facade.remove(result)
            this.openSnackBar('Deleted: ' + result.title)
        })
    }
}

export class DataUpdate extends DataManager{
    public override ManageData(): void {
        let dialogRef = this.dialog.open(EditBookComponent, {
            width:"450px",
            data: this.dialogModel
        })

        dialogRef.afterClosed().subscribe(result => {
            if(!result) return
            this.facade.update(result)
            this.openSnackBar('Updated: ' + result.title)
        })
    }
}

export class DataShow extends DataManager {
    public override ManageData(): void {
        this.dialog.open(SingleBookComponent, {
            width:"650px",
            data: this.dialogModel
        })
    }
}

export enum DataOperation {
    Add, 
    Update, 
    Delete,
    Show
}