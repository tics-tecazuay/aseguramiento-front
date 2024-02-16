import { Evidencia } from 'src/app/models/Evidencia';
import { Archivo } from './../../../models/Archivo';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActividadService } from 'src/app/services/actividad.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { Modelo } from 'src/app/models/Modelo';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';
import { CriteriosService } from 'src/app/services/criterios.service';
import { Observacion2 } from 'src/app/models/Observaciones2';
import { Asigna_EviDTO } from 'src/app/models/Asignacion-EvidenciaDTO';
import { Asigna_Evi } from 'src/app/models/Asignacion-Evidencia';
import { of, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-actividades-responsable',
  templateUrl: './actividades-responsable.component.html',
  styleUrls: ['./actividades-responsable.component.css']
})
export class ActividadesResponsableComponent implements OnInit {
  searchText = '';
  @ViewChild('datosModalRef') datosModalRef: any;
  miModal!: ElementRef;
  public actividad = new Asigna_Evi();

  Asigna_Evi: Asigna_Evi[] = [];
  Asigna_EviDTO: Asigna_EviDTO[] = [];
  noti = new Notificacion();
  user: any = null;
  idevidencia!: number;
  idusuario: any = null;
  nombreact: any = null;
  id_modelo!: number;
  ocultar = false;
  isLoggedIn = false;

  despuesFechaLimite: boolean = false;
  // Crear una fuente de datos para la tabla
  dataSource = new MatTableDataSource<Asigna_EviDTO>();

  /*ngAfterViewInit() {
   console.log('Paginator:', this.paginator);
   if (this.paginator) {
     this.dataSource.paginator = this.paginator;
   }
 }*/
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Encabezados de la tabla
  displayedColumns: string[] = [
    'ID',
    'ACTIVIDAD',
    'FECHA DE INICIO',
    'FECHA FINALIZACION',
    'ESTADO',
    'Observacion',
    'Subir evidencia'
  ];
acti: any;


  constructor(
    private services: ActividadService,
    private fb: FormBuilder, private evid: EvidenciaService,
    private router: Router, private asigna: AsignaEvidenciaService,
    public login: LoginService, private criteriosService: CriteriosService,
    private notificationService: NotificacionService,
    private paginatorIntl: MatPaginatorIntl,
    private _snackBar: MatSnackBar,
  ) {

    this.paginatorIntl.nextPageLabel = 'Siguiente';
    this.paginatorIntl.lastPageLabel = 'Última';
    this.paginatorIntl.itemsPerPageLabel = 'Actividades por página';
    this.paginatorIntl.previousPageLabel = 'Anterior';
    this.paginatorIntl.firstPageLabel = 'Primera';
    // Además, puedes definir la función para la etiqueta de rango en español si es necesario
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
  evi: Evidencia = new Evidencia();
  idevi: number = 0;
  evide: number = 0;
  id_ev!: number;
  ngOnInit(): void {
    const idEvidencia = localStorage.getItem("eviden");
    this.id_ev = Number(idEvidencia);
    console.log("traido ev " + idEvidencia);
    this.modeloMax();

    setInterval(() => {
      this.calcularfecha();
    }, 3600000);

    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();

    this.idusuario = this.user.id;
    console.log("usuar " + this.idusuario);
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();

      }
    );
  }

  modeloMax() {
    this.criteriosService.getModeMaximo().subscribe((data) => {
      this.id_modelo = data.id_modelo;
      this.inicio();
    });
  }

  inicio() {
    if (this.id_ev != 0) {
      this.evid.buscar(this.id_ev).subscribe((evidencia: Evidencia) => {
        this.evi = evidencia;
        this.listar();
        //this.fechaminima();
      });
    } else {
      const data = history.state.data;
      this.id_ev = data;
      this.evid.buscar(this.id_ev).subscribe((evidencia: Evidencia) => {
        this.evi = evidencia;
        this.listar();
        //this.fechaminima();
      });
    }
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

  listar(): void {
    console.log("IDS: " + this.user.username + " id " + this.id_ev + " idevidencia " + this.evi.id_evidencia);
    this.services.getactivievid(this.user.username, this.id_ev).subscribe((data: any[]) => {
      const actidata = data;
      this.Asigna_EviDTO = actidata;
      actidata.forEach(activi => {
        this.services.getObservaciones(activi.id_asignacion_evidencia).subscribe(
          (obser: Observacion2[]) => {
            activi.observacion = obser.map((c) => c.observacion);
          },
          (error) => {
            console.error("Error al obtener observaciones:", error);

            
          }
        );
      });
    
      this.dataSource.data = this.Asigna_EviDTO;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.error("Error al obtener actividades:", error);
    });
  }

  archivo: Archivo = new Archivo();

  verDetalles(archivos: any) {
    archivos.id_asignacion_evidencia;
    console.log("acti arc " + archivos.id_asignacion_evidencia);
    this.router.navigate(['/res/evidenciaResponsable'], { state: { data: archivos } });
  }

  calcularfecha() {
    this.services.geteviasig(this.user.username).subscribe(data => {
      this.Asigna_Evi = data;
      // Obtener la fecha actual
      const fechaActual = new Date();
      // Iterar sobre las actividades y verificar la fecha
      this.Asigna_Evi.forEach(actividad => {
        const fechaFinActividad = new Date(actividad.fecha_fin);
        // Verificar si la fecha de finalización de la actividad es mayor o igual a la fecha actual
        if (fechaFinActividad >= fechaActual) {
          // Calcular la diferencia en días entre la fecha actual y la fecha de finalización de la actividad
          const tiempoRestante = fechaFinActividad.getTime() - fechaActual.getTime();
          const diasRestantes = Math.ceil(tiempoRestante / (1000 * 3600 * 24));
          // Verificar si quedan 3 días o menos para la fecha de finalización de la actividad
          if (diasRestantes <= 3) {
            // Mostrar la notificación individual con SweetAlert
            Swal.fire({
              title: `Actividad "${actividad.evidencia.descripcion}"`,
              text: `Faltan ${diasRestantes} días para que se cumpla la fecha de finalización.`,
              icon: 'warning',
              position: 'top-end',
              toast: true,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
              customClass: {
                title: 'custom-title',
                popup: 'custom-popup',
                icon: 'custom-icon',
                confirmButton: 'custom-button'
              }
            });
          }
        }
      });
    });
  }


  fechaMinima: string = "";
  fechaMax: string = "";

  datasource: Modelo[] = [];

  /*fechaminima() {
    let fechaactual = new Date();
    this.asigna.getfechaAsignacion(this.id_ev, this.id_modelo)
      .pipe(
        switchMap(data => {
          console.log("Fecha " + JSON.stringify(data));
          const fechaInicio = new Date(data.fecha_inicio);
          this.fechaMinima = fechaInicio.toISOString().split('T')[0];
  
          const fechaactividad = new Date(data.fecha_fin);
          this.fechaMax = fechaactividad.toISOString().split('T')[0];
          this.crear = fechaactual <= fechaactividad;
          return of(null);
        })
      )
      .subscribe();
      }  
      */
  filterPost = '';

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {

      // Restaurar los datos originales si no hay filtro aplicado
      this.listar();
    }
  }
  esFechaPasada(activi: any): boolean {
  // Obtén la zona horaria de Ecuador (GMT-5)
  const zonaHorariaEcuador = -5 * 60;

  const fechaActual = new Date();
  const fechaFinActividad = new Date(activi.fecha_fin);

  // Ajusta la zona horaria de la fecha actual para que sea GMT-5
  fechaActual.setUTCMinutes(fechaActual.getUTCMinutes() - zonaHorariaEcuador);

  // Ajusta la zona horaria de la fecha de finalización de la actividad para que sea GMT-5
  fechaFinActividad.setUTCMinutes(fechaFinActividad.getUTCMinutes() - zonaHorariaEcuador);

  // Establece la hora al final del día de la fecha de finalización
  fechaFinActividad.setHours(23, 59, 59, 999);

  console.log('Fecha actual:', fechaActual);
  console.log('Fecha fin actividad:', fechaFinActividad);

  // Compara las fechas directamente
  return fechaActual.getTime() > fechaFinActividad.getTime();
  }
}
