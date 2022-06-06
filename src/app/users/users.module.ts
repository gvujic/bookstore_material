import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { MaterialModule } from '../shared/material.module';
import { RouterModule, Routes } from '@angular/router';
import { UsersToolbarComponent } from './users-toolbar/users-toolbar.component';
import { UsersTableComponent } from './users-table/users-table.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { UserDialogFactory } from './user-dialog-factory';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../homepage/login/login.component';

const routes:Routes = [
  { path:'', component:UsersComponent, 
    children:[
      { path: 'table', component:UsersTableComponent },
      { path: 'login', component:LoginComponent },
      { path: '**', component:UsersTableComponent },
    ] 
  }
]
@NgModule({
  declarations: [
    UsersComponent,
    UsersToolbarComponent,
    UsersTableComponent,
    EditUserComponent,
    DeleteUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers:[UserDialogFactory]
})
export class UsersModule { }
