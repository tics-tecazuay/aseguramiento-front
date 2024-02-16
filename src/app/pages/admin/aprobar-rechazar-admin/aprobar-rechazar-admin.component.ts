import { Usuario2 } from 'src/app/models/Usuario2';
import { Component,  OnInit } from '@angular/core';
import {  ViewChild } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Evidencia } from 'src/app/models/Evidencia';
import { EmailServiceService } from 'src/app/services/email-service.service';
import { Criterio } from 'src/app/models/Criterio';
import { CriteriosService  } from 'src/app/services/criterios.service';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import { DetalleEvaluacionService } from 'src/app/services/detalle-evaluacion.service';
import { detalleEvaluacion } from 'src/app/models/DetalleEvaluacion';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { proyeccionCriterio } from './proyecciones-testeo/proyeccionCriterio';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CalificacionComponent } from '../../superadmin/modelo/matriz-evaluacion/calificacion/calificacion.component';

@Component({
  selector: 'app-aprobar-rechazar-admin',
  templateUrl: './aprobar-rechazar-admin.component.html',
  styleUrls: ['./aprobar-rechazar-admin.component.css'],
})
export class AprobarRechazarAdminComponent implements OnInit {
  columnas: string[] = ['id', 'nombre', 'subcriterio','indicadores','descripcion', 'actions'];
  verificar:boolean=false;
  columnasDetalle: string[] = [
    'iddetalle',
    'evi',
    'observacion',
    'estado',
    'fecha',
    'usua',
    'actions',
  ];
  dataSource = new MatTableDataSource<Evidencia>();
  dataSource4 = new MatTableDataSource<detalleEvaluacion>();
  noRegistros: any;
  mostrarBoton = false;
  idUsuario: number = 0;
  isLoading: boolean = false;
  idevi!:number;
  usuarioResponsable: Usuario2[] = [];
  //idEvidencia: number = Number(localStorage.getItem('idUsuario'));
  idEvidencia: number = 0;
  idFilter = new FormControl();
  filterPostid = 0;
  idBuscado = '';
  usuarioSeleccionado: Usuario2 = new Usuario2();
  evidencias!: Evidencia[];
  Evidencia :Evidencia= new Evidencia();
  filterPost = '';
  isSending = false;
  spinnerValue = 0;
  ocultar=false;
  spinnerInterval: any;
  mostrar = false;
  maxTime: number = 30;
  sent: boolean = false;
  toUser: string = '';
  subject: string = '';
  message: string = '';
  isLoggedIn = false;
  user: any = null;
  rol: any = null;
  noti = new Notificacion();
  idusuario: any = null;
  id_modelo!:number;
  nombre: any = null;
  nombreev:any=null;
  aprobado: boolean=false;
  descripcionSeleccionada: any=null;
  fechaActual: Date = new Date();
  fechaFormateada: string = this.fechaActual.toLocaleDateString('es-ES');
  correoEnviar = '';
  estadoEvi = 'PENDIENTE';
  public evid = new Evidencia();
  public evidDetalle = new Evidencia();
  evidenciaModificar: any;
  disableVerDetalles: boolean = false;
  disableEvaluar: boolean = false;
  observacion = '';
  detalleEvi: detalleEvaluacion = new detalleEvaluacion();
  listadodetalleEval: detalleEvaluacion[] = [];

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  
  constructor(
    private evidenciaService: EvidenciaService,
    private router: Router, private dialog: MatDialog,
    private emailService: EmailServiceService,
    public login: LoginService,
    private notificationService: NotificacionService,
    private detalleEvaluaService: DetalleEvaluacionService,
    private criteriosService: CriteriosService
  ) {
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
  }

  ngOnInit(): void {
    
    this.listaResponsable();
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
      
    });
    this.modeloMax();
    localStorage.removeItem("eviden");
  }
  
  modeloMax() {
    this.criteriosService.getModeMaximo().subscribe((data) => {

      this.id_modelo =data.id_modelo;});
    }

  calificar(element:any){
    this.idevi=element.id_evidencia;
    this.evidenciaService.getevical(this.idevi,this.id_modelo).subscribe(data => {
      console.log("Datos ev "+JSON.stringify(data));
      const tipo:any = data.tipo;
      const id: any = data.id_in;
      const peso:any=data.peso;
    
      console.log("tipo "+tipo+" id ind "+id+" peso "+peso);
      
       this.evaluar(tipo,id,peso);
    });  
  }

  evaluar(valor: any, id: any, peso: any): void {
    console.log("tipo "+valor+" id ind "+id+" peso "+peso);
    const dialogRef = this.dialog.open(CalificacionComponent, {
      data: { valor, id, peso },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.event == 'success') {
        console.log(result);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Calificación registrada',
          showConfirmButton: true,
          timer: 1500
        })
      }
    });
  }

  applyFilter() {
    const filterValue = this.idFilter.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //rechazos
  notificarrechazo() {
    this.noti.fecha = new Date();
    this.noti.rol = 'SUPERADMIN';
    const nombres = localStorage.getItem('nombres');
    this.noti.mensaje =
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' ha rechazado la evidencia ' +
      this.descripcionSeleccionada +
      ' de ' +
      nombres;
    this.noti.usuario = 0;
    this.noti.url="/sup/aprobaciones";
    this.noti.idactividad=0;
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
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' ha rechazado tu evidencia ' 
      +this.descripcionSeleccionada;
    this.noti.visto = false;
    this.noti.url="/res/evidenasignada";
this.noti.idactividad=0;
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
    console.log("Nombres usuario "+nombres );
    this.noti.mensaje =
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' ha rechazado la evidencia ' +
      this.descripcionSeleccionada +
      ' de ' +
      nombres;
    this.noti.visto = false;
    this.noti.usuario = 0;
    this.noti.url="/adm/apruebaAdmin";
    this.noti.idactividad=0;
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

//aceptar
notificaraprob() {
  this.noti.fecha = new Date();
  this.noti.rol = 'SUPERADMIN';
  const nombres = localStorage.getItem('nombres');
  this.noti.mensaje =
    this.user.persona.primer_nombre +
    ' ' +
    this.user.persona.primer_apellido +
    ' ha aprobado la evidencia ' +
    this.descripcionSeleccionada +
    ' de ' +
    nombres;
  this.noti.usuario = 0;
  this.noti.url="/sup/aprobaciones";
  this.noti.idactividad=0;
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
    this.user.persona.primer_nombre +
    ' ' +
    this.user.persona.primer_apellido +
    ' ha aprobado tu evidencia ' 
    +this.descripcionSeleccionada;
  this.noti.visto = false;
  this.noti.url="/res/evidenasignada";
this.noti.idactividad=0;
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
  console.log("Nombres usuario "+nombres );
  this.noti.mensaje =
    this.user.persona.primer_nombre +
    ' ' +
    this.user.persona.primer_apellido +
    ' ha aprobado la evidencia ' +
    this.descripcionSeleccionada +
    ' de ' +
    nombres;
  this.noti.visto = false;
  this.noti.usuario = 0;
this.noti.url="/adm/apruebaAdmin";
this.noti.idactividad=0;
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
//
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
    this.evidenciaService
      .geteviasig(this.usuarioSeleccionado.username)
      .subscribe((data) => {
        this.evidencias = data;
        this.dataSource.data = this.evidencias;
        this.isLoading = false;
      });

    console.log(this.evidencias);
    this.mostrarBoton = true;
    this.correoEnviar = this.usuarioSeleccionado.persona.correo;
    this.toUser = this.correoEnviar;
  }

  listaResponsable() {
    this.isLoading = true;
    this.evidenciaService.listarUsuario().subscribe((data) => {
      const usuariosFiltrados = data.filter(
        (usuario, index, self) =>
          index === self.findIndex((u) => u.id === usuario.id)
      );
      this.usuarioResponsable = usuariosFiltrados;
      this.isLoading = false;
    });
  }

  verDetalles(evidencia: any) {
    console.log("id ev "+evidencia.id_evidencia);
    this.router.navigate(['/adm/detalleAprobarRechazar'], {
      state: { data: evidencia, usuarioEnviar: this.usuarioSeleccionado },
    });
   
  }



  seleccionarTarea(element: any) {
      this.evid = element;
  }

  seleccionarTareaDetalle(element: any) {
    this.evidDetalle = element;
    this.detalleEvaluaService
      .getDetalleEvi(this.evidDetalle.id_evidencia)
      .subscribe(
        (detalles) => {
          this.listadodetalleEval = detalles;
          console.log(detalles)
           this.dataSource4.data = detalles;         
        },
        (error) => {
          console.log(error);
        }
      );

      this.Listar();
}

Listar(){
  this.noRegistros = null;
  this.detalleEvaluaService.getDetalleEvi(this.evidDetalle.id_evidencia)
  .subscribe(
    (detalles) => {
       if(detalles.length>0)
       {
        this.listadodetalleEval = detalles;   
        this.dataSource4.data = detalles;  
 
       }else{
         this.noRegistros = 'No hay registros disponibles.';
 
       }
    },
    (error) => {
      console.log(error);
    }
  );
}

enviar() {
  
  this.notificarrechazo();
    this.notificarrechazoadmin();
    this.notificarrechazouser();
  // Antes de enviar el correo electrónico, asegúrate de que la notificación esté lista
  // Puedes crear la notificación aquí o en cualquier otro lugar según tu estructura
  const notificacion = {
    destinatarios: [this.toUser],
    mensaje: 'Correo enviado con éxito',
    // Otros campos de notificación
  };

  // Envía el correo electrónico
  this.emailService.sendEmail([this.toUser], this.subject, this.message)
    .subscribe(
      (response) => {
        // El correo electrónico se envió con éxito
        // Ahora, después del éxito del correo, puedes enviar la notificación
        this.enviarNotificacion(notificacion);
      },
      (error) => {
        // El envío del correo electrónico falló, maneja el error aquí si es necesario
        console.error('Error sending email:', error);
      }
    );
}

enviarNotificacion(notificacion: any) {
  // Aquí puedes llamar a tu servicio de notificaciones para enviar la notificación
  // Utiliza el objeto 'notificacion' que pasaste como argumento

  this.notificationService.crear(notificacion).subscribe(
    (data: any) => {
      this.verificar=true;
      console.log('Notificación enviada con éxito');
      // Realiza cualquier otra acción necesaria después de enviar la notificación
    },
    (error: any) => {
      console.error('No se pudo enviar la notificación', error);
      // Maneja el error si es necesario
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

  guardarap(){
    if(this.estadoEvi=='Rechazada'){
      this.ModificarTarea();
   this.verificar=false;
    } else if(this.estadoEvi=='Aprobada'){
      this.ModificarTarea();
      
    } else {
      Swal.fire(
        'La actividad fue rechazada',
        'Debe enviar el correo con la observación',
        'warning'
      );
      
    }
  }

  Aprobado(descripcion:any) {
    this.descripcionSeleccionada = descripcion.descripcion;
    console.log("id Evidencia "+descripcion.id_evidencia);
   this.aprobado = true;
    this.verificar=true;
    Swal.fire({
      icon: 'success',
      title: 'La tarea ha sido aprobada',
      showConfirmButton: false,
      timer: 1500,
    });
    this.mostrar = false;
    this.estadoEvi = 'Aprobada';
    this.observacion = 'Ninguna';
    this.notificaraprob();
    this.notificaraprobadmin();
    this.notificaraprobuser();
  }

  Rechazado(descripcion:any) {
    this.aprobado = false;
    this.descripcionSeleccionada = descripcion.descripcion;
    Swal.fire({
      icon: 'error',
      title: 'La tarea ha sido rechazada.',
    });
    this.estadoEvi = 'Rechazada';
    this.mostrar = !this.mostrar;
    this.observacion = '';
    this.verificar=false;
    
  }
 



  ModificarTarea() {
   
    this.detalleEvi.evidencia.id_evidencia = this.evid.id_evidencia;
    this.detalleEvi.usuario.id = this.user.id;
    this.detalleEvi.observacion=this.observacion;
    this.detalleEvi.id_modelo=this.id_modelo;
    if (this.aprobado) {
      this.evid.estado = this.estadoEvi;
      if(this.evid.estado=='Aprobada'){
this.detalleEvi.estado=true;

      }else{
        this.detalleEvi.estado=false;

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
        .actualizar(this.evid.id_evidencia, this.evid)
        .subscribe(
          (response: any) => {
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
    }else if (
      this.detalleEvi.estado != null &&
      this.detalleEvi.observacion != null &&
      this.detalleEvi.observacion != ''
    ) {
      this.evid.estado = this.estadoEvi;
      if(this.evid.estado=='Aprobada'){
this.detalleEvi.estado=true;

      }else{
        this.detalleEvi.estado=false;

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
        .actualizar(this.evid.id_evidencia, this.evid)
        .subscribe(
          (response: any) => {
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
        'Porfavor agregue alguna',
        'warning'
      );
    }
    this.LimpiarModal();
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
          
          this.Listar()
        });
        Swal.fire('Eliminado!', 'Registro eliminado.', 'success');
      }
    });
  }
 /* enviar() {
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
      .sendEmail([this.toUser], this.subject, this.message)
      .subscribe(
        (response) => {
          clearInterval(this.spinnerInterval); // Detener el spinner al completar el envío
          this.isSending = false;
          const endTime = new Date(); // Obtener hora actual después de enviar el correo
          const timeDiff = (endTime.getTime() - startTime.getTime()) / 1000; // Calcular diferencia de tiempo en segundos
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
        },
        (error) => {
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

          console.error('Error sending email:', error);
        }
      );
  }*/

  Limpiar() {
    this.message = '';
    this.subject = '';
    this.detalleEvi.observacion = '';
  }

  LimpiarModal() {
    this.mostrar = false;
    this.verificar=false;
    this.estadoEvi = '';
    this.subject = '';
    this.detalleEvi.observacion = '';
    this.message = '';
  }

}
