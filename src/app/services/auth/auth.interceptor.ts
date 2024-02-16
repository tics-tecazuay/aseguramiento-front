import { tap } from 'rxjs/operators';
import { LoginService } from '../login.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService, private router: Router) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let authReq = req;
    const token = this.loginService.getToken();
    if (token != null) {
      const tokenPayload: any = jwt_decode(token);
      const expirationDate = new Date(tokenPayload.exp * 1000); // Multiplica por 1000 para convertir segundos a milisegundos

      if (expirationDate <= new Date()) {
        // Token ha expirado, realizar acciones de cierre de sesión y redireccionamiento
        Swal.fire({
          title: 'La sesión ha expirado!',
          text: "Regresara al login...",
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loginService.logout();
            location.replace('/use/login');
          }
        })

      }

      authReq = authReq.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(authReq).pipe(
      tap(
        event => { },
        error => {
          // token expirado, redirigir a la página de inicio de sesión

          if (error.status === 401 && error.error.error === "Unauthorized") {
            // el token ha expirado, cerrar sesión y redirigir a la página de inicio de sesión
            this.loginService.logout();
            location.replace('/use/login');
          }
        }
      )
    );
  }

}

export const authInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
]
