import { Evidencia } from 'src/app/models/Evidencia';
import { Archivo } from './../../../models/Archivo';
import { Actividades } from './../../../models/actividades';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActividadService } from 'src/app/services/actividad.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { Modelo } from 'src/app/models/Modelo';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';
import { CriteriosService } from 'src/app/services/criterios.service';
import { Observacion2 } from 'src/app/models/Observaciones2';
import { of, switchMap } from 'rxjs';


@Component({
  selector: 'app-actividades-responsable',
  templateUrl: './actividades-responsable.component.html',
  styleUrls: ['./actividades-responsable.component.css']
})
export class ActividadesResponsableComponent implements OnInit {
  searchText = '';
  @ViewChild('datosModalRef') datosModalRef: any;
  miModal!: ElementRef;
  public actividad = new Actividades();

  Actividades: Actividades[] = [];
  guardadoExitoso: boolean = false;
  frmActividades: FormGroup;
  nombreacti!: string;
  noti = new Notificacion();
  user: any = null;
  idevidencia!: number;
  idusuario: any = null;
  nombre: any = null;
  nombreact: any = null;
  id_modelo!: number;
  crear = true;
  ocultar = false;
  isLoggedIn = false;
  // Crear una fuente de datos para la tabla
  dataSource = new MatTableDataSource<Actividades>();

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
    'NOMBRE',
    'DESCRIPCIÓN',
    'FECHA DE INICIO',
    'FECHA FINALIZACION',
    'ESTADO',
    'observacion',
    'Subir evidencia',
    'ACCIÓN'
  ];
  constructor(
    private services: ActividadService,
    private fb: FormBuilder, private evid: EvidenciaService,
    private router: Router, private asigna: AsignaEvidenciaService,
    public login: LoginService, private criteriosService: CriteriosService,
    private notificationService: NotificacionService,
    private paginatorIntl: MatPaginatorIntl,
  ) {

    this.frmActividades = fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(250)]],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required]

    });
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
    // console.log("traido ev " + idEvidencia);
    this.modeloMax();

    setInterval(() => {
      this.calcularfecha();
    }, 3600000);

    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();

    this.idusuario = this.user.id;
    // console.log("usuar " + this.idusuario);
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
      //this.evide = this.id_ev;
     // console.log("evid " + this.evide);
      this.evid.buscar(this.id_ev).subscribe((evidencia: Evidencia) => {
        this.evi = evidencia;
        this.listar();
        this.fechaminima();
      });
    } else {
      const data = history.state.data;
      this.id_ev = data;
      //this.evide = this.id_ev;
      this.evid.buscar(this.id_ev).subscribe((evidencia: Evidencia) => {
        this.evi = evidencia;
        this.listar();
        this.fechaminima();
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

  notificar() {
    this.noti.fecha = new Date();
    this.noti.rol = "SUPERADMIN";
    this.noti.mensaje = this.user.persona.primer_nombre + " " + this.user.persona.primer_apellido + " ha creado la actividad " + this.nombreacti;
    this.noti.visto = false;
    this.noti.usuario = 0;
    this.noti.url = "/sup/detalle";
    this.noti.idactividad = this.idevidencia;
    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        // console.log('Notificacion guardada');
      },
      (error: any) => {
        // console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  notificaradmin() {
    this.noti.fecha = new Date();
    this.noti.rol = "ADMIN";
    this.noti.mensaje = this.user.persona.primer_nombre + " " + this.user.persona.primer_apellido + " ha creado la actividad " + this.nombreacti;
    this.noti.visto = false;
    this.noti.usuario = 0;
    this.noti.url = "/adm/detalleAprobarRechazar";
    this.noti.idactividad = this.idevidencia;
    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        // console.log('Notificacion guardada');
      },
      (error: any) => {
        // console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  validarFechas(): void {
    const fechaInicio = this.frmActividades.get('fecha_inicio')?.value as string;
    const fechaFin = this.frmActividades.get('fecha_fin')?.value as string;

    if (fechaInicio && fechaFin) {
      const dateInicio = new Date(fechaInicio);
      const dateFin = new Date(fechaFin);

      if (dateFin < dateInicio) {
        this.frmActividades.setErrors({ fechasInvalidas: true });
      } else {
        this.frmActividades.setErrors(null);
      }
    }
  }


  guardar() {
    this.actividad = this.frmActividades.value;
    // console.log("Nombre actividad: " + this.actividad.nombre);
    this.nombreacti = this.actividad.nombre;
    this.actividad.evidencia = this.evi;
    this.idevidencia = this.evi.id_evidencia;
    this.actividad.usuario = this.idusuario;
    this.actividad.estado = "pendiente"
    this.services.crear(this.actividad)
      .subscribe(
        (response) => {
          // console.log('creado con éxito:', response);
          this.guardadoExitoso = true;
          this.notificar();
          this.notificaradmin();
          this.listar();
          Swal.fire({
            title: 'Guardado con éxito',
            text: 'La actividad ha sido guardada satisfactoriamente',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        },
        (error) => {
          console.error('Error al crear:', error);
          Swal.fire({
            title: 'Error al guardar',
            text: 'Ocurrió un error al guardar la actividad',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      );
  }

  editDatos(acti: Actividades) {
    this.actividad = acti;
    this.frmActividades = new FormGroup({
      nombre: new FormControl(acti.nombre),
      descripcion: new FormControl(acti.descripcion),
      fecha_inicio: new FormControl(acti.fecha_inicio),
      fecha_fin: new FormControl(acti.fecha_fin)
    });
  }

  listar(): void {
    // console.log("IDS: " + this.user.username + " id " + this.id_ev + " idevidencia " + this.evi.id_evidencia);
    this.services.getactivievid(this.user.username, this.id_ev).subscribe((data: any[]) => {
      const actidata = data;
      this.Actividades = actidata;
      actidata.forEach(activi => {
        this.services.getObservaciones(activi.id_actividad).subscribe(
          (obser: Observacion2[]) => {
            activi.observacion = obser.map((c) => c.observacion);
          },
          (error) => {
            console.error("Error al obtener observaciones:", error);

          }
        );
      });

      this.dataSource.data = this.Actividades;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.error("Error al obtener actividades:", error);
    });
  }



  eliminar(act: any) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.services.eliminar(act).subscribe(
          (response) => {
            this.listar();
            Swal.fire({
              title: 'Eliminado',
              text: 'El registro ha sido eliminado correctamente',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
          },
          (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire({
              title: 'Error al eliminar',
              text: 'Ocurrió un error al eliminar el registro',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        );
      }
    });
  }

  limpiarFormulario() {
    this.frmActividades.reset();
    this.actividad = new Actividades;
  }

  actualizar() {
    this.actividad.nombre = this.frmActividades.value.nombre;
    this.actividad.descripcion = this.frmActividades.value.descripcion;
    this.actividad.fecha_inicio = this.frmActividades.value.fecha_inicio;
    this.actividad.fecha_fin = this.frmActividades.value.fecha_fin;
    this.actividad.usuario = null;
    // console.log(this.actividad)
    this.services.update(this.actividad.id_actividad, this.actividad)
      .subscribe(response => {
        this.actividad = new Actividades();
        this.listar();
        Swal.fire('Operacion exitosa!', 'El registro se actualizo con exito', 'success')
      });
  }
  archivo: Archivo = new Archivo();

  verDetalles(archivos: any) {
    archivos.evidencia.id_evidencia;
    // console.log("acti arc " + archivos.evidencia.id_evidencia);
    this.router.navigate(['/res/evidenciaResponsable'], { state: { data: archivos } });
  }

  calcularfecha() {
    this.services.geteviasig(this.user.username).subscribe(data => {
      this.Actividades = data;
      // Obtener la fecha actual
      const fechaActual = new Date();
      // Iterar sobre las actividades y verificar la fecha
      this.Actividades.forEach(actividad => {
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
              title: `Actividad "${actividad.nombre}"`,
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

  fechaminima() {
    let fechaactual = new Date();
    this.asigna.getfechaAsignacion(this.id_ev, this.id_modelo)
      .pipe(
        switchMap(data => {
          // console.log("Fecha " + JSON.stringify(data));
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

}
