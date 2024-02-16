//servicio para obtener los datos de la api de fenix

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError } from "rxjs";
import baserUrl from './helper';

@Injectable
    ({
        providedIn: 'root'
    })
export class FenixService {
    constructor(private http: HttpClient) { }
    //metodo para obtener los datos de la api de fenix
    public getFenixData(): Observable<any> {
        return this.http.get(`${baserUrl}/api/fenix/listar`).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
    //metodo para obtener docentes por cedula
    public getDocenteByCedula(cedula: string): Observable<any> {
        return this.http.get(`${baserUrl}/api/fenix/cedula/${cedula}`).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
    //metodo para obtener docentes por primer_apellido
    public getDocenteByPrimerNombre(primer_nombre: string): Observable<any> {
        return this.http.get(`${baserUrl}/api/fenix/p-nombre/${primer_nombre}`).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
    //metodo para obtener docentes por segundo_apellido
    public getDocenteBySegundoNombre(segundo_nombre: string): Observable<any> {
        return this.http.get(`${baserUrl}/api/fenix/s-nombre/${segundo_nombre}`).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
    //metodo para obtener docentes por su primer_nombre y segundo_nombre
    public getDocenteByPrimerNombreSegundoNombre(primer_nombre: string, segundo_nombre: string): Observable<any> {
        return this.http.get(`${baserUrl}/api/fenix/nombres/${primer_nombre }/${segundo_nombre}`).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
    //metodo para obtener docentes por primer_apellido
    public getDocenteByPrimerApellido(primer_apellido: string): Observable<any> {
        return this.http.get(`${baserUrl}/api/fenix/p-apellido/${primer_apellido}`).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
    //metodo para obtener docentes por segundo_apellido
    public getDocenteBySegundoApellido(segundo_apellido: string): Observable<any> {
        return this.http.get(`${baserUrl}/api/fenix/s-apellido/${segundo_apellido}`).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
    //metodo para obtener docentes por primer_apellido y segundo_apellido
    public getDocenteByPrimerApellidoAndSegundoApellido(primer_apellido: string, segundo_apellido: string): Observable<any> {
        return this.http.get(`${baserUrl}/api/fenix/apellidos/${primer_apellido}/${segundo_apellido}`).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
    public getDocenteByNombresCompletos(primer_nombre: string, primer_apellido: string): Observable<any> {
        return this.http.get(`${baserUrl}/api/fenix/p-nombres/${primer_nombre}/${primer_apellido}`).pipe(
            catchError((error) => {
                console.error(error);
                throw error;
            })
        );
    }
}

