import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AsignacionCriterioService } from 'src/app/services/asignacion-criterio.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DetalleModeloComponent } from '../detalle-modelo.component';
import { AsignacionAdminPDTO, Asignacion_Criterios } from 'src/app/models/Asignacion-Criterios';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { LoginService } from 'src/app/services/login.service';
import { AsignacionProjection } from 'src/app/interface/AsignacionProjection';
import Swal from 'sweetalert2';
import { Modelo } from 'src/app/models/Modelo';

@Component({
  selector: 'app-asignar-criterio',
  templateUrl: './asignar-criterio.component.html',
  styleUrls: ['./asignar-criterio.component.css']
})
export class AsignarCriterioComponent implements OnInit {

  datasource: any;
  nombrecrit: string = '';
  valorSeleccionado: number = 0;
  lista: any[] = [];
  noti = new Notificacion();
  user: any = null;
  idusuario: any = null;
  nombre: any = null;
  nombreadmin!: string;
  id_modelo!: number;
  modeloVigente!: Modelo;
  adminsList: AsignacionProjection[] = [];
  asignacionCriterios: Asignacion_Criterios | undefined;
  constructor(public login: LoginService, private notificationService: NotificacionService, private usuarioService: UsuarioService, private asignacionCriterio: AsignacionCriterioService, public dialogRef: MatDialogRef<DetalleModeloComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.user = this.login.getUser();
    this.obtenerModeloVigente();
    this.id_modelo = this.modeloVigente.id_modelo;
    this.nombrecrit = this.data.nombre;
    //Directamente guardar en el objeto notificacion el modelo
    this.noti.id_modelo = this.id_modelo;

    this.asignacionCriterio.verAdminsPorCriterio(this.id_modelo, this.data.id).subscribe(
      (result: AsignacionProjection[]) => {
        if (result == undefined) {
          console.log("Ningún admin");
        } else {
          console.log("Admins encontrados:", result);
          // Realiza la lógica que necesites con la lista resultante
          this.adminsList = result;
        }
      },
      (error) => {
        console.error("Error al obtener la lista de admins:", error);
      }
    );
    this.usuarioService.listarAdminDatos().subscribe(data => {
      this.datasource = data;
      console.log(this.datasource);
    });
  }
  //
  obtenerModeloVigente() { 
    this.modeloVigente = JSON.parse(localStorage.getItem('modelo') || '{}');
  }
  notificaruser() {
    this.noti.fecha = new Date();
    this.noti.rol = "";
    this.noti.mensaje = this.user?.persona?.primer_nombre + " " + this.user?.persona?.primer_apellido + " te ha asignado el criterio " + this.data.nombre;
    this.noti.visto = false;
    this.noti.usuario = this.idusuario;
    this.noti.url = "/use/user-dashboard";
    this.noti.idactividad = 0;
    console.log("El nombre es " + this.nombre)
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

  guardar() {
    console.log("Valores criterio " + this.data.id + " usuario id " + this.valorSeleccionado + " modelo " + this.id_modelo);

    // Crear el DTO para la asignación
    const asignacionDTO: AsignacionAdminPDTO = {
      idModelo: this.id_modelo,
      idCriterio: this.data.id,
      idUsuario: this.valorSeleccionado
    };

    // Desglosar el objeto asignacionDTO y pasar sus campos individualmente
    const { idModelo, idCriterio, idUsuario } = asignacionDTO;

    // Verificar si la asignación existe
    this.asignacionCriterio.busqueda_asignacion_especifica(idUsuario, idModelo, idCriterio).subscribe(
      data => {
        if (data && data.visible === false) {
          // La asignación existe pero su estado es falso, actualizarla
          this.actualizarAsignacion(data.id_asignacion);
        } else {
          // Crear una nueva asignación
          console.log("No se encontró ninguna asignación existente o la asignación es visible. Creando nueva asignación...");
          this.crearAsignacion(asignacionDTO);
        }
      },
      error => {
        console.error("Error al verificar la asignación:", error);
        Swal.fire('Error', 'Hubo un problema al verificar la asignación', 'error');
      }
    );
  }


  // Método para crear una nueva asignación
  crearAsignacion(asignacionDTO: AsignacionAdminPDTO) {
    this.asignacionCriterio.crearAsignacion(asignacionDTO).subscribe(
      data => {
        console.log("Datos de asignación creada: " + JSON.stringify(data));
        this.notificaruser();
        this.dialogRef.close({ data: 'Success' });
      },
      error => {
        if (error.status === 400) {
          Swal.fire('Advertencia', 'El usuario ya está asignado al criterio', 'warning');
        } else {
          console.error("Error al crear la asignación:", error);
          Swal.fire('Error', 'Hubo un problema al crear la asignación', 'error');
        }
      }
    );
  }

  // Método para actualizar una asignación existente
  actualizarAsignacion(idAsignacion: number) {
    this.asignacionCriterio.actualizarEstado(idAsignacion).subscribe(
      data => {
        console.log("Datos de asignación actualizada: " + JSON.stringify(data));
        this.notificaruser();
        this.dialogRef.close({ data: 'Success' });
      },
      error => {
        console.error("Error al actualizar la asignación:", error);
        Swal.fire('Error', 'Hubo un problema al actualizar la asignación', 'error');
      }
    );
  }

  eliminarAdmin(id: number): void {
    this.asignacionCriterio.busqueda_asignacion_especifica(id, this.id_modelo, this.data.id)
      .subscribe(
        asignacion => {
          this.asignacionCriterios = asignacion;
          console.log('Asignación encontrada:', asignacion);

          this.asignacionCriterio.deleteAsignacion_Admin(asignacion.id_asignacion).subscribe(
            (data: Asignacion_Criterios) => {
              console.log('Asignación eliminada correctamente:', data);
              this.dialogRef.close({ data: 'Delete' });
            },
            (error: any) => {
              console.error('Error al eliminar la asignación:', error);
            }
          );
        },
        error => {
          console.error('Error al buscar la asignación:', error);
        }
      );
  }
}
