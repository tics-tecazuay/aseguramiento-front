import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActividadesCumplidasProjection } from 'src/app/interface/ActividadesProjection';
import { DetalleEvaluacionProjection } from 'src/app/interface/DetalleEvaluacionProjection';
import { Actividad } from 'src/app/models/Actividad';
import { Modelo } from 'src/app/models/Modelo';
import { ActividadService } from 'src/app/services/actividad.service';
import { CriteriosService } from 'src/app/services/criterios.service';
import { DetalleEvaluacionService } from 'src/app/services/detalle-evaluacion.service';

@Component({
  selector: 'app-consulta-actividad',
  templateUrl: './consulta-actividad.component.html',
  styleUrls: ['./consulta-actividad.component.css']
})
export class ConsultaActividadComponent implements OnInit {

  columnasDetalle: string[] = [
    'observacion',
    'fecha',
    'usua',
  ];
  selectedEstado: string = '';
  estados = [
    { estadoName: 'APROBADA' },
    { estadoName: 'PENDIENTE' },
    { estadoName: 'RECHAZADA' },
  ];

  estadoSeleccionado: boolean = false;
  actividad!: ActividadesCumplidasProjection[];
  indicadores: any[] = [];
  spans: any[] = [];
  searchTerm: string = '';
  dataSource4 = new MatTableDataSource<DetalleEvaluacionProjection>();
  noRegistros: any;
  listadodetalleEval: DetalleEvaluacionProjection[] = [];
  modeloVigente!: Modelo;
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

  searchText = '';
  @ViewChild('datosModalRef') datosModalRef: any;
  actividad2: Actividad[] = [];
  dataSource = new MatTableDataSource<ActividadesCumplidasProjection>();
  displayedColumns: string[] = ['criterio', 'subcriterio', 'indicador', 'nombre', 'fecha inicio', 'fecha fin', 'responsable', 'estado', 'observacion'];
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
  }

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(private detalleEvaluaService: DetalleEvaluacionService, private service: CriteriosService, private serviceactividad: ActividadService, private paginatorIntl: MatPaginatorIntl) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
  }

  ngOnInit(): void {
    this.obtenerModeloVigente();
    //this.Listar();
  }
  obtenerModeloVigente(){
    this.modeloVigente=JSON.parse(localStorage.getItem('modelo')||'');
  }
  //Contador para combinar celdas
  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.actividad.length;) {
      let currentValue = accessor(this.actividad[i]);
      let count = 1;

      for (let j = i + 1; j < this.actividad.length; j++) {
        if (currentValue !== accessor(this.actividad[j])) {
          break;
        }
        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      this.spans[i][key] = count;
      i += count;
    }
  }

  getRowSpan(col: any, index: any) {
    return this.spans[index] && this.spans[index][col];
  }

  onSelectionChange(event: MatSelectChange) {
    this.selectedEstado = event.value;
    console.log('Opción seleccionada:', event.value);

    if (this.selectedEstado) {
      this.estadoSeleccionado = true;

      this.serviceactividad.getActividades(this.selectedEstado, this.modeloVigente.id_modelo).subscribe((data) => {
        this.actividad = data;
        this.dataSource.data = this.actividad;
        console.log('evidencias filtradas por estado: ' + JSON.stringify(this.actividad));
      });
    } else {
      this.estadoSeleccionado = false;
    }
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

  verObservacion(element: number) {
    this.detalleEvaluaService.detalleevaluacion(element, this.modeloVigente.id_modelo)
      .subscribe(
        (detalles) => {
          this.listadodetalleEval = detalles;
          console.log(detalles);
          this.dataSource4.data = detalles;
        },
        (error) => {
          console.log(error);
        }
      );
    //this.Listar();
  }

}