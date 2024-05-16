import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ModeloService } from 'src/app/services/modelo.service';
import { EvidenciaProjection } from 'src/app/interface/EvidenciaProjection';
import { DetalleEvaluacionService } from 'src/app/services/detalle-evaluacion.service';
import { CriteriosService } from 'src/app/services/criterios.service';
import { detalleEvaluacion } from 'src/app/models/DetalleEvaluacion';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';
import { Asigna_Evi } from 'src/app/models/Asignacion-Evidencia';
import { Modelo } from 'src/app/models/Modelo';

@Component({
  selector: 'app-evidencia-tareas-asginadas',
  templateUrl: './evidencia-tareas-asginadas.component.html',
  styleUrls: ['./evidencia-tareas-asginadas.component.css']
})
export class EvidenciaTareasAsginadasComponent {
  // Propiedades y métodos anteriores
  evidencias: EvidenciaProjection[] = [];
  isLoggedIn: boolean;
  user: any;
  verificar = false;
  titulo = "";
  ocultar = false;
  isLoading = false;
  botonDeshabilitado: boolean | undefined;
  dataSource = new MatTableDataSource<EvidenciaProjection>();
  displayedColumns: string[] = ['ID', 'Criterio', 'Subcriterio', 'Indicador', 'Evidencia', 'Subido', 'Actividad'];
  id_modelo!: number;
  conteoArchivos!: number;
  activ: Asigna_Evi = new Asigna_Evi();
  modeloVigente!: Modelo;

  constructor(private detaeva: DetalleEvaluacionService,
    private login: LoginService, private httpCriterios: CriteriosService,
    private evidenciaService: EvidenciaService,
    private modeloService: ModeloService, private router: Router,
    private paginatorIntl: MatPaginatorIntl) {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.paginatorIntl.nextPageLabel = 'Siguiente';
    this.paginatorIntl.lastPageLabel = 'Última';
    this.paginatorIntl.itemsPerPageLabel = 'Ítems por página';
    this.paginatorIntl.previousPageLabel = 'Anterior';
    this.paginatorIntl.firstPageLabel = 'Primera';
    this.paginatorIntl.getRangeLabel = (page, pageSize, length) => {
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
  }

  /* ngAfterViewInit() {
     console.log('Paginator:', this.paginator);
     if (this.paginator) {
       this.dataSource.paginator = this.paginator;
     }
   }*/
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.isLoading = true;
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();

      }
    );
    this.Inicio();
    this.Listado();
    localStorage.removeItem("eviden");
  }

  Inicio() {
    this.modeloVigente = JSON.parse(localStorage.getItem('modelo') || '{}');
    this.id_modelo = this.modeloVigente.id_modelo;
  }

  spans: any[] = [];

  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.evidencias.length;) {
      let currentValue = accessor(this.evidencias[i]);
      let count = 1;

      for (let j = i + 1; j < this.evidencias.length; j++) {
        if (currentValue !== accessor(this.evidencias[j])) {
          break;
        }
        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      this.spans[i][key] = count;
      i += count;
    }
  }


  getRowSpan(col: any, index: any) {
    return this.spans[index] && this.spans[index][col];
  }

  Listado(): void {
    this.evidenciaService.getevilist(this.user.username, this.id_modelo).subscribe((data: any[]) => {
      if (data.length != 0) {
        this.verificar = true;
        this.titulo = 'EVIDENCIAS ASIGNADAS';
        this.evidencias = data;

        this.cacheSpan('crite', (d) => d.criterio);
        this.cacheSpan('subcrite', (d) => d.criterio + d.subcriterio);
        this.cacheSpan('indi', (d) => d.criterio + d.subcriterio + d.indicador);

        data.forEach(evidencia => {
          this.detaeva.getObservaciones(evidencia.id_evidencia, this.id_modelo).subscribe(
            (observac: detalleEvaluacion[]) => {
              evidencia.observacion = observac.map((c) => c.observacion);
            }
          );
        });

        this.dataSource.data = this.evidencias;
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.titulo = 'NO TIENES ACTIVIDADES ASIGNADAS';
      }
    });
  }



  verDetalles(evidencia: any) {
    this.router.navigate(['/res/ActividadesResponsable'], { state: { data: evidencia.id_evidencia } });
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


  verificarFechaLimite() {
    this.modeloService.getModeMaximo().subscribe(data => {
      const fechaActual = new Date();
      const fechaFin = new Date(data.fecha_final_act);

      if (fechaActual > fechaFin) {
        this.botonDeshabilitado = true;
        this.mostrarMensaje('Ya no puede crear actividades porque ya paso la fecha límite.');
        return;
      }
    });
  }

  mostrarMensaje(mensaje: string) {
    Swal.fire({
      title: 'Advertencia',
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }

  truncateDescription(description: string): string {
    const words = description.split(' ');
    if (words.length > 10) {
      return words.slice(0, 10).join(' ') + '...';
    } else {
      return description;
    }
  }

}
