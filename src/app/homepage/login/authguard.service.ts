import { Injectable } from "@angular/core";
import {  CanActivate, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthguardService implements CanActivate{
    
    constructor(private router:Router, private jwtHelper : JwtHelperService){}
    
    canActivate(){
        const token = localStorage.getItem("jwt")

        if(token && !this.jwtHelper.isTokenExpired(token)){
            return true
        }

        localStorage.clear()
        this.router.navigate(['home/login'])
        return false
    }
}