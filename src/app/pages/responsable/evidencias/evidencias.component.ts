import { Archivo, ArchivoProjectionRes } from './../../../models/Archivo';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ArchivoService } from 'src/app/services/archivo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Asigna_Evi } from 'src/app/models/Asignacion-Evidencia';
import Swal from 'sweetalert2';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';
import { Modelo } from 'src/app/models/Modelo';


@Component({
  selector: 'app-evidencias',
  templateUrl: './evidencias.component.html',
  styleUrls: ['./evidencias.component.css'],
})
export class EvidenciasResponComponent implements OnInit {
  user: any = null;
  isLoggedIn = false;
  archivos!: ArchivoProjectionRes[];
  filearchivo!: File;
  fileInfos: Observable<ArchivoProjectionRes[]> | undefined;
  noti = new Notificacion();
  isLoading = false;
  formulario: FormGroup;
  archivoCargado = false;
  descripcionEvide!: string;
  idevidencia: number;
  conteoArchivos!: number;
  ocultar = false;
  activ: Asigna_Evi = new Asigna_Evi();
  archi: Archivo = new Archivo();
  estad = '';
  descripcion: string = '';
  veri = true;
  filterPost = '';
  modeloVigente!: Modelo;
  idModel!: number;
  // Crear una fuente de datos para la tabla
  dataSource = new MatTableDataSource<ArchivoProjectionRes>();
  // Encabezados de la tabla
  displayedColumns: string[] = ['Id', 'Evidencia', 'Descripcion', 'Comentario', 'Borrar'];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private asig: AsignaEvidenciaService,
    private archivo: ArchivoService,
    public login: LoginService,
    private notificationService: NotificacionService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      descripcion: ['', Validators.required],
    });
    this.idevidencia = 0; // Inicializa idevidencia según tus necesidades
    //this.ocultar = true;
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngAfterViewInit() {
    console.log('Paginator:', this.paginator);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    //Datos de la sesion
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
    this.modeloVigente = JSON.parse(localStorage.getItem('modelo') || '{}');
    this.idModel = this.modeloVigente.id_modelo;
    //Directamente guardar en el objeto notificacion el modelo
    this.noti.id_modelo = this.modeloVigente.id_modelo;
    //Data traida de la pagina anterior
    const data = history.state.data;
    console.log('data recibida:', data);
    this.idevidencia = data.id_evidencia;
    this.activ = data;
    this.descripcionEvide = data.descripcion_evidencia;
    if (this.activ?.evidencia?.id_evidencia != null) {
      this.idevidencia = data.id_evidencia;
      this.estad = this.activ.evidencia.estado;
      if (this.estad.toLowerCase() == 'aprobada') {
        this.veri = false;
      }
    }
    if (this.activ == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    this.archi = data;
    if (this.archi == undefined) {
      this.router.navigate(['user-dashboard']);
      location.replace('/use/user-dashboard');
    }
    this.listar();
  }

  listar(): void {
    this.isLoading = true;
    this.archivo.getArchivoProjection(this.user.username, this.activ.id_asignacion_evidencia, this.idModel).subscribe((data) => {
      this.archivos = data;
      this.dataSource.data = this.archivos;
      console.log('Data:', data);
      console.log('Ya entre a la lista')
      this.isLoading = false;
    });
  }

  goBack(): void {
    window.history.back();
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.filearchivo = event.target.files[0];
    }
  }

  onUpload(): void {
    this.isLoading = true;
    this.archivo.cargar(this.filearchivo, this.descripcion, this.activ.id_asignacion_evidencia, this.modeloVigente.id_modelo)
      .subscribe(
        (success) => {
          this.archivoCargado = true;
          this.listar(); // Llama a la función de éxito
          this.clearInputFields(); // Llama a la función para limpiar los campos de entrada
        },
        (error) => {
          console.error('Error al subir el archivo:', error);
          this.isLoading = false;
          // Lógica adicional para manejar el error
          Swal.fire({
            title: '¡Error!',
            text: 'Nombre del archivo repetido',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    this.archivoSucess(this.archivoCargado);
  }

  archivoSucess(subido: boolean): void {
    this.isLoading = true;
    if (subido) {
      this.notificar();
      this.notificaradmin();
      // Aquí llamamos al método para actualizar el estado del archivo a true
      this.actualizarEstadoArchivo(true); // Pasamos true para indicar que el archivo se ha subido correctamente
      Swal.fire({
        title: '¡Éxito!',
        text: 'El archivo se ha subido correctamente',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    }
  }

  actualizarEstadoArchivo(estado: boolean): void {
    // Llama al servicio para actualizar el estado del archivo
    this.asig.editarEstadoArch(this.activ.id_asignacion_evidencia, estado).subscribe(
      (data: any) => {
        console.log('Estado del archivo actualizado correctamente:', data);
      },
      (error: any) => {
        console.error('Error al actualizar el estado del archivo:', error);
      }
    );
  }


  notificar() {
    this.isLoading = true;
    this.noti.fecha = new Date();
    this.noti.rol = 'SUPERADMIN';
    this.noti.mensaje =
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' ha subido un archivo ' +
      'para la actividad ' +
      this.descripcionEvide;

    this.noti.visto = false;
    this.noti.usuario = 0;
    this.noti.url = '/sup/detalle';
    this.noti.idactividad = this.idevidencia;
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

  notificaradmin() {
    this.isLoading = true;
    this.noti.fecha = new Date();
    this.noti.rol = 'ADMIN';
    this.noti.mensaje =
      this.user.persona.primer_nombre +
      ' ' +
      this.user.persona.primer_apellido +
      ' ha subido un archivo ' +
      'para la actividad ' +
      this.descripcionEvide;
    this.noti.visto = false;
    this.noti.usuario = 0;
    this.noti.url = '/adm/asignaEvidencia';
    this.noti.idactividad = this.idevidencia;
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

  elim(nom: string, id: any) {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro de que quieres eliminar ' + nom + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Cambia isLoading a true antes de iniciar la eliminación
        this.isLoading = true;
        // Elimina el archivo
        this.eliminar(nom);
        // Elimina los registros relacionados
        this.eliminarlog(id);
      }
    });
  }
  //eliminado de la carpeta
  eliminar(filename: string) {
    this.isLoading = true;
    this.archivo.borrar(filename).subscribe((res) => {
      this.fileInfos = this.archivo.getArchivoProjection(this.user.username, this.activ.id_asignacion_evidencia, this.idModel);
    });
  }

  eliminarlog(act: any) {
    this.isLoading = true;
    this.archivo.eliminar(act).subscribe(
      (response) => {
        console.log('Archivo eliminado:', response);
        this.obtenerConteoArchivos();
        this.listar();
        this.isLoading = false;
        // Muestra un mensaje de éxito después de que la operación haya finalizado
        Swal.fire('¡Eliminado!', 'El archivo ha sido eliminado.', 'success');
      },
      (error) => {
        console.error('Error al eliminar:', error);
        this.isLoading = false;
      }
    );
  }

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

  obtenerConteoArchivos() {
    this.asig.getCountArchivos(this.activ.id_asignacion_evidencia).subscribe(
      (conteo: number) => {
        this.conteoArchivos = conteo;
        if (conteo === 0) {
          this.actualizarEstadoArchivo(false);
        }
      },
      (error) => {
        console.error('Error al obtener el conteo de archivos:', error);
      }
    );

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

    // console.log('Fecha actual:', fechaActual);
    // console.log('Fecha fin actividad:', fechaFinActividad);

    // Compara las fechas directamente
    return fechaActual.getTime() > fechaFinActividad.getTime();
  }

  clearInputFields(): void {
    // Restablece los valores de los campos de entrada después de subir el archivo
    this.descripcion = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Limpia el valor del input de tipo archivo
    }
  }
}
