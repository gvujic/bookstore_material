import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { User } from 'src/app/books/models/User';
import { UserDialogFactory, UserOperation } from '../user-dialog-factory';
import { UserFacade } from '../users-facade';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit, OnDestroy {
  displayedColumns:string[] = ['userName','role', 'buttons']
  dataSource:MatTableDataSource<User>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  subcription:Subscription = new Subscription()
  isDarkTheme:boolean = false

  constructor(private factory:UserDialogFactory, private facade:UserFacade){}

  ngOnInit(): void {
    this.subcription.add(this.facade.users$.subscribe(users => {
      this.updateDataSource(users)
    }))
  }

  deleteUser(user:User){
    this.factory.create(UserOperation.Delete, user).ManageUser()
  }

  addUser(){
    this.factory.create(UserOperation.Add, new User()).ManageUser()
  }

  updateUser(user:User){
    this.factory.create(UserOperation.Update, user).ManageUser()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateDataSource(users:User[]){
    this.dataSource = new MatTableDataSource<User>(users)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleLowerCase();
      }
    
      return data[sortHeaderId];
    };
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe()
  }
}
