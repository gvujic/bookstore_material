import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable()
export class AdminAuthguardService implements CanActivate{
    constructor(private router:Router){}
    canActivate(){
        const role = localStorage.getItem("role")

        if(role && role != 'admin'){
            this.router.navigate(['books'])
            return false
        } 
        return true
    }
}