import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { EvidenciaReApPeAtr } from 'src/app/interface/AsigEvidProjection';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';
import { LoginService } from 'src/app/services/login.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { Modelo } from 'src/app/models/Modelo';

@Component({
  selector: 'app-evidencia-atrasada',
  templateUrl: './evidencia-atrasada.component.html',
  styleUrls: ['./evidencia-atrasada.component.css'],
})
export class EvidenciaAtrasadaComponent implements OnInit {
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
  estadoSeleccionado: boolean = false;
  modeloVigente!: Modelo;

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

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
    this.obtenerModeloVigente();
  }
  obtenerModeloVigente() { 
  this.modeloVigente= JSON.parse(localStorage.getItem('modelo') || '{}');
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

      this.serv.getEvidenciasByEstado(this.selectedEstado, this.modeloVigente.id_modelo).subscribe((data) => {
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
