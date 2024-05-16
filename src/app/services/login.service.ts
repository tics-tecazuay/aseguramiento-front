import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  rolSelect: any
  public loginStatusSubjec = new Subject<boolean>();

  constructor(private http: HttpClient) { }
  //generamos el token
  public generateToken(loginData: any) {
    return this.http.post(`${baserUrl}/generate-token`, loginData);
  }
  public getCurrentUser() {
    return this.http.get(`${baserUrl}/actual-usuario`);
  }
  //iniciamos sesión y establecemos el token en el localStorage
  public loginUser(token: any) {
    localStorage.setItem('token', token);
    return true;
  }
  public isLoggedIn() {
    let tokenStr = localStorage.getItem('token');
    if (tokenStr == undefined || tokenStr == '' || tokenStr == null) {
      return false;
    } else {
      return true;
    }
  }
  //cerranis sesion y eliminamos el token del localStorage
  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedRole');
    return true;
  }
  //obtenemos el token
  public getToken() {
    return localStorage.getItem('token');
  }
  public setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  public getUser() {
    let userStr = localStorage.getItem('user');
    if (userStr != null) {
      return JSON.parse(userStr);
    } else {
      this.logout();
      return null;
    }
  }
  public getUserRole() {
    if (localStorage.getItem('user') != null) {
      this.rolSelect = localStorage.getItem('selectedRole');
      return this.rolSelect;
    } else {
      this.logout();
      return null;
    }
  }

  public setUserRole(selectedRole: string) {
    if (localStorage.getItem('user') != null) {
      let user = this.getUser();
      const userRoles = user.authorities.map((authority: any) => authority.authority);
      if (userRoles.includes(selectedRole)) {
        localStorage.setItem('selectedRole', selectedRole);
        console.log('Rol seleccionado:', selectedRole);
      } else {
        console.error('El usuario no tiene acceso al rol seleccionado.');
      }
    } else {
      this.logout();
    }
  }
  

  public getUserRoles() {
    if (localStorage.getItem('user') != null) {
        let user = this.getUser();
        const roles = user.authorities.map((authority: any) => authority.authority);
        return roles;
    } else {
        this.logout();
        return [];
    }
}
}
