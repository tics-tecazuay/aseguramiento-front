import { NotificacionService } from 'src/app/services/notificacion.service';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { Notificacion } from 'src/app/models/Notificacion';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Modelo } from 'src/app/models/Modelo';
import { ModeloService } from 'src/app/services/modelo.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [DatePipe]
})
export class NavbarComponent implements OnInit {
  numNotificacionesSinLeer: number = 0;
  showNotificationsModal = false;
  isLoggedIn = false;
  rol: any = null;
  user: any = null;
  noti = new Notificacion();
  notificaciones: Notificacion[] = [];
  idactividad:any;
  modeloVigente!: Modelo;

  constructor(public login: LoginService, 
    private notificationService: NotificacionService, 
    private modelservice: ModeloService,
    private router: Router) {
    this.rol = this.login.getUserRole();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    );
    this.obtenermodeloVigenteVigente();
   
   
  }

  listarnot(id: any) {
    // Cargar notificaciones propias por id
    this.notificationService.getNotificaciones(id,this.modeloVigente.id_modelo).subscribe(
      (dataPropias: Notificacion[]) => {
        this.notificaciones = dataPropias;
        this.numNotificacionesSinLeer = this.notificaciones.filter(n => !n.visto).length;
        // Verifica si es ADMIN o SUPERADMIN
        if (this.rol == "ADMIN" || this.rol == "SUPERADMIN") {
          // Cargar notificaciones del rol ADMIN
          this.notificationService.notificacionePorRol(this.rol, this.modeloVigente.id_modelo).subscribe(
            (dataRol: Notificacion[]) => {
              this.notificaciones = this.notificaciones.concat(dataRol);
              this.numNotificacionesSinLeer += dataRol.filter(n => !n.visto).length;
              // Ordenar las notificaciones por fecha (de más reciente a más antigua)
              this.notificaciones.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            },
            (errorRol: any) => {
              console.error('No se pudieron listar las notificaciones por rol');
            }
          );
        }
      },
      (errorPropias: any) => {
        console.error('No se pudieron listar las notificaciones propias');
      }
    );
  }
  
  obtenermodeloVigenteVigente(){
    this.modelservice.getModeMaximo().subscribe((data: any) => {
      this.modeloVigente = data;
      localStorage.setItem("modelo", JSON.stringify(this.modeloVigente));
      this.listarnot(this.user.id);
    });
  }
  
ir(noti:any){
  noti.url;
  if(noti.idactividad!=0){
    localStorage.setItem("eviden",noti.idactividad)
    this.router.navigate([noti.url]);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }  else {
    this.router.navigate([noti.url]);
  }
}
 
  public logout() {
    this.login.logout();
    localStorage.clear();
    location.replace('#/use/login');
    location.reload();
  }

  openNotifications() {
    // Actualizo las notificaciones cargadas
    this.notificaciones.forEach((n) => {
      if (!n.visto) {
        n.visto = true;
        // Actualizar el estado de la notificación en el servidor
        this.notificationService.actualizar(n.id).subscribe(() => {
        });
      }
    });
    // Actualizar el contador de notificaciones sin leer
    this.numNotificacionesSinLeer = 0;
  }

  closeNotifications() {
    this.showNotificationsModal = false;
  }

  toggleNotifications() {
    this.showNotificationsModal = !this.showNotificationsModal;
  }

}
