import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { Indicador } from "../models/Indicador";

let id_criterio: number;
let id_subcriterio: number;
let id_indicador: number;
@Injectable({
    providedIn: "root"
})
export class SharedDataService {

    private datosSubject = new BehaviorSubject<any[]>([]);
    datos$ = this.datosSubject.asObservable();

    agregarDatos(datos: any[]) {
        const nuevosDatos = [...datos];
        this.datosSubject.next(nuevosDatos);
    }

    agregarIdCriterio(id: number) {
        id_criterio = id;
    }

    obtenerIdCriterio() {
        return id_criterio;
    }

    mostaridSubcriterio(id: number) {
        id_subcriterio = id;
        // console.log(id_subcriterio);
    }
    obtenerIdSubCriterio() {
        return id_subcriterio;
    }

}
