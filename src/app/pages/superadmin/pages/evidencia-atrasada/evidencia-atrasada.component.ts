import { Component, OnInit, ViewChild } from '@angular/core';
import { Actividad } from 'src/app/models/Actividad';
import { Notificacion } from 'src/app/models/Notificacion';
import { Observacion } from 'src/app/models/Observacion';
import { CriteriosService } from 'src/app/services/criterios.service';
import { LoginService } from 'src/app/services/login.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evidencia-atrasada',
  templateUrl: './evidencia-atrasada.component.html',
  styleUrls: ['./evidencia-atrasada.component.css']
})
export class EvidenciaAtrasadaComponent implements OnInit {

  searchText = '';
  @ViewChild('datosModalRef') datosModalRef: any;
  actividad: any[] = [];
  observaciones: Observacion[] = [];
  notifi: Notificacion = new Notificacion;
  isLoggedIn = false;
  user: any = null;
  rol: any = null;

  constructor(public login: LoginService, private service: CriteriosService, private notificacion: NotificacionService) { }

  ngOnInit(): void {
    this.getListarEvide();

    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    )
    this.rol = this.login.getUserRole();
  }

  getListarEvide() {
    this.service.getEvidenciaAtrasFecha().subscribe(
      data => {
        this.actividad = data;
        // console.log("actividades atrasadas"+JSON.stringify(this.actividad));
      }
    )
  }

  mostrarObservacion(acti: Actividad) {
    this.service.getObservacionByActi(acti.id_actividad).subscribe(
      data => {
        this.observaciones = data;
        // console.log(this.observaciones);
      }
    )
  }

  createNoti(noti: Notificacion) {
    this.notifi = {
      "id": 0,
      "fecha": (new Date),
      "rol": this.rol,
      "mensaje": noti.mensaje,
      "visto": true,
      "usuario": this.user.id,
      "url":"",
      "idactividad":0
    }
    this.notificacion.crear(this.notifi).subscribe
      (data => {
        this.notifi = data;
        Swal.fire({
          title: 'Notificación Guardado éxitosamente',
          icon: 'success',
          iconColor: '#17550c',
          color: "#0c3255",
          confirmButtonColor: "#0c3255",
          background: "#63B68B",
        })
      })
  }

}
