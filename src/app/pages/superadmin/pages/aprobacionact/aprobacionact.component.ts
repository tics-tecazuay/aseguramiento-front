import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { detalleEvaluacion } from 'src/app/models/DetalleEvaluacion';
import { Evidencia } from 'src/app/models/Evidencia';
import { Notificacion } from 'src/app/models/Notificacion';
import { Usuario2 } from 'src/app/models/Usuario2';
import { DetalleEvaluacionService } from 'src/app/services/detalle-evaluacion.service';
import { EmailServiceService } from 'src/app/services/email-service.service';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { LoginService } from 'src/app/services/login.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import Swal from 'sweetalert2';
import { CalificacionComponent } from '../../modelo/matriz-evaluacion/calificacion/calificacion.component';
import { Asigna_Evi } from 'src/app/models/Asignacion-Evidencia';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';
import { ActividadService } from 'src/app/services/actividad.service';
import { ArchivoService } from 'src/app/services/archivo.service';
import { ArchivoAdmSupProjection } from 'src/app/models/Archivo';
import { EvidenciaEvProjection } from 'src/app/interface/EvidenciasProjection';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Modelo } from 'src/app/models/Modelo';

declare var $: any;

@Component({
  selector: 'app-aprobacionact',
  templateUrl: './aprobacionact.component.html',
  styleUrls: ['./aprobacionact.component.css'],
})
export class AprobacionactComponent implements OnInit {
  columnas: string[] = [
    'id_evidencia',
    'nombrecriterio',
    'nombresubcriterio',
    'nombreindicador',
    'tipo',
    'descripcionevidencia',
    'comentario',
    'actions',
  ];
  columnasDetalle: string[] = [
    'iddetalle',
    'evi',
    'observacion',
    'estado',
    'fecha',
    'usua',
    'actions',
  ];
  aprobado: boolean = false;
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<EvidenciaEvProjection>();
  dataSource4 = new MatTableDataSource<detalleEvaluacion>();
  noRegistros: any;
  mostrarBoton = false;
  idUsuario: number = 0;
  usuarioResponsable: Usuario2[] = [];
  idFilter = new FormControl();
  usuarioSeleccionado: Usuario2 = new Usuario2();
  evidencias!: EvidenciaEvProjection[];
  Evidencia: Evidencia = new Evidencia();
  filterPost = '';
  searchTerm: string = '';
  searchTerm2: string = '';
  isSending = false;
  spinnerValue = 0;
  spinnerInterval: any;
  mostrar = false;
  enviado = false;
  maxTime: number = 30;
  sent: boolean = false;
  toUser: string = '';
  subject: string = '';
  message: string = '';
  isLoggedIn = false;
  user: any = null;
  rol: any = null;
  ocultar = false;
  noti = new Notificacion();
  idusuario: any = null;
  nombre: any = null;
  descripcionSeleccionada: any = null;
  fechaActual: Date = new Date();
  fechaFormateada: string = this.fechaActual.toLocaleDateString('es-ES');
  correoEnviar = '';
  estadoEvi = '';
  evid!: EvidenciaEvProjection;
  public evidDetalle = new Evidencia();
  observacion = '';
  idevi!: number;
  detalleEvi: detalleEvaluacion = new detalleEvaluacion();
  listadodetalleEval: detalleEvaluacion[] = [];
  id_modelo!: number;
  modeloVigente!: Modelo;
  verificar: boolean = false;
  asignar: Asigna_Evi = new Asigna_Evi();
  id_evidencia!: number;
  usuariosResponsables: any[] = [];
  selectedUser: any;
  fechaFinalObtenida: Date = new Date();
  nombreCompleto = '';
  descripcionEvi = '';
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  id_asig_evid!: number;
  verModalArchivo: boolean = false;
  verModalDetalles: boolean = true;
  pdfUrl: SafeResourceUrl | undefined;
  estadoSeleccionado: boolean = false;
  responsable = '';
  titulo = 'RESPONSABLE AUN NO SELECCIONADO';
  asignacion_evidencia_seleccionada!: Asigna_Evi;
  //TABLA
  itemsPerPageLabel = 'Evidencias por página';
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

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private evidenciaService: EvidenciaService,
    private dialog: MatDialog,
    private emailService: EmailServiceService,
    public login: LoginService,
    private notificationService: NotificacionService,
    private detalleEvaluaService: DetalleEvaluacionService,
    private actividadService: ActividadService,
    private asignarEvidenciaService: AsignaEvidenciaService,
    private archivo: ArchivoService,
    private sanitizer: DomSanitizer,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
    localStorage.removeItem('eviden');
    this.modeloMax();
    this.listaResponsable();
  }

  modeloMax() {
    this.modeloVigente = JSON.parse(localStorage.getItem('modelo') || '{}');
    this.id_modelo = this.modeloVigente.id_modelo;
    //Directamente guardar en el objeto notificacion el modelo
    this.noti.id_modelo = this.id_modelo;
  }

  applyFilter() {
    const filterValue = this.idFilter.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // NOTIFICACIONES 
  notificarrechazo() {
    this.noti.fecha = new Date();
    this.noti.rol = 'SUPERADMIN';
    const nombres = localStorage.getItem('nombres');
    this.noti.mensaje =
      this.user?.persona?.primer_nombre +
      ' ' +
      this.user?.persona?.primer_apellido +
      ' ha rechazado la evidencia ' +
      this.descripcionSeleccionada +
      ' de ' +
      nombres;
    this.noti.usuario = 0;
    this.noti.url = '/sup/aprobaciones';
    this.noti.idactividad = 0;
    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  notificarrechazouser() {
    this.noti.fecha = new Date();
    this.noti.rol = '';
    this.noti.mensaje =
      this.user?.persona?.primer_nombre +
      ' ' +
      this.user?.persona?.primer_apellido +
      ' ha rechazado tu evidencia ' +
      this.descripcionSeleccionada;
    this.noti.visto = false;
    this.noti.url = '/res/evidenasignada';
    this.noti.idactividad = 0;
    const idUsuarioString = localStorage.getItem('idUsuario');
    const idUsuario = Number(idUsuarioString);
    this.noti.usuario = idUsuario;
    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  notificarrechazoadmin() {
    this.noti.fecha = new Date();
    this.noti.rol = 'ADMIN';
    const nombres = localStorage.getItem('nombres');
    console.log('Nombres usuario ' + nombres);
    this.noti.mensaje =
      this.user?.persona?.primer_nombre +
      ' ' +
      this.user?.persona?.primer_apellido +
      ' ha rechazado la evidencia ' +
      this.descripcionSeleccionada +
      ' de ' +
      nombres;
    this.noti.visto = false;
    this.noti.usuario = 0;
    this.noti.url = '/adm/apruebaAdmin';
    this.noti.idactividad = 0;
    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  notificaraprob() {
    this.noti.fecha = new Date();
    this.noti.rol = 'SUPERADMIN';
    const nombres = localStorage.getItem('nombres');
    this.noti.mensaje =
      this.user?.persona?.primer_nombre +
      ' ' +
      this.user?.persona?.primer_apellido +
      ' ha aprobado la evidencia ' +
      this.descripcionSeleccionada +
      ' de ' +
      nombres;
    this.noti.usuario = 0;
    this.noti.url = '/sup/aprobaciones';
    this.noti.idactividad = 0;
    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  notificaraprobuser() {
    this.noti.fecha = new Date();
    this.noti.rol = '';
    this.noti.mensaje =
      this.user?.persona?.primer_nombre +
      ' ' +
      this.user?.persona?.primer_apellido +
      ' ha aprobado tu evidencia ' +
      this.descripcionSeleccionada;
    this.noti.visto = false;
    const idUsuarioString = localStorage.getItem('idUsuario');
    const idUsuario = Number(idUsuarioString);
    this.noti.usuario = idUsuario;
    this.noti.url = '/res/evidenasignada';
    this.noti.idactividad = 0;
    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  notificaraprobadmin() {
    this.noti.fecha = new Date();
    this.noti.rol = 'ADMIN';
    const nombres = localStorage.getItem('nombres');
    this.noti.mensaje =
      this.user?.persona?.primer_nombre +
      ' ' +
      this.user?.persona?.primer_apellido +
      ' ha aprobado la evidencia ' +
      this.descripcionSeleccionada +
      ' de ' +
      nombres;
    this.noti.visto = false;
    this.noti.usuario = 0;
    this.noti.url = '/adm/apruebaAdmin';
    this.noti.idactividad = 0;
    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  notificarCambio(usuarioNuevo: string) {
    this.noti.fecha = new Date();
    this.noti.rol = "SUPERADMIN";
    this.noti.mensaje = this.user.persona.primer_nombre + " " + this.user.persona.primer_apellido + " ha cambiado la asignacion de la evidencia " + this.descripcionSeleccionada
      + " a " + usuarioNuevo;
    this.noti.visto = false;
    this.noti.usuario = 0;
    this.noti.url = "/sup/aprobaciones";
    this.noti.idactividad = 0;
    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  notificarcambiouser(usuarioNuevo: number) {
    this.noti.fecha = new Date();
    this.noti.rol = "";
    this.noti.mensaje = this.user.persona.primer_nombre + " " + this.user.persona.primer_apellido + " te ha asignado la evidencia " + this.descripcionSeleccionada;
    this.noti.visto = false;
    this.noti.usuario = usuarioNuevo;
    this.noti.url = "/res/evidenasignada";
    this.noti.idactividad = 0;
    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  notificarcambioadmin(usuarioNuevo: string) {
    this.noti.fecha = new Date();
    this.noti.rol = "ADMIN";
    this.noti.mensaje = this.user.persona.primer_nombre + " " + this.user.persona.primer_apellido + " ha cambiado la asignacion de la evidencia " + this.descripcionSeleccionada
      + " a " + usuarioNuevo;
    this.noti.visto = false;
    this.noti.usuario = 0;
    this.noti.url = "/adm/apruebaAdmin";
    this.noti.idactividad = 0;
    this.notificationService.crear(this.noti).subscribe(
      (data: Notificacion) => {
        this.noti = data;
        console.log('Notificacion guardada');
      },
      (error: any) => {
        console.error('No se pudo guardar la notificación', error);
      }
    );
  }

  onSelectionChange(event: MatSelectionListChange) {
    this.isLoading = true;
    this.usuarioSeleccionado = event.options[0].value;
    localStorage.setItem('idUsuario', this.usuarioSeleccionado.id.toString());
    localStorage.setItem(
      'nombres',
      this.usuarioSeleccionado.persona.primer_nombre +
      ' ' +
      this.usuarioSeleccionado.persona.primer_apellido
    );

    if (this.usuarioSeleccionado) {
      this.estadoSeleccionado = true;
      this.titulo = 'RESPONSABLE SELECCIONADO: ';
      this.responsable = this.usuarioSeleccionado.persona.primer_nombre + ' ' + this.usuarioSeleccionado.persona.primer_apellido;
      this.evidenciaService
        .getEvidenciasAsignadasPorUsuario(this.usuarioSeleccionado.username, this.id_modelo)
        .subscribe((data) => {
          this.evidencias = data;
          this.dataSource.data = this.evidencias;
          this.isLoading = false;
        });
    } else {
      this.estadoSeleccionado = false;
      this.titulo;
    }
    this.mostrarBoton = true;
    this.nombreCompleto = this.usuarioSeleccionado.persona.primer_nombre + ' ' + this.usuarioSeleccionado.persona.primer_apellido;
    this.correoEnviar = this.usuarioSeleccionado.persona.correo;
    this.toUser = this.correoEnviar;

  }

  listaResponsable() {
    this.isLoading = true;
    this.evidenciaService.listarUsuario(this.id_modelo).subscribe((data) => {
      const usuariosFiltrados = data.filter(
        (usuario, index, self) =>
          index === self.findIndex((u) => u.id === usuario.id)
      );
      this.usuarioResponsable = usuariosFiltrados;
      this.isLoading = false;
    });
  }
  obtenerUsuariosResponsables(): void {
    this.evidenciaService.listarsolorespon().subscribe(
      (data: any[]) => {
        this.usuariosResponsables = data;
      },
      (error) => {
        console.error('Error al obtener usuarios responsables:', error);
      }
    );
  }

  // MODAL DE LA EVIDENCIA Y ARCHIVOS

  columnasDeta: string[] = [
    'idactividad',
    'nombre',
    'descripcion',
    'fechainicio',
    'fechafin',
    'actions',
  ];
  columnasArchi: string[] = ['nombreArchi', 'descripcionArchi', 'comentario', 'enlace', 'visualizar'];
  dataSourceDetalle = new MatTableDataSource<Asigna_Evi>();
  listadoActividad: Asigna_Evi[] = [];
  panelOpenState = false;
  archivoSe: ArchivoAdmSupProjection[] = [];
  dataSource2 = new MatTableDataSource<ArchivoAdmSupProjection>();
  nombreActividad = '';
  descripcionDeta = '';

  listarArchivos(id_asignacion_evidencia: number) {
    this.verModalDetalles = false;
    this.verModalArchivo = true;
    this.noRegistros = null;
    this.dataSource2.data = [];
    this.archivo.getarchivoActividad(id_asignacion_evidencia, this.id_modelo).subscribe((data) => {
      if (data.length > 0) {
        this.archivoSe = data;
        this.dataSource2.data = this.archivoSe;
      } else {
        this.noRegistros = 'No hay registros disponibles.';
      }
    });
  }

  cambiarVistaDetalles() {
    this.verModalDetalles = true;
    this.verModalArchivo = false;
  }

  obtenerNombreArchivo(url: string): string {
    const nombreArchivo = url.substring(url.lastIndexOf('/') + 1);
    return nombreArchivo;
  }

  seleccionarTarea(element: any) {
    this.evid = element;
    // this.descripcionEvi = element.descripcionevidencia
    this.id_evidencia = element.id_evidencia;
    this.descripcionEvi = element.descripcionevidencia;

    this.actividadService.getEviAsig(this.id_evidencia, this.modeloVigente.id_modelo).subscribe((data) => {
      this.asignacion_evidencia_seleccionada = data[0];
      this.listadoActividad = data;
      this.dataSourceDetalle.data = this.listadoActividad;

      this.id_asig_evid = this.listadoActividad[0].id_asignacion_evidencia;

      // Convertir las fechas a objetos Date
      if (this.listadoActividad[0].fecha_inicio && this.listadoActividad[0].fecha_fin) {
        this.fechaInicio = new Date(this.listadoActividad[0].fecha_inicio);
        this.fechaFin = new Date(this.listadoActividad[0].fecha_fin);
        console.log("Fecha inicio (después):", this.fechaInicio);
        console.log("Fecha fin (después):", this.fechaFin);
      }
    });
  }

  ModificarTarea() {
    this.detalleEvi.evidencia.id_evidencia = this.evid.id_evidencia;
    this.detalleEvi.usuario.id = this.user.id;
    this.detalleEvi.id_modelo = this.id_modelo;
    this.detalleEvi.observacion = this.observacion;
    if (this.aprobado) {
      this.evid.estado = this.estadoEvi;
      this.asignacion_evidencia_seleccionada.estado = this.estadoEvi;
      if (this.evid.estado == 'Aprobada') {
        this.detalleEvi.estado = true;
      } else if (this.evid.estado == 'Rechazada') {
        this.detalleEvi.estado = false;
      }

      this.detalleEvaluaService
        .create(this.detalleEvi)
        .subscribe((data) =>
          Swal.fire(
            'Guardado con éxito!',
            'Observaciones guardadas con éxito',
            'success'
          )
        );
      this.evidenciaService
        .actualizar2(this.evid.id_evidencia, this.evid)
        .subscribe(
          (response: any) => {
            this.actividadService.actualizarEstado(this.asignacion_evidencia_seleccionada.id_asignacion_evidencia, this.asignacion_evidencia_seleccionada).subscribe(
              (response: any) => {
                console.log(response);
              },
              (error: any) => {
                console.log(error);
              });
            Swal.fire({
              title: '¡Registro  exitoso!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            });
          },
          (error: any) => {
            Swal.fire({
              title: '¡Error al guardar!',
              text: 'Hubo un error al guardar la tarea.',
              icon: 'error',
              confirmButtonText: 'OK',
            });

            console.log(error);
          }
        );
    } else if (
      this.detalleEvi.estado != null &&
      this.detalleEvi.observacion != null &&
      this.detalleEvi.observacion != ''
    ) {
      this.evid.estado = this.estadoEvi;
      this.asignacion_evidencia_seleccionada.estado = this.estadoEvi;
      if (this.evid.estado == 'Aprobada') {
        this.detalleEvi.estado = true;
      } else if (this.evid.estado == 'Rechazada') {
        this.detalleEvi.estado = false;
      }

      this.detalleEvaluaService
        .create(this.detalleEvi)
        .subscribe((data) =>
          Swal.fire(
            'Guardado con éxito!',
            'Observaciones guardado con éxito',
            'success'
          )
        );
      this.evidenciaService
        .actualizar2(this.evid.id_evidencia, this.evid)
        .subscribe(
          (response: any) => {
            this.actividadService.actualizarEstado(this.asignacion_evidencia_seleccionada.id_asignacion_evidencia, this.asignacion_evidencia_seleccionada).subscribe(
              (response: any) => {
                console.log(response);
              },
              (error: any) => {
                console.log(error);
              });
            Swal.fire({
              title: '¡Registro  exitoso!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            });
          },
          (error: any) => {
            Swal.fire({
              title: '¡Error al guardar!',
              text: 'Hubo un error al guardar la tarea.',
              icon: 'error',
              confirmButtonText: 'OK',
            });

            console.log(error);
          }
        );
    } else {
      Swal.fire(
        'No agregó ninguna observación',
        'Por favor agregue alguna',
        'warning'
      );
    }
    this.LimpiarModal();
  }
  formatoFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  calificar(element: any) {
    this.idevi = element.id_evidencia;
    this.evidenciaService
      .getevical(this.idevi, this.id_modelo)
      .subscribe((data) => {
        const tipo: any = data.tipo;
        const id: any = data.id_in;
        const peso: any = data.peso;
        this.evaluar(tipo, id, peso);
      });
  }

  evaluar(valor: any, id: any, peso: any): void {
    const dialogRef = this.dialog.open(CalificacionComponent, {
      data: { valor, id, peso },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'success') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Calificación registrada',
          showConfirmButton: true,
          timer: 1500,
        });
      }
    });
  }

  seleccionarTareaDetalle(element: any) {
    this.evidDetalle = element;
    this.detalleEvaluaService
      .getDetalleEvi(this.evidDetalle.id_evidencia, this.id_modelo)
      .subscribe(
        (detalles) => {
          this.listadodetalleEval = detalles;
          console.log(detalles);
          this.dataSource4.data = detalles;
        },
        (error) => {
          console.log(error);
        }
      );
    this.Listar();
  }

  Listar() {
    this.noRegistros = null;
    this.detalleEvaluaService.getDetalleEvi(this.evidDetalle.id_evidencia, this.id_modelo).subscribe(
      (detalles) => {
        if (detalles.length > 0) {
          this.listadodetalleEval = detalles;
          this.dataSource4.data = detalles;
        } else {
          this.noRegistros = 'No hay registros disponibles.';
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getColorByEstado(estado: string): string {
    if (estado === 'pendiente') {
      return 'rgba(255, 242, 170)';
    } else if (estado === 'Aprobada') {
      return 'rgba(96, 179, 114)';
    } else if (estado === 'Rechazada') {
      return 'rgba(253, 79, 56)';
    } else {
      return '';
    }
  }

  Aprobado(descripcion: any) {
    this.descripcionSeleccionada = descripcion.descripcionevidencia;
    this.aprobado = true;
    this.subject = "EVIDENCIA APROBADA - " + this.evid.nombreindicador; // Asunto del correo
    Swal.fire({
      icon: 'success',
      title: 'La tarea ha sido aprobada',
      showConfirmButton: false,
      timer: 1500,
    });
    this.verificar = true;
    this.estadoEvi = 'Aprobada';
    // Verificar si el campo de observación está vacío y asignar un valor predeterminado si es así
    if (!this.observacion || this.observacion.trim() === '') {
      this.observacion = 'Sin observaciones';
    }

    this.cambiarVistaDetalles();
    // Remover la clase 'btn-active' de todos los botones
    const botones = document.querySelectorAll('.btn-aprobar, .btn-rechazar');
    botones.forEach(boton => {
      boton.classList.remove('btn-active');
      boton.classList.add('btn-inactive');
    });

    // Agregar la clase 'btn-active' solo al botón de Aprobado
    const botonAprobado = document.querySelector('.btn-aprobar');
    botonAprobado?.classList.add('btn-active');

  }

  Rechazado(descripcion: any) {
    this.aprobado = false;
    this.descripcionSeleccionada = descripcion.descripcionevidencia;
    this.subject = "EVIDENCIA RECHAZADA - " + this.evid.nombreindicador; // Asunto del correo
    Swal.fire({
      icon: 'error',
      title: 'La tarea ha sido rechazada.',
    });
    this.estadoEvi = 'Rechazada';
    this.verificar = false;
    this.observacion = '';
    this.cambiarVistaDetalles();
    // Remover la clase 'btn-active' de todos los botones
    const botones = document.querySelectorAll('.btn-aprobar, .btn-rechazar');
    botones.forEach(boton => {
      boton.classList.remove('btn-active');
      boton.classList.add('btn-inactive');
    });

    // Agregar la clase 'btn-active' solo al botón de Rechazado
    const botonRechazado = document.querySelector('.btn-rechazar');
    botonRechazado?.classList.add('btn-active');
  }

  guardarap() {
    if (this.estadoEvi == 'Rechazada') {
      this.ModificarTarea();
      this.verificar = false;
      this.notificarrechazo();
      this.notificarrechazoadmin();
      this.notificarrechazouser();
    } else if (this.estadoEvi == 'Aprobada') {
      this.ModificarTarea();
      this.notificaraprob();
      this.notificaraprobadmin();
      this.notificaraprobuser();
    } else {
      Swal.fire(
        'La actividad fue rechazada',
        'Debe enviar el correo con la observación',
        'warning'
      );
    }
  }



  Eliminar(element: any) {
    const id = element.id_detalle_evaluacion;
    Swal.fire({
      title: 'Desea eliminarlo?',
      text: 'No podrá revertirlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.detalleEvaluaService.eliminar(id).subscribe((response) => {
          this.Listar();
        });
        Swal.fire('Eliminado!', 'Registro eliminado.', 'success');
      }
    });
  }

  enviar() {
    this.enviado = true;
    this.isLoading = true;
    const startTime = new Date(); // Obtener hora actual antes de enviar el correo
    this.isSending = true;
    this.spinnerInterval = setInterval(() => {
      const endTime = new Date(); // Obtener hora actual cada segundo mientras se envía el correo
      const timeDiff = (endTime.getTime() - startTime.getTime()) / 1000; // Calcular diferencia de tiempo en segundos
      this.spinnerValue = Math.round((timeDiff / this.maxTime) * 100); // Calcular porcentaje del tiempo máximo y actualizar valor del spinner
      if (timeDiff >= this.maxTime) {
        // Si se alcanza el tiempo máximo, detener el spinner
        clearInterval(this.spinnerInterval);
      }
    }, 1000);

    this.emailService
      .sendEmail([this.toUser], this.subject, 'Evidencia: ' + this.evid.descripcionevidencia + '\n' + 'Comentarios: ' + this.message)
      .subscribe(
        (response) => {
          clearInterval(this.spinnerInterval); // Detener el spinner al completar el envío
          this.isSending = false;
          const endTime = new Date(); // Obtener hora actual después de enviar el correo
          const timeDiff = (endTime.getTime() - startTime.getTime()) / 1000; // Calcular diferencia de tiempo en segundos
          this.verificar = true;
          console.log(
            'Email sent successfully! Time taken:',
            timeDiff,
            'seconds'
          );
          console.log('Email sent successfully!');
          Swal.fire({
            title: 'El correo se ha enviado con éxito',
            timer: 2000,
            timerProgressBar: true,
            width: '20%',
            customClass: 'custom-alert',
            position: 'top-end',
            iconHtml:
              '<span class="custom-icon"><i class="fas fa-check-circle" style="color: green;" ></i></span>',
            showConfirmButton: false,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          this.isLoading = false;
        },
        (error: any) => {
          clearInterval(this.spinnerInterval); // Detener el spinner si ocurre un error
          this.isSending = false;

          Swal.fire({
            title: 'No se pudo enviar el correo electrónico',
            timer: 2000,
            width: '20%',
            customClass: 'custom-alert my-custom-swal',
            timerProgressBar: true,
            position: 'top-end',
            iconHtml:
              '<span class="custom-icon" ><i class="fas fa-times-circle" style="color: red;" ></i></span>',

            showConfirmButton: false,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          this.isLoading = false;
          console.error('Error sending email:', error);
        }
      );
  }

  setEvidenciaRechazada(element: any) {
    this.id_evidencia = element.id_evidencia;

    this.actividadService.getEviAsig(this.id_evidencia, this.modeloVigente.id_modelo)
      .subscribe((asignaciones: Asigna_Evi[]) => {
        if (asignaciones && asignaciones.length > 0) {
          // Obtener la fecha fin
          const fechaFinalObtenida = asignaciones[0].fecha_fin;
          const fechaFinal = new Date(Number(fechaFinalObtenida));
          // Obtener la fecha de inicio
          const fechaInicioObtenida = asignaciones[0].fecha_inicio;
          const fechaInicio = new Date(Number(fechaInicioObtenida));
          // Formatear las fechas
          const formattedFechaInicio = `${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getFullYear()}`;
          const formattedFechaFinal = `${fechaFinal.getDate()}/${fechaFinal.getMonth() + 1}/${fechaFinal.getFullYear()}`;

          this.asignar.fecha_fin = fechaFinal;
          this.asignar.fecha_inicio = fechaInicio;

          // Almacena la fecha final obtenida
          this.fechaFinalObtenida = fechaFinal;
          console.log('Fecha inicial obtenida: ', formattedFechaInicio);
          console.log('Fecha final obtenida: ', formattedFechaFinal);
        }
      }, error => {
        console.error('Error al obtener la fecha final:', error);
      });
  }

  setEvidenciaUsuario(element: any) {
    this.id_evidencia = element.id_evidencia;
    this.descripcionSeleccionada = element.descripcionevidencia;
    this.obtenerUsuariosResponsables();
  }

  guardarFechaPlazo() {
    if (this.asignar.fecha_fin == null) {
      Swal.fire('Advertencia', `Debe llenar el campo`, 'warning');
      return;
    }

    if (this.asignar.fecha_fin < this.asignar.fecha_inicio) {
      Swal.fire('Advertencia', 'La fecha final no puede ser anterior a la fecha inicial', 'warning');
      return;
    }

    if (this.asignar.fecha_fin.getTime() === this.fechaFinalObtenida.getTime()) {
      Swal.fire('Advertencia', 'La fecha final es la misma actualmente', 'warning');
      return;
    }

    Swal.fire({
      title: 'Actualizar',
      text: "Se asignará una fecha plazo para esta asignación",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.actividadService.getEviAsig(this.id_evidencia, this.modeloVigente.id_modelo).subscribe((asignaciones) => {
          if (asignaciones && asignaciones.length > 0) {
            const asignacion = asignaciones[0];
            // Crear objeto asigedit y copiar las propiedades necesaria
            let asigedit: Asigna_Evi = new Asigna_Evi();
            asigedit.id_asignacion_evidencia = asignacion.id_asignacion_evidencia;
            asigedit.fecha_inicio = asignacion.fecha_inicio;
            asigedit.fecha_fin = this.asignar.fecha_fin;
            this.asignarEvidenciaService.editarAsigna(asigedit).subscribe((response) => {
              Swal.fire('Actualizado!', 'Se asignó una fecha plazo.', 'success');
            });
            this.isLoading = false;
          } else {
            Swal.fire('Error', 'No se encontró la asignación.', 'error');
          }
          this.isLoading = false;
        });
      }
    });
  }
  guardarCambioUsuario(): void {
    if (!this.selectedUser || !this.id_evidencia) {
      Swal.fire('Advertencia', 'No se ha seleccionado un usuario', 'warning');
      return;
    }
    this.isLoading = true;
    this.asignarEvidenciaService.cambiarUsuario(this.id_evidencia, this.selectedUser.id, this.modeloVigente.id_modelo).subscribe(
      (response: any) => {
        Swal.fire('Éxito', 'Usuario de la evidencia cambiado correctamente', 'success');
        this.listaResponsable();
        // Extraer el nombre del usuario seleccionado
        const nombreUsuario = this.selectedUser.persona.primer_nombre + ' ' + this.selectedUser.persona.primer_apellido;
        const usuarioId = this.selectedUser.id;
        this.notificarCambio(nombreUsuario);
        this.notificarcambioadmin(nombreUsuario);
        this.notificarcambiouser(usuarioId);
        this.isLoading = false;
      },
      (error) => {
        if (error.status === 400) {
          Swal.fire('Advertencia', 'El usuario seleccionado ya está asignado a esta evidencia', 'warning');
        } else {
          console.log(error);
          Swal.fire('Error', 'Hubo un problema al cambiar el usuario para la evidencia', 'error');
        }
        this.isLoading = false;
      }
    );
  }
  verPDF(enlace: string) {
    if (this.esPDF(enlace)) {
      this.archivo.getFilePDF(enlace).subscribe((data: any) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const unsafeUrl = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
        $('#modalPdf').modal('show');
      },
        error => {
          Swal.fire('Error', 'Hubo un problema al cargar el archivo PDF.', 'error');
        }
      );
    } else {
      Swal.fire('Advertencia', 'El enlace no es un archivo PDF y no se puede visualizar.', 'warning');
    }
  }
  esPDF(enlace: string): boolean {
    return enlace.toLowerCase().endsWith('.pdf');
  }
  Limpiar() {
    this.verificar = false;
    this.message = '';
    this.subject = '';
    this.detalleEvi.observacion = '';
    this.estadoEvi = '';
    this.observacion = '';
    this.cambiarVistaDetalles();
    const botones = document.querySelectorAll('.btn-aprobar, .btn-rechazar');
    botones.forEach(boton => {
      boton.classList.remove('btn-active');
      boton.classList.remove('btn-inactive');
    });
  }
  LimpiarModal() {
    this.verificar = false;
    this.message = '';
    this.subject = '';
    this.detalleEvi.observacion = '';
    this.estadoEvi = '';
    this.observacion = '';

    this.cambiarVistaDetalles();
    const botones = document.querySelectorAll('.btn-aprobar, .btn-rechazar');
    botones.forEach(boton => {
      boton.classList.remove('btn-active');
      boton.classList.remove('btn-inactive');
    });
  }
  truncateDescription(description: string): string {
    const words = description.split(' ');
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '...';
    } else {
      return description;
    }
  }
}
