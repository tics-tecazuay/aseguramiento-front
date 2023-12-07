import { Injectable, Inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class RoleguardGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router, private route: ActivatedRoute) { }

canActivate(route: ActivatedRouteSnapshot): boolean {
  const allowedRoles = route.data['allowedRoles'] as string[];
  const user = this.loginService.getUserRole(); // Obtener el usuario logueado
  if (!user) {
    this.router.navigate(['/denegado']); // Si no hay usuario, redirigir al login
    return false;
  }
  if (!allowedRoles.includes(user)) {

    this.router.navigate(['/denegado']); // Si el usuario no tiene el rol permitido, redirigir al login
    return false;
  }

  return true; // Si el usuario tiene el rol permitido, permitir el acceso
}

}
