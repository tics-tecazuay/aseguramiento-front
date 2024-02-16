import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { EvidenciaReApPeAtr } from 'src/app/interface/AsigEvidProjection';
import { Actividad } from 'src/app/models/Actividad';
import { Notificacion } from 'src/app/models/Notificacion';
import { Observacion } from 'src/app/models/Observacion';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';
import { CriteriosService } from 'src/app/services/criterios.service';
import { LoginService } from 'src/app/services/login.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evidencia-atrasada',
  templateUrl: './evidencia-atrasada.component.html',
  styleUrls: ['./evidencia-atrasada.component.css']
})
export class EvidenciaAtrasadaComponent implements OnInit {

  searchText = '';
  @ViewChild('datosModalRef') datosModalRef: any;
  evidencia: EvidenciaReApPeAtr[] = [];
  evidencia2: EvidenciaReApPeAtr[] = [];
  evidencia3: EvidenciaReApPeAtr[] = [];
  evidencia4: EvidenciaReApPeAtr[] = [];
  observaciones: Observacion[] = [];
  notifi: Notificacion = new Notificacion;
  isLoggedIn = false;
  user: any = null;
  rol: any = null;
  dataSource = new MatTableDataSource<EvidenciaReApPeAtr>();
  displayedColumns: string[] = ['responsable', 'nombre_criterio', 'nombre_subcriterio', 'nombre_indicador', 'evidencia', 'fecha_fin', 'fecha_inicio', 'estado'];
  searchTerm1: string = '';
  //tabla
  itemsPerPageLabel = 'Criterios por página';
  nextPageLabel = 'Siguiente';
  lastPageLabel = 'Última';
  firstPageLabel='Primera';
  previousPageLabel='Anterior';
  rango:any= (page: number, pageSize: number, length: number) => {
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

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(public login: LoginService, private service: CriteriosService, private notificacion: NotificacionService,
    private serv: AsignaEvidenciaService, private paginatorIntl: MatPaginatorIntl) {

    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
  }

  ngOnInit(): void {
    this.getListarEvideRe();
    this.getListarEvideAp();
    this.getListarEvidePen();

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

  getListarEvideRe() {
    this.serv.getEvidenciaRe().subscribe(
      data => {
        this.evidencia = data;
        this.dataSource.data = this.evidencia;
        console.log("evidencias rechazadas" + JSON.stringify(this.evidencia));
      }
    )
  }

  getListarEvideAp() {
    this.serv.getEvidenciaAp().subscribe(
      data => {
        this.evidencia2 = data;
        console.log("evidencias aprobadas" + JSON.stringify(this.evidencia2));
      }
    )
  }

  getListarEvidePen() {
    this.serv.getEvidenciaPen().subscribe(
      data => {
        this.evidencia3 = data;
        console.log("evidencias aprobadas" + JSON.stringify(this.evidencia3));
      }
    )
  }

  mostrarObservacion(acti: Actividad) {
    this.service.getObservacionByActi(acti.id_actividad).subscribe(
      data => {
        this.observaciones = data;
        console.log(this.observaciones);
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
      "url": "",
      "idactividad": 0
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

}
