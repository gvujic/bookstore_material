import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { HomepageComponent } from './homepage.component';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthguardService } from './login/authguard.service';
import { AdminAuthguardService } from './login/admin-authguard.service';

const routes: Routes = [
  { 
    path:'', component:HomepageComponent,
    children:[
      { path:'welcome', component:WelcomePageComponent },
      { path:'login', component:LoginComponent },
      { path:'**', component:WelcomePageComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ], 

  declarations: [
    HomepageComponent,
    WelcomePageComponent,
    LoginComponent
  ],
})
export class HomeModule { }