import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Persona2 } from './../models/Persona2';
import { Persona } from '../models/Persona';
import { Persona3 } from './../models/Persona3';

import baserUrl from './helper';
@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  personaObj: Persona[] = [];
  constructor(private http: HttpClient) { }

  public getUsua(idUsua: number): Observable<Persona2[]> {
    return this.http.get<Persona2[]>(`${baserUrl}/api/persona/buscarpersonaId/${idUsua}`);
  }
  //Metodo para listar
  getPersonas(): Observable<Persona2[]> {
    return this.http
      .get(`${baserUrl}/api/persona/listar`)
      .pipe(map((response) => response as Persona2[]));
  }
  //metodo para crear una persona
  createPersona(persona: Persona2): Observable<any> {
    return this.http.post(`${baserUrl}/api/persona/crear`, persona).pipe(
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }
  listarcorreos():Observable<Persona3[]>{
    return this.http.get<Persona3[]>(`${baserUrl}/api/persona/listarcoorreos`);
  }
  findByCedula(cedula: string): Observable<Persona2> {
    const url = `${baserUrl}/api/persona/findByCedula/${cedula}`;
    return this.http.get<Persona2>(url);
  }
  existencia(id: any): Observable<any> {
    return this.http.get(`${baserUrl}/usuarios/listausuariosprueba/${id}`);
  }
  // Método para actualizar el campo persona_id_persona en la entidad de usuario
  actualizarPersonaIdEnUsuario(usuarioId: number, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/usuarios/actualizarPersonaIdEnUsuario/${usuarioId}`, crite);
  }

  actualizar(id: any, crite: any): Observable<any> {
    return this.http.put(`${baserUrl}/api/persona/actualizar/${id}`, crite);
  }

}
