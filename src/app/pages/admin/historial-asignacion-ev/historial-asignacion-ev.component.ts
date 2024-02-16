import { Component, OnInit } from '@angular/core';
import { CriterioByAdmin } from 'src/app/interface/CriteUsuarioProjection';
import { Router } from '@angular/router';
import { CriteriosService } from 'src/app/services/criterios.service';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LoginService } from 'src/app/services/login.service';
import { HistorialAsigEvi } from 'src/app/interface/AsigEvidProjection';
import { ModeloService } from 'src/app/services/modelo.service';


@Component({
  selector: 'app-historial-asignacion-ev',
  templateUrl: './historial-asignacion-ev.component.html',
  styleUrls: ['./historial-asignacion-ev.component.css']
})
export class HistorialAsignacionEvComponent implements OnInit {

  isLoggedIn = false;
  user: any = null;
  idUserLogged!: number;
  idmodel!: number;

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
    this.service.getModeMaximo().subscribe((data) => {
      this.idmodel = data.id_modelo;
      console.log("ID DEL MODELO", this.idmodel);
      this.listarCriterioAdmin();
    })
  }

  // cacheSpan(key: string, accessor: (d: any) => any) {
  //   for (let i = 0; i < this.asig.length;) {
  //     let currentValue = accessor(this.asig[i]);
  //     let count = 1;

  //     for (let j = i + 1; j < this.asig.length; j++) {
  //       if (currentValue !== accessor(this.asig[j])) {
  //         break;
  //       }
  //       count++;
  //     }

  //     if (!this.spans[i]) {
  //       this.spans[i] = {};
  //     }

  //     this.spans[i][key] = count;
  //     i += count;
  //   }
  // }

  // getRowSpan(col: any, index: any) {
  //   return this.spans[index] && this.spans[index][col];
  // }


  // cacheSpan2(key: string, accessor: (d: any) => any) {
  //   for (let i = 0; i < this.asig2.length;) {
  //     let currentValue = accessor(this.asig2[i]);
  //     let count = 1;

  //     for (let j = i + 1; j < this.asig2.length; j++) {
  //       if (currentValue !== accessor(this.asig2[j])) {
  //         break;
  //       }
  //       count++;
  //     }

  //     if (!this.spans2[i]) {
  //       this.spans2[i] = {};
  //     }

  //     this.spans2[i][key] = count;
  //     i += count;
  //   }
  // }


  // getRowSpan2(col: any, index: any) {
  //   return this.spans2[index] && this.spans2[index][col];
  // }

  listarCriterioAdmin() {
    this.servCriterio.getCriterioAdm(this.idmodel, this.idUserLogged).subscribe(
      (data: CriterioByAdmin[]) => {
        console.log("Datos recibidos del servicio:", data);
        this.criterio = data;
      },
      (error) => {
        console.error("Error al obtener datos del servicio:", error);
      }
    );
  }

  // cargar tabla
  cargarTabla(idCrite: number) {
    this.nombreCriterio = this.criterio.find(c => c.id_criterio === idCrite)?.nombre_criterio || '';
    console.log('Cargando tabla para el criterio:', this.nombreCriterio);

    this.serviceEvi.getHistorialAsigEvByUserCrit(this.idUserLogged, idCrite, 'true').subscribe((
      data: HistorialAsigEvi[]) => {
      this.asig = data;
      console.log("actividades actuales ", JSON.stringify(this.asig))
      // this.cacheSpan('enc', (d) => d.enc);
      // this.cacheSpan('nombrescri', (d) => d.enc + d.nombrescri);

    });

    this.serviceEvi.getHistorialAsigEvByUserCrit(this.idUserLogged, idCrite, 'false').subscribe((
      data: HistorialAsigEvi[]) => {
      this.asig2 = data;
      console.log("actividades anteriores", JSON.stringify(this.asig2))
      // this.cacheSpan('enc', (d) => d.enc);
      // this.cacheSpan('nombrescri', (d) => d.enc + d.nombrescri);

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
