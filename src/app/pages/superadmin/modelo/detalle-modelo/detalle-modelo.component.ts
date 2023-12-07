import { Component, OnInit, ViewChild } from '@angular/core';
import { ModeloService } from 'src/app/services/modelo.service';
import { Router } from '@angular/router';
import { Modelo } from 'src/app/models/Modelo';
import { CriteriosService } from 'src/app/services/criterios.service';
import { SubcriteriosService } from 'src/app/services/subcriterios.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ActivatedRoute } from '@angular/router';
import { AsignacionIndicadorService } from 'src/app/services/asignacion-indicador.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { MatDialog } from '@angular/material/dialog';
import { AsignarCriterioComponent } from './asignar-criterio/asignar-criterio.component';
import { PonderacionService } from 'src/app/services/ponderacion.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

type ColumnNames = {
  [key: string]: string;
}

type ponderar = {
  [key: string]: string;
}

interface f {
  fecha: Date;
}


@Component({
  selector: 'app-detalle-modelo',
  templateUrl: './detalle-modelo.component.html',
  styleUrls: ['./detalle-modelo.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DetalleModeloComponent implements OnInit {
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
  
  dataSource = new MatTableDataSource<any>();
  public columnNames: ColumnNames = {
    nombrecriterio: 'Nombre del Criterio',
    descripcio: 'Descripción del Criterio'
  };

  public ponderar: ponderar = {
    fecha: 'Fecha de Ponderación',
  }

  pageSize = 10;
  pageIndex = 0;
  asignacion: any;
  columnsToDisplay = ['nombrecriterio', 'descripcio'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'subcriterios', 'matriz', 'ponderacion', 'asignar'];
  expandedElement: any;
  model: Modelo = new Modelo();
  mostrarPrincipal: number = 0;
  mostrarSecundario: number = 0;
contador: number = 0;
idmodelo: number = 0;
  //lista de objetos de f llamada dataSourcePonderacion
  dataSourcePonderacion: any;
  dataSourcePonderacion2: f[] = [];
  columnsToDisplayPonderacion = ['fecha'];
  columnsToDisplayWithExpandPonderacion = [...this.columnsToDisplayPonderacion, 'revisar'];

  displayedColumns: string[] = ['contador','fecha', 'revisar','eliminar'];

  fechas: Date[] = [];
  fechasfinal: Date[] = [];
  
  ocultarBoton: boolean = false;
  @ViewChild(MatTable)table!: MatTable<any>; 
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    public modeloService: ModeloService,
    public criterioService: CriteriosService,
    public subcriterioService: SubcriteriosService,
    public indicadorService: IndicadoresService,
    private asignacionIndicadorService: AsignacionIndicadorService,
    private sharedDataService: SharedDataService,
    private router: Router,private paginatorIntl: MatPaginatorIntl,
    private dialog: MatDialog,
    private ponderacionService: PonderacionService,
  ) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
   }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit(): void {
    this.model = history.state.modelo;
    this.idmodelo=this.model.id_modelo
    // console.log("Modelo a ver"+this.model.id_modelo)
    this.recibeModelo();
    localStorage.removeItem("datopasado");
  }


  elimin(element: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ponderacionService.getEliminar(element.contador,element.fechapo).subscribe(
          () => {
            this.recibeModelo();
            // console.log('Registro eliminado exitosamente.');
          },
          (error) => {
            // console.error('Error al eliminar el registro:', error);
          }
        );
      }
    });
  }
 
  // Función para manejar el cambio de página
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.updateDataSource();
  }

  // Función para actualizar la fuente de datos con la paginación
  updateDataSource() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource = new MatTableDataSource(this.dataSource.data.slice(startIndex, endIndex));
  }
  recibeModelo() {
      if (true) {
        this.mostrarPrincipal = 0;
        this.mostrarSecundario = 0;
        this.ocultarBoton = false;
        this.ponderacionService.listarPonderacionPorModelo(this.idmodelo).subscribe(
          (fechas) => {
            if (fechas.length > 0) {
              this.mostrarSecundario = 1;
            }
            this.dataSourcePonderacion = fechas;
          }
        );
      } 
      this.asignacionIndicadorService.getasignacriterio(Number(this.model.id_modelo)).subscribe(info => {
       
          this.dataSource.data = [];
          this.asignacion = info;
          this.dataSource.data = info;
        // console.log("datos "+JSON.stringify(this.dataSource.data))
      });
  }

  irPonderacionModelo(modelo: Modelo): void {
    localStorage.setItem("id", modelo.id_modelo.toString());
    this.model = modelo;
    this.router.navigate(['/sup/ponderacion/ponderacion-modelo'], { state: { modelo: this.model } });
  }
  ponderacionCriterio(event: Event, element: any) {
    event.stopPropagation();
    this.router.navigate(['/sup/ponderacion/ponderacion-criterio'], { state: { criterio: element, modelo: this.model } });
  }

  mostrar(element: any) {
   // this.sharedDataService.agregarIdCriterio(element.id_criterio);
    this.router.navigate(['/sup/modelo/detalle-subcriterio'], { state: { data: element.idcriterio, modelo: this.model } });
  }

  evaluacion(event: Event, element: any) {
    event.stopPropagation();
    this.router.navigate(['/sup/modelo/matriz-evaluacion'], { state: { criterio: element, modelo: this.model } });
  }

  ponderacion(event: Event, element: any) {
    event.stopPropagation();
    this.sharedDataService.agregarIdCriterio(element.idcriterio);
  }
  pond(element:any) {
    let fecha=element.fechapo;
    localStorage.setItem("contador", element.contador);
    this.router.navigate(['/sup/ponderacion/ponderacion-modelo'], { state: { fecha: fecha, conf: 1, modelo: this.model, contador:element.contador } });
  }

  irinicio() {
    this.router.navigate(['/sup/modelo/modelo']);
  }
  // pond(fecha: Date) {

  //   this.router.navigate(['/sup/ponderacion/ponderacion-modelo'], { queryParams: { fecha: fecha, conf: 1 } });
  // }

  asignar_criterio(event: Event, criterio: any) {
    event.stopPropagation();
    const id_modelo = localStorage.getItem('id');
    // console.log("Id modelo a asignar"+id_modelo+" id criterio "+criterio.idcriterio+" nombre "+criterio.nombrecriterio);
    const dialogRef = this.dialog.open(AsignarCriterioComponent, {
      width: '45%',
      data: { id: criterio.idcriterio,modelo:id_modelo,nombre:criterio.nombrecriterio }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data === 'Succes') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Criterio asignado correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }
}