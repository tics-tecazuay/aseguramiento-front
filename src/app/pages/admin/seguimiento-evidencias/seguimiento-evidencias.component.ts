import { id } from '@swimlane/ngx-charts';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { EvidenciaReApPeAtr } from 'src/app/interface/AsigEvidProjection';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';
import { LoginService } from 'src/app/services/login.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { Modelo } from 'src/app/models/Modelo';

@Component({
  selector: 'app-seguimiento-evidencias',
  templateUrl: './seguimiento-evidencias.component.html',
  styleUrls: ['./seguimiento-evidencias.component.css']
})
export class SeguimientoEvidenciasComponent implements OnInit {
  @ViewChild('datosModalRef') datosModalRef: any;
  filterPost = '';
  selectedEstado: string = '';
  estados = [
    { estadoName: 'APROBADA' },
    { estadoName: 'PENDIENTE' },
    { estadoName: 'RECHAZADA' },
  ];

  evidencia: EvidenciaReApPeAtr[] = [];
  dataSource = new MatTableDataSource<EvidenciaReApPeAtr>();
  displayedColumns: string[] = [
    'responsable',
    'nombre_criterio',
    'nombre_subcriterio',
    'nombre_indicador',
    'evidencia',
    'fecha_fin',
    'fecha_inicio',
    'estado',
  ];
  searchTerm1: string = '';
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

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  user: any = null;
  isLoggedIn = false;
  id_admin!: number;
  estadoSeleccionado: boolean = false;
  modeloVigente!: Modelo;
  id_modelo!: number;


  constructor(
    public login: LoginService,
    private serv: AsignaEvidenciaService,
    private paginatorIntl: MatPaginatorIntl
  ) {
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
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
    this.id_admin = this.user.id
    console.log('id_admin', this.id_admin);
    this.modeloMax();
    //this.getListarEvideByEstado;
  }

  modeloMax() {
    this.modeloVigente = JSON.parse(localStorage.getItem('modelo') || '{}');
    this.id_modelo = this.modeloVigente.id_modelo;
  }

  getColorEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'amarillo_evidencia';
      case 'aprobada':
        return 'verde_evidencia';
      case 'rechazada':
        return 'rojo_evidencia';
      default:
        return '';
    }
  }

  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.evidencia;
    }
  }

  onSelectionChange(event: MatSelectChange) {
    this.selectedEstado = event.value;
    console.log('Opción seleccionada:', event.value);

    if (this.selectedEstado) {
      this.estadoSeleccionado = true;

      this.serv.getEvidenciasByEstadoAdm(this.selectedEstado, this.id_admin, this.id_modelo).subscribe((data) => {
        this.evidencia = data;
        this.dataSource.data = this.evidencia;
        console.log(
          'evidencias filtradas por estado: ' + JSON.stringify(this.evidencia)
        );
      });
    } else {
      this.estadoSeleccionado = false;
    }
  }

}
