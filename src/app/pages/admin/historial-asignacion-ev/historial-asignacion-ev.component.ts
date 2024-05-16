import { Component, OnInit } from '@angular/core';
import { CriterioByAdmin } from 'src/app/interface/CriteUsuarioProjection';
import { Router } from '@angular/router';
import { CriteriosService } from 'src/app/services/criterios.service';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LoginService } from 'src/app/services/login.service';
import { HistorialAsigEvi } from 'src/app/interface/AsigEvidProjection';
import { ModeloService } from 'src/app/services/modelo.service';
import { error } from 'jquery';
import { Modelo } from 'src/app/models/Modelo';


@Component({
  selector: 'app-historial-asignacion-ev',
  templateUrl: './historial-asignacion-ev.component.html',
  styleUrls: ['./historial-asignacion-ev.component.css']
})
export class HistorialAsignacionEvComponent implements OnInit {

  isLoggedIn = false;
  user: any = null;
  idUserLogged!: number;

  asig!: HistorialAsigEvi[];
  asig2!: HistorialAsigEvi[];
  criterio!: CriterioByAdmin[];
  searchTerm: string = '';
  searchTerm1: string = '';
  searchTerm2: string = '';
  showHint!: boolean;

  nombreCriterio: string = '';
  displayedColumns: string[] = ['nombre_usuario', 'titulo_subcriterio', 'titulo_indicador', 'titulo_evidencia', 'fecha', 'fecha_fin', 'fecha_inicio', 'estado'];
  displayedCriterio: string[] = ['nombre_criterio', 'descripcion_criterio'];
  spans: any[] = [];
  spans2: any[] = [];

  itemsPerPageLabel = 'Items por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel = 'Primera';
  previousPageLabel = 'Anterior';
  rango: any = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
      return `0 de ${length}`;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };

  modeloVigente!: Modelo;
  id_modelo!: number;
  constructor(private router: Router, private servCriterio: CriteriosService, private serviceEvi: AsignaEvidenciaService, private paginatorIntl: MatPaginatorIntl, public login: LoginService, private service: ModeloService
  ) { }

  ngOnInit(): void {

    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
    this.idUserLogged = this.user.id;
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
    this.modeloMax();
  }

  modeloMax() {
    this.modeloVigente = JSON.parse(localStorage.getItem('modelo') || '{}');
    this.id_modelo = this.modeloVigente.id_modelo;
    this.listarCriterioAdmin();
  }

  listarCriterioAdmin() {
    this.servCriterio.getCriterioAdm(this.id_modelo, this.idUserLogged).subscribe(
      (data: CriterioByAdmin[]) => {
        console.log("Datos recibidos del servicio:", data);
        this.criterio = data;
      },
      (error) => {
        console.error("Error al obtener datos del servicio:", error);
      }
    );
  }

  noRegistros: any;
  // cargar tabla
  cargarTabla(idCrite: number) {
    this.nombreCriterio = this.criterio.find(c => c.id_criterio === idCrite)?.nombre_criterio || '';
    console.log('Cargando tabla para el criterio:', this.nombreCriterio + idCrite);

    this.asig = [];
    this.asig2 = [];
    this.noRegistros = null;
    this.serviceEvi.getHistorialAsigEvByUserCrit(idCrite, 'true', this.id_modelo).subscribe((
      data: HistorialAsigEvi[]) => {
      if (data.length > 0) {
        this.asig = data;
        console.log("actividades actuales ", this.asig)
        // this.cacheSpan('enc', (d) => d.enc);
        // this.cacheSpan('nombrescri', (d) => d.enc + d.nombrescri);
      } else {
        this.noRegistros = 'No hay registros disponibles.';
      }

    }, (error) => {
      console.error("Error al obtener datos del servicio:", error);
    }
    );

    this.serviceEvi.getHistorialAsigEvByUserCrit(idCrite, 'false', this.id_modelo).subscribe((
      data: HistorialAsigEvi[]) => {
      if (data.length > 0) {
        this.asig2 = data;
        console.log("actividades anteriores", this.asig2)
        // this.cacheSpan('enc', (d) => d.enc);
        // this.cacheSpan('nombrescri', (d) => d.enc + d.nombrescri);
      } else {
        this.noRegistros = 'No hay registros disponibles.';
      }

    }, (error) => {
      console.error("Error al obtener datos del servicio:", error);
    });
  }

  getColorEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'estado-pendiente';
      case 'aprobada':
        return 'estado-aprobada';
      case 'rechazada':
        return 'estado-rechazada';
      default:
        return '';
    }
  }

}
