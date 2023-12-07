import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private httpClient: HttpClient) { }

  public añadirUsuario(user: any, idRol: any) {
    return this.httpClient.post(`${baserUrl}/usuarios/crear/${idRol}`, user);
  }

}
