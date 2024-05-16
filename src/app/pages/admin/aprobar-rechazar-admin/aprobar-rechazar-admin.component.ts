import { Usuario2 } from 'src/app/models/Usuario2';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Evidencia } from 'src/app/models/Evidencia';
import { EmailServiceService } from 'src/app/services/email-service.service';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import { DetalleEvaluacionService } from 'src/app/services/detalle-evaluacion.service';
import { detalleEvaluacion } from 'src/app/models/DetalleEvaluacion';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { FormControl } from '@angular/forms';
import { Asigna_Evi } from 'src/app/models/Asignacion-Evidencia';
import { ActividadService } from 'src/app/services/actividad.service';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';
import { ArchivoAdmSupProjection } from 'src/app/models/Archivo';
import { ArchivoService } from 'src/app/services/archivo.service';
import { EvidenciaEvProjection } from 'src/app/interface/EvidenciasProjection';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UsuariorolService } from 'src/app/services/usuariorol.service';
import { Asigna_EviDTO } from 'src/app/models/Asignacion-EvidenciaDTO';
import { Modelo } from 'src/app/models/Modelo';

declare var $: any;

@Component({
  selector: 'app-aprobar-rechazar-admin',
  templateUrl: './aprobar-rechazar-admin.component.html',
  styleUrls: ['./aprobar-rechazar-admin.component.css'],
})
export class AprobarRechazarAdminComponent implements OnInit {
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
  columnasArchi: string[] = ['nombreArchi', 'descripcionArchi', 'comentario', 'enlace', 'visualizar'];
  dataSource = new MatTableDataSource<EvidenciaEvProjection>();
  dataSource4 = new MatTableDataSource<detalleEvaluacion>();
  verificar: boolean = false;
  noRegistros: any;
  idUsuario: number = 0;
  idAdmin!: number;
  isLoading: boolean = false;
  usuarioResponsable: Usuario2[] = [];
  enviado = false;
  idFilter = new FormControl();
  usuarioSeleccionado: Usuario2 = new Usuario2();
  evidencias!: EvidenciaEvProjection[];
  Evidencia: Evidencia = new Evidencia();
  filterPost = '';
  isSending = false;
  spinnerValue = 0;
  ocultar = false;
  spinnerInterval: any;
  maxTime: number = 30;
  sent: boolean = false;
  toUser: string = '';
  subject: string = '';
  message: string = '';
  isLoggedIn = false;
  user: any = null;
  rol: any = null;
  noti = new Notificacion();
  id_modelo!: number;
  nombre: any = null;
  aprobado: boolean = false;
  descripcionSeleccionada: any = null;
  fechaActual: Date = new Date();
  fechaFormateada: string = this.fechaActual.toLocaleDateString('es-ES');
  correoEnviar = '';
  estadoEvi = '';
  evid!: EvidenciaEvProjection;
  public evidDetalle = new Evidencia();
  observacion = '';
  detalleEvi: detalleEvaluacion = new detalleEvaluacion();
  listadodetalleEval: detalleEvaluacion[] = [];
  asignar: Asigna_Evi = new Asigna_Evi();
  idasigna!: number;
  usuariosResponsables: any[] = [];
  selectedUser: any;
  fechaFinalObtenida: Date = new Date();
  estadoSeleccionado: boolean = false;
  titulo = 'RESPONSABLE AUN NO SELECCIONADO';
  responsable = '';
  usernameResponsable!: string;

  inicio: any;
  fin: any;
  fechaInicioObtenida: Date = new Date();
  asigedit = new Asigna_Evi();
  asignacionevidencia: Asigna_EviDTO[] = [];
  modeloVigente!: Modelo;
  asignacion_evidencia_seleccionada!: Asigna_Evi;

  ////////
  descripcionEvi = '';
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  id_asig_evid!: number;
  verModalArchivo: boolean = false;
  verModalDetalles: boolean = true;

  nombreCompleto = '';
  // modal de archivos y evidencia

  listadoActividad: Asigna_Evi[] = [];
  panelOpenState = false;
  archivoSe: ArchivoAdmSupProjection[] = [];
  dataSource2 = new MatTableDataSource<ArchivoAdmSupProjection>();
  nombreActividad = '';

  idasig_evi!: number; // id de la asignacion evidencia para eliminar

  pdfUrl: SafeResourceUrl | undefined;

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private evidenciaService: EvidenciaService,
    private router: Router,
    private emailService: EmailServiceService,
    public login: LoginService,
    private notificationService: NotificacionService,
    private detalleEvaluaService: DetalleEvaluacionService,
    private actividadService: ActividadService,
    private asignarEvidenciaService: AsignaEvidenciaService,
    private archivo: ArchivoService,
    private usuarioRolService: UsuariorolService,
    private sanitizer: DomSanitizer
  ) { }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
    this.idAdmin = this.user.id;
    const data = history.state.data;
    this.usernameResponsable = data;
    console.log('USERNAME ', this.usernameResponsable);

    this.modeloMax();
    //Directamente guardar en el objeto notificacion el modelo
    this.noti.id_modelo = this.id_modelo;

    this.cargarUsuarioResponsable();
    localStorage.removeItem('eviden');
  }

  modeloMax() {
    this.modeloVigente = JSON.parse(localStorage.getItem('modelo') || '{}');
    this.id_modelo = this.modeloVigente.id_modelo;
    this.inicio = this.modeloVigente.fecha_inicio;
    this.fin = this.modeloVigente.fecha_fin;
  }

  verResponsables() {
    this.router.navigate(['/adm/asignaEvidencia']);
  }

  cargarUsuarioResponsable() {
    this.usuarioRolService.buscaruserbyusername(this.usernameResponsable).subscribe((data) => {
      this.usuarioSeleccionado = data;
      this.listarEvidenciasResponsable();
      console.log('Usuario responsable:', this.usuarioSeleccionado);
    });
  }

  listarEvidenciasResponsable() {
    this.isLoading = true;
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
      this.responsable = this.nombreCompleto = this.usuarioSeleccionado.persona.primer_nombre + ' ' + this.usuarioSeleccionado.persona.segundo_nombre + ' ' + this.usuarioSeleccionado.persona.primer_apellido + ' ' + this.usuarioSeleccionado.persona.segundo_apellido;
      this.evidenciaService
        .buscarEvidenciaPorCriterio(this.usuarioSeleccionado.username, this.user.id, this.id_modelo)
        .subscribe((data) => {
          this.evidencias = data;
          this.dataSource.data = this.evidencias;
          this.isLoading = false;
          console.log("evidencias: ", this.evidencias);
        });
    } else {
      this.estadoSeleccionado = false;
      this.titulo;
    }
    this.nombreCompleto = this.usuarioSeleccionado.persona.primer_nombre + ' ' + this.usuarioSeleccionado.persona.primer_apellido;
    this.correoEnviar = this.usuarioSeleccionado.persona.correo;
    this.toUser = this.correoEnviar;
  }

  buscarUsuario(usuarios: any[], filtro: string): any[] {
    // Implementa la lógica de filtrado, puedes adaptarla según tus necesidades
    return usuarios.filter(
      (usuario) =>
        usuario.persona.primer_nombre
          .toLowerCase()
          .includes(filtro.toLowerCase()) ||
        usuario.persona.primer_apellido
          .toLowerCase()
          .includes(filtro.toLowerCase())
    );
  }

  applyFilterr() {
    const filteredUsers = this.buscarUsuario(
      this.usuarioResponsable,
      this.filterPost
    );
    this.dataSource = new MatTableDataSource(filteredUsers);
  }

  applyFilterActividades() {
    const filterValue = this.idFilter.value.trim().toLowerCase();
    this.applyFilter(filterValue);
  }

  applyFilter(filterValue: string) {
    // Convertimos el filtro a minúsculas y eliminamos espacios adicionales
    filterValue = filterValue.trim().toLowerCase();

    // Aplicamos el filtro a la fuente de datos
    this.dataSource.filter = filterValue;

    // Verificamos si la fuente de datos tiene alguna fila después de aplicar el filtro
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // eliminar asignacion
  eliminarAsignacion(element: any) {
    this.idasigna = element.id_evidencia; // id de la evidencia para eliminar
    this.actividadService.getactivievid(this.usernameResponsable, this.idasigna, this.id_modelo).subscribe((data) => {
      this.asignacionevidencia = data;
      this.idasig_evi = this.asignacionevidencia[0].id_asignacion_evidencia;
      this.descripcionEvi = this.asignacionevidencia[0].descripcion_evidencia;
    });
    Swal.fire({
      title: 'Desea eliminarlo?',
      text: "No podrá revertirlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarEvidenciaAsig(this.idasig_evi, this.idasigna, this.idAdmin, this.id_modelo, this.descripcionEvi);
      }
    });
  }

  eliminarEvidenciaAsig(idAsignacion: number, idEvidencia: number, idAdministrador: number, idModelo: number, descrip: string) {
    this.asignarEvidenciaService.eliminasigna(idAsignacion, idEvidencia, idAdministrador, idModelo).subscribe(
      (response) => {
        this.notificarelimadmin(descrip);
        this.notificarelsupern(descrip);
        this.listarEvidenciasResponsable();
        Swal.fire('Eliminado!', 'Registro eliminado.', 'success');
      },
      (error) => {
        console.error('Error al eliminar el registro:', error);
        Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
      }
    );

  }

  notificarelimadmin(descripcion: string) {
    this.noti.fecha = new Date();
    this.noti.rol = "ADMIN";
    this.noti.mensaje = this.user.persona.primer_nombre + " " + this.user.persona.primer_apellido + " has eliminado la asignacion de la evidencia " + descripcion
      + " a " + this.responsable;
    this.noti.visto = false;
    this.noti.usuario = 0;
    this.noti.url = "/adm/asignaEvidencia";
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
  notificarelsupern(descripcion: string) {
    this.noti.fecha = new Date();
    this.noti.rol = "SUPERADMIN";
    this.noti.mensaje = this.user.persona.primer_nombre + " " + this.user.persona.primer_apellido + " ha eliminado la asignacion de la evidencia " + descripcion
      + " a " + this.responsable;
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

  //Editar ambas fechas de asignacion
  EditarAsigna(element: any) {
    this.idasigna = element.id_evidencia;

    this.actividadService.getEviAsig(this.idasigna, this.modeloVigente.id_modelo)
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
          this.fechaInicioObtenida = fechaInicio;
          console.log('Fecha Inicial obtenida: ', formattedFechaInicio);
          console.log('Fecha Final obtenida: ', formattedFechaFinal);
        }

      }, error => {
        console.error('Error al obtener las fechas:', error);
      });
  }

  //metodo que actualiza las dos fechas
  Actualizarfecha() {

    if (this.asignar.fecha_fin == null) {
      Swal.fire('Advertencia', `El campo fecha fin no puede estar vacío`, 'warning');
      return;
    }

    if (this.asignar.fecha_inicio == null) {
      Swal.fire('Advertencia', `El campo fecha inicio no puede estar vacío`, 'warning');
      return;
    }

    if (this.asignar.fecha_fin < this.asignar.fecha_inicio) {
      Swal.fire('Advertencia', 'La fecha final no puede ser anterior a la fecha inicial', 'warning');
      return;
    }

    if (this.asignar.fecha_inicio.getTime() === this.fechaInicioObtenida.getTime() &&
      this.asignar.fecha_fin.getTime() === this.fechaFinalObtenida.getTime()) {
      Swal.fire('Advertencia', 'No se han realizado cambios en las fechas', 'warning');
      return;
    }

    Swal.fire({
      title: 'Actualizar',
      text: "Se cambiaran las fechas de esta asignación",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.actividadService.getEviAsig(this.idasigna, this.modeloVigente.id_modelo).subscribe((asignaciones) => {
          if (asignaciones && asignaciones.length > 0) {
            const asignacion = asignaciones[0];
            // Crear objeto asigedit y copiar las propiedades necesaria
            let asigedit: Asigna_Evi = new Asigna_Evi();
            asigedit.id_asignacion_evidencia = asignacion.id_asignacion_evidencia;
            asigedit.fecha_inicio = this.asignar.fecha_inicio;
            asigedit.fecha_fin = this.asignar.fecha_fin;
            this.asignarEvidenciaService.editarAsigna(asigedit).subscribe((response) => {
              Swal.fire('Actualizado!', 'Se modificó las fechas.', 'success');
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

  //listar los archivos 
  listarArchivo(id_asignacion_evidencia: number) {
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

  obtenerNombreArchivo(url: string): string {
    const nombreArchivo = url.substring(url.lastIndexOf('/') + 1);
    return nombreArchivo;
  }

  cambiarVistaDetalles() {
    this.verModalDetalles = true;
    this.verModalArchivo = false;
  }

  formatoFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
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

  //correo 
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

  //Evaluar es decir carga los datos para aprobar o rechazar
  seleccionarTarea(element: any) {
    this.evid = element;
    this.idasigna = element.id_evidencia;
    this.descripcionEvi = element.descripcionevidencia;
    console.log("ID ASIGNACION_EVIDENCIA " + this.idasigna);

    this.actividadService.getEviAsig(this.idasigna, this.modeloVigente.id_modelo).subscribe((data) => {

      this.asignacion_evidencia_seleccionada = data[0];
      this.listadoActividad = data;

      this.id_asig_evid = this.listadoActividad[0].id_asignacion_evidencia;
      console.log('este es el id ', this.id_asig_evid);

      // Convertir las fechas a objetos Date
      if (this.listadoActividad[0].fecha_inicio && this.listadoActividad[0].fecha_fin) {
        this.fechaInicio = new Date(this.listadoActividad[0].fecha_inicio);
        this.fechaFin = new Date(this.listadoActividad[0].fecha_fin);
        console.log("Fecha inicio (después):", this.fechaInicio);
        console.log("Fecha fin (después):", this.fechaFin);
      }
    });
  }

  guardarap() {
    if (this.estadoEvi == 'Rechazada') {
      this.ModificarTarea();
      this.notificarrechazo();
      this.notificarrechazoadmin();
      this.notificarrechazouser();
      this.verificar = false;
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

  Aprobado(descripcion: any) {
    this.descripcionSeleccionada = descripcion.descripcionevidencia;
    this.aprobado = true;
    this.subject = "EVIDENCIA APROBADA - " + this.evid.nombreindicador;
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

  //notificar aprobaciones
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

  notificaraprobadmin() {
    this.noti.fecha = new Date();
    this.noti.rol = 'ADMIN';
    const nombres = localStorage.getItem('nombres');
    console.log('Nombres usuario ' + nombres);
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
    this.noti.url = '/adm/asignaEvidencia';
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

  Rechazado(descripcion: any) {
    this.aprobado = false;
    this.subject = "EVIDENCIA RECHAZADA - " + this.evid.nombreindicador;
    this.descripcionSeleccionada = descripcion.descripcionevidencia;
    Swal.fire({
      icon: 'error',
      title: 'La tarea ha sido rechazada.',
    });
    this.estadoEvi = 'Rechazada';
    this.observacion = '';
    this.verificar = false;
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

  //notificar rechazos
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
    this.noti.url = '/adm/asignaEvidencia';
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

  // actualizar el estado de la asignacion de la evidencia
  ModificarTarea() {
    this.detalleEvi.evidencia.id_evidencia = this.evid.id_evidencia;
    this.detalleEvi.usuario.id = this.user.id;
    this.detalleEvi.observacion = this.observacion;
    this.detalleEvi.id_modelo = this.id_modelo;
    if (this.aprobado) {
      this.evid.estado = this.estadoEvi;
      this.asignacion_evidencia_seleccionada.estado = this.estadoEvi;
      console.log('Estado asignacion evi:', this.asignacion_evidencia_seleccionada);
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

  // abre el modal para las observaciones
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

  //lista las observaciones
  Listar() {
    this.noRegistros = null;
    this.detalleEvaluaService
      .getDetalleEvi(this.evidDetalle.id_evidencia, this.id_modelo)
      .subscribe(
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

  //eliminar las observaciones
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

  // cargar fecha para dar plazo 
  setEvidenciaRechazada(element: any) {
    this.idasigna = element.id_evidencia;

    this.actividadService.getEviAsig(this.idasigna, this.modeloVigente.id_modelo)
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
        this.actividadService.getEviAsig(this.idasigna, this.modeloVigente.id_modelo).subscribe((asignaciones) => {
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

  //Cambiar usuario
  setEvidenciaUsuario(element: any) {
    this.idasigna = element.id_evidencia;
    this.descripcionSeleccionada = element.descripcionevidencia;
    console.log("ID EVIDENCIA " + this.idasigna);
    this.obtenerUsuariosResponsables();
  }

  obtenerUsuariosResponsables(): void {
    this.evidenciaService.getlistadeResponsablesAdmin(this.idAdmin, this.id_modelo).subscribe(
      (data: any[]) => {
        this.usuariosResponsables = data;
        console.log("otro metodo ", data);
      },
      (error) => {
        console.error('Error al obtener usuarios responsables:', error);
      }
    );
  }

  guardarCambioUsuario(): void {
    if (!this.selectedUser || !this.idasigna) {
      Swal.fire('Advertencia', 'No se ha seleccionado un usuario', 'warning');
      return;
    }
    this.isLoading = true;
    this.asignarEvidenciaService.cambiarUsuario(this.idasigna, this.selectedUser.id, this.modeloVigente.id_modelo).subscribe(
      (response: any) => {
        Swal.fire('Éxito', 'Usuario de la evidencia cambiado correctamente', 'success');
        this.listarEvidenciasResponsable();

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

  //notificar cambio de Usuario
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
    this.noti.url = "/adm/asignaEvidencia";
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

  truncateDescription(description: string): string {
    const words = description.split(' ');
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '...';
    } else {
      return description;
    }
  }

  verPDF(enlace: string) {
    if (this.esPDF(enlace)) {
      this.archivo.getFilePDF(enlace).subscribe((data: any) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const unsafeUrl = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
        console.log('Enlace del PDF', this.pdfUrl);
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


}
