import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthguardService } from './homepage/login/authguard.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { UserService } from './users/users-service.service';
import { AdminAuthguardService } from './homepage/login/admin-authguard.service';
import { UserDialogFactory } from './users/user-dialog-factory';
import { UserFacade } from './users/users-facade';
import { MaterialModule } from './shared/material.module';


const routes:Routes = [
  { path:'home', 
    loadChildren:() => import('./homepage/home.module').then(m => m.HomeModule)
  },
  {
    path:'books',
    loadChildren:() => import ('./books/books.module').then(m => m.BooksModule),
    canActivate:[AuthguardService]
  },
  { path:'users',     
    loadChildren:() => import ('./users/users.module').then(m => m.UsersModule),
    canActivate:[AuthguardService, AdminAuthguardService]
  },
  { path:'**', redirectTo:'home',  pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MaterialModule,
    HttpClientModule
  ],
  providers:[
    UserService,
    UserFacade,
    AdminAuthguardService,
    AuthguardService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    UserDialogFactory
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
