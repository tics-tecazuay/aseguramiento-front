import { Component,AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-historial_notifi',
  templateUrl: './historial_notifi.component.html',
  styleUrls: ['./historial_notifi.component.css']
})
export class Historial_notifiComponent implements OnInit, AfterViewInit {
  notificaciones: Notificacion[] = [];
  rol: any = null;
  displayedColumns: string[] = ['Id', 'Fecha', 'Mensaje'];
  dataSource = new MatTableDataSource<Notificacion>();
  ocultar=false;
  isLoggedIn = false;
  user: any = null;
  numNotificacionesSinLeer: number = 0;
  filterPost = '';
  idUserLogged!: number;
  
  ngAfterViewInit() {
    console.log('Paginator:', this.paginator);
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  
  constructor(private notificacionService: NotificacionService,public login: LoginService ) { 
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

    this.idUserLogged = this.user.id;
    this.dataSource.filterPredicate = (data: Notificacion, filter: string) => {
      const searchTerms = filter.split(' '); // Divide el filtro en términos individuales
      return searchTerms.every(term =>
        data.id.toString().includes(term) ||
        data.fecha.toString().includes(term) || // Convierte la fecha a cadena
        data.mensaje.toLowerCase().includes(term)
      );
    };
    
    this.listarnot(this.user.id);
   }

  listarnot(id: any) {
    console.log("ID: " + id);
    if (this.rol == "ADMIN") {
      console.log("ROL: " + this.rol);
      // Cargar notificaciones del rol ADMIN
      this.notificacionService.allnotificacionTODO(this.rol,this.idUserLogged).subscribe(
        (data: Notificacion[]) => {
          this.notificaciones = data;
          this.dataSource.data = data;
          console.log("ENVIANDO" + data);
          this.numNotificacionesSinLeer = this.notificaciones.filter(n => !n.visto).length;
          this.numNotificacionesSinLeer = this.dataSource.data.filter(n => !n.visto).length;
  
          // Cargar notificaciones propias por id
          this.notificacionService.getNotificaciones(id).subscribe(
            (dataPropias: Notificacion[]) => {
              this.notificaciones = this.notificaciones.concat(dataPropias);
              this.dataSource.data = this.dataSource.data.concat(dataPropias);
              this.numNotificacionesSinLeer += dataPropias.filter(n => !n.visto).length;
  
            },
            (errorPropias: any) => {
              console.error('No se pudieron listar las notificaciones propias');
            }
          );
        },
        (error: any) => {
          console.error('No se pudieron listar las notificaciones');
        }
      );
    } else if (this.rol == "SUPERADMIN") {
      // Si el rol es SUPERADMIN, cargar todas las notificaciones
      this.notificacionService.todonotificaciones().subscribe(
        (data: Notificacion[]) => {
          this.notificaciones = data;
          this.dataSource.data = data;
          this.numNotificacionesSinLeer = this.notificaciones.filter(n => !n.visto).length;
          this.numNotificacionesSinLeer = this.dataSource.data.filter(n => !n.visto).length;
        },
        (error: any) => {
          console.error('No se pudieron listar todas las notificaciones');
        }
      );
    } 
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
      this.login.loginStatusSubjec.asObservable().subscribe(
        data => {
          this.isLoggedIn = this.login.isLoggedIn();
          this.user = this.login.getUser();
        }
      );
  
      // Restaurar los datos originales si no hay filtro aplicado
      this.listarnot(this.user.id);
      }
  }



  
}


