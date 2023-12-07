import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AsignacionCriterioService } from 'src/app/services/asignacion-criterio.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DetalleModeloComponent } from '../detalle-modelo.component';
import { Asignacion_Criterios } from 'src/app/models/Asignacion-Criterios';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-criterio',
  templateUrl: './asignar-criterio.component.html',
  styleUrls: ['./asignar-criterio.component.css']
})
export class AsignarCriterioComponent implements OnInit {

  datasource: any;
  nombrecrit:string='';
  valorSeleccionado: number = 0;
  lista: any[] = [];
  noti = new Notificacion();
  user: any = null;
  idusuario: any = null;
  nombre: any = null;
  nombreadmin!:string;
  id_modelo!:number;
  constructor(public login: LoginService, private notificationService: NotificacionService, private usuarioService: UsuarioService, private asignacionCriterio: AsignacionCriterioService, public dialogRef: MatDialogRef<DetalleModeloComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.user = this.login.getUser();
    this.id_modelo=this.data.modelo;
    this.nombrecrit=this.data.nombre;
    // console.log("ID modelo recibido: "+this.id_modelo);
    this.usuarioService.listarAdminDatos().subscribe(data => {
      this.datasource = data;
      // console.log(this.datasource);
    });
    // console.log("id criterio"+this.data.id);
    this.asignacionCriterio.nombre_Admin(this.id_modelo,this.data.id).subscribe(result => {
      if(result==undefined){
        this.nombreadmin="Sin asignacion";
      }else{
        this.nombreadmin="Asignado a: "+result.nombreaa;
      }
      
    });
    this.asignacionCriterio.listarAsignacion_AdminPorUsuario(this.data.id,this.id_modelo).subscribe(result => {
      if (result == null) {
        return;
      }
      this.lista.push(result);
      this.valorSeleccionado = this.lista[0].usuario.id;
      // console.log(this.lista[0].usuario.id);
    });

  }
  //
  
  notificaruser() {
    this.noti.fecha = new Date();
    this.noti.rol = "";
    this.noti.mensaje = this.user?.persona?.primer_nombre + " " + this.user?.persona?.primer_apellido + " te ha asignado el criterio " + this.data.nombre;
    this.noti.visto = false;
    this.noti.usuario = this.idusuario;
    this.noti.url="/use/user-dashboard";
    this.noti.idactividad=0;
    // console.log("El nombre es " + this.nombre)
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
  //objeto Asignacion_Criterios
  asignacion: any
  guardar() {
    // console.log("Valores criterio "+this.data.id+" usuario id"+this.valorSeleccionado+ "modelo "+this.id_modelo);

    this.asignacionCriterio.listarAsignacion_AdminPorUsuarioCriterio(this.data.id, this.id_modelo).subscribe(result => {
      if (result === null) {
        this.crearAsignacion();
        return;
      }

      this.asignacion = result;
      // console.log("Datos antiguos"+this.asignacion);
      this.asignacion.visible = false;
      this.asignacionCriterio.updateAsignacion_Admin(this.asignacion.id_asignacion, this.asignacion).subscribe(data => {
        // console.log("actualizo datos"+data);
        this.crearAsignacion();
        this.dialogRef.close({ data: 'Succes' });
      });
    });

    this.idusuario = this.valorSeleccionado;
    this.nombre = this.data.nombre;
    // console.log("iduser" + this.idusuario);
  }

  crearAsignacion() {
    this.asignacion = new Asignacion_Criterios();
    this.asignacion.usuario.id = this.valorSeleccionado;
    this.asignacion.criterio.id_criterio = this.data.id;
    this.asignacion.visible = true;
    this.asignacion.id_modelo=this.id_modelo
    // console.log("Datos de asignacion recibido: "+JSON.stringify(this.asignacion));
    this.asignacionCriterio.createAsignacion_Admin(this.asignacion).subscribe(data => {
      // console.log("Datos de asignacion: "+JSON.stringify(data));
      this.notificaruser();
      // this.dialogRef.close({ data: 'Succes'});
    });
  }
}
