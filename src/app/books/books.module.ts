import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { BooksComponent } from './books.component';
import { HttpClientModule } from '@angular/common/http';
import { TableContentComponent } from './components/table-content/table-content.component';
import { DeleteBookComponent } from './components/delete-book/delete-book.component';
import { SingleBookComponent } from './components/single-book/single-book.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { BooksFacade } from './books.facade';
import { DialogComponentFactory } from './dialog-component-factory';
import { RouterModule, Routes } from '@angular/router';
import { GenreNamePipe } from '../shared/genre-name.pipe';
import { BooksService } from './books.service';
import { UserService } from '../users/users-service.service';
import { AuthguardService } from '../homepage/login/authguard.service';

import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AdminAuthguardService } from '../homepage/login/admin-authguard.service';
import { UserFacade } from '../users/users-facade';
import { CommentBookComponent } from './components/comment-book-component/comment-book-component.component';

const routes: Routes = [
  { path:'', component:BooksComponent,
    children: [
      { path:'table', component:TableContentComponent, canActivate:[AuthguardService, AdminAuthguardService]},
      { path:':id', component: MainContentComponent, canActivate:[AuthguardService]},
      { path:'', component: MainContentComponent, canActivate:[AuthguardService]},
    ]
  },
];


@NgModule({
  declarations: [
    ToolbarComponent,
    MainContentComponent,
    SidenavComponent,
    BooksComponent,
    GenreNamePipe,
    TableContentComponent,
    DeleteBookComponent,
    SingleBookComponent,
    EditBookComponent,
    CommentBookComponent
    ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
  ],
  providers:[
    BooksFacade,
    UserFacade,
    DialogComponentFactory, 
    BooksService, 
    UserService, 
    AuthguardService,
    AdminAuthguardService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ]
})
export class BooksModule { }
