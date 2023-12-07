import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CriterioSubcriteriosProjection } from 'src/app/interface/CriterioSubcriteriosProjection';
import { Indicador } from 'src/app/models/Indicador';
import { Subcriterio } from 'src/app/models/Subcriterio';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { SubcriteriosService } from 'src/app/services/subcriterios.service';
@Component({
  selector: 'app-subcriterios-admin',
  templateUrl: './subcriterios-admin.component.html',
  styleUrls: ['./subcriterios-admin.component.css']
})
export class SubcriteriosAdminComponent {
  searchText = '';
  constructor(
    private indicadorservice: IndicadoresService,private paginatorIntl: MatPaginatorIntl,
    private subcriterioservice: SubcriteriosService,
  ) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit() {
    this.listar()
  }

  buscar = '';
  @ViewChild('datosModalRef') datosModalRef: any;
  miModal!: ElementRef;
  public subcrite = new Subcriterio();
  subcriterios: any[] = [];


  //tabla
  itemsPerPageLabel = 'Items por página';
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

  filterPost = '';
  dataSource = new MatTableDataSource<CriterioSubcriteriosProjection>();
  columnasUsuario: string[] = ['nombreCriterio', 'id_subcriterio', 'nombre', 'descripcion', 'cantidadIndicadores'];
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;


  listar(): void {
    this.subcriterioservice.obtenerDatosSubcriteriosFull().subscribe(
      (data: any[]) => {
        this.subcriterios = data;
        this.dataSource.data = this.subcriterios;
      },
      (error: any) => {
        console.error('Error al listar los subcriterios:', error);
      }
    );
  }
  //Numero de indicadores
  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.subcriterios;;
    }
  }
}
