import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginService } from '../login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutoridadGuardService implements CanActivate {

  constructor(private loginService:LoginService,private router:Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.loginService.isLoggedIn() && this.loginService.getUserRole() == 'AUTORIDAD'){
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
}
