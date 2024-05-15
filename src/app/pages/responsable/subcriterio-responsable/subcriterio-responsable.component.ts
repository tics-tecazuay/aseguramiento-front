import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Criterio } from 'src/app/models/Criterio';
import { Modelo } from 'src/app/models/Modelo';
import { usuario } from 'src/app/models/Usuario';
import { AsignacionIndicadorService } from 'src/app/services/asignacion-indicador.service';
import { CriteriosService } from 'src/app/services/criterios.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { LoginService } from 'src/app/services/login.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SubcriteriosService } from 'src/app/services/subcriterios.service';

@Component({
  selector: 'app-subcriterio-responsable',
  templateUrl: './subcriterio-responsable.component.html',
  styleUrls: ['./subcriterio-responsable.component.css']
})
export class SubcriterioResponsableComponent implements OnInit {
  idCriterio: number =0;
  miModal!: ElementRef;
  public cri = new Criterio();
  subcriterios: any[] = [];
  user2: usuario = new usuario();
  modelo: Modelo = new Modelo();
  criterio: Criterio = new Criterio();
  isLoggedIn = false;
  rol: string = '';
  user: any = null;
  id_modelo!: number;

  //tabla
  itemsPerPageLabel = 'Criterios por página';
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
    const endIndex = startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };

  filterPost = '';
  dataSource = new MatTableDataSource<any>();

  columnasUsuario: string[] = ['nombre','descripcion'];

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;



  constructor(public login: LoginService, private criservice: CriteriosService,
    private paginatorIntl: MatPaginatorIntl,
    public modeloService: ModeloService, private indi: IndicadoresService,
    public criterioService: CriteriosService,
    public subcriterioService: SubcriteriosService,
    public indicadorService: IndicadoresService,
    private asignacionIndicadorService: AsignacionIndicadorService,
    private sharedDataService: SharedDataService,
    
    
  ) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
    this.rol = this.login.getUserRole();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit() {

    const navigation = window.history.state;
    if (navigation && navigation.idCriterio) {
      this.idCriterio = navigation.idCriterio;
      console.log('ID del criterio recibido:', this.idCriterio);
    } else {
      console.error('No se recibieron datos de estado.');
    }
  


    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    console.log("El usuario es " + this.user.id + " rol: " + this.rol);

    let id = localStorage.getItem("id");
    this.id_modelo = Number(id);
    console.log("modelo= "+this.id_modelo)


    this.listar();

  }

  listar(): void {
    this.subcriterioService.listarSubcriterioPorCriterio(this.idCriterio).subscribe(
      (data: any[]) => {
        this.subcriterios = data;
        this.dataSource.data = this.subcriterios;
        console.log(data);
      },
      (error: any) => {
        console.error('Error al listar los subcriterios', error);
      }
    );
  }

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
