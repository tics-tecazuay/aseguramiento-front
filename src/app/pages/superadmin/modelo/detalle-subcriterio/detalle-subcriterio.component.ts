import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SubcriteriosService } from 'src/app/services/subcriterios.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Modelo } from 'src/app/models/Modelo';
import { AsignacionIndicadorService } from 'src/app/services/asignacion-indicador.service';
import { CriteriosService } from 'src/app/services/criterios.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-detalle-subcriterio',
  templateUrl: './detalle-subcriterio.component.html',
  styleUrls: ['./detalle-subcriterio.component.css']
})
export class DetalleSubcriterioComponent {
  ocultar=false;
  itemsPerPageLabel = 'Subcriterios por página';
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
  asignacion: any;
  searchText = '';

  //criterio: Criterio = new Criterio();
  model: Modelo = new Modelo();
  modelo: Modelo = new Modelo();
  buscar = '';
  miModal!: ElementRef;
  rolUser: string = '';
  columnasUsuario: string[] = ['id_subcriterio', 'nombre', 'descripcion', 'indicadores'];
  idcriterio: number = 0;
  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private subcriterioservice: SubcriteriosService,
    private router: Router,private paginatorIntl: MatPaginatorIntl,
    private sharedDataService: SharedDataService,
    public asignacionIndicadorService: AsignacionIndicadorService,
    public criterioService: CriteriosService,
    public modeloService: ModeloService
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
  ngOnInit() {
    this.recibeSubcriterio();
  }

  recibeSubcriterio() {
    this.modelo = history.state.modelo;
    let id_criterio = history.state.data;
    this.idcriterio = id_criterio;
    this.model = history.state.modelo;
    this.rolUser= history.state.rol;
    
    this.subcriterioservice.getSubcritIndi(id_criterio,Number(this.modelo.id_modelo)).subscribe(info => {
      this.dataSource.data =info;
     
    });
  }




  verIndicadores(element: any) {
    if(this.rolUser=="ADMIN"){
      this.router.navigate(['/sup/modelo/detalle-indicador'], { state: { data: element.id_subcriterio, modelo: this.model, criterio: this.idcriterio, rol: this.rolUser } }); 
    }else{
      this.router.navigate(['/sup/modelo/detalle-indicador'], { state: { data: element.id_subcriterio,criterio: this.idcriterio,modelo: this.model } });
    }
  }
  
  verCriterios() {
    if(this.rolUser=="ADMIN"){
      this.router.navigate(['/adm/calificar']);
    }else{
      this.router.navigate(['/sup/modelo/detallemodelo'], { state: { modelo: this.model } });
    } 
  }
  irinicio() {
    if(this.rolUser=="ADMIN"){
      this.router.navigate(['/adm/calificar']);
      }else{
      // código del método del botón
      this.router.navigate(['/sup/modelo/modelo']);
      }
  }
}


