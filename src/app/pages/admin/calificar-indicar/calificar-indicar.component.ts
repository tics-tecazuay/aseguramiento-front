import { id } from '@swimlane/ngx-charts';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModeloService } from 'src/app/services/modelo.service';
import { Router } from '@angular/router';
import { Modelo } from 'src/app/models/Modelo';
import { CriteriosService } from 'src/app/services/criterios.service';
import { SubcriteriosService } from 'src/app/services/subcriterios.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PonderacionService } from 'src/app/services/ponderacion.service';
import { CriterioByAdmin, CriterioCal } from 'src/app/interface/CriteUsuarioProjection';
import { LoginService } from 'src/app/services/login.service';
import { Criterio } from 'src/app/models/Criterio';

type ColumnNames = {
  [key: string]: string;
}

interface f {
  fecha: Date;
}

@Component({
  selector: 'app-calificar-indicar',
  templateUrl: './calificar-indicar.component.html',
  styleUrls: ['./calificar-indicar.component.css']
})

export class CalificarIndicarComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;
  idUserLogged!: number;

  ocultar = false;
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
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };

  dataSource = new MatTableDataSource<any>();
  public columnNames: ColumnNames = {
    nombre_criterio: 'Nombre del Criterio',
    descripcion_criterio: 'Descripción del Criterio'
  };

 
  pageSize = 10;
  pageIndex = 0;
  columnsToDisplay = ['nombre_criterio', 'descripcion_criterio'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,'subcriterios', 'matriz'];
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

  displayedColumns: string[] = ['contador', 'fecha', 'revisar', 'eliminar'];

  fechas: Date[] = [];
  fechasfinal: Date[] = [];
  rolUser: string = '';
  ocultarBoton: boolean = false;
  criterio!: CriterioByAdmin[];  
  criterioEnv!: CriterioCal;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(    
    public modeloService: ModeloService,
    public criterioService: CriteriosService,
    public subcriterioService: SubcriteriosService,
    public indicadorService: IndicadoresService,
    private router: Router, private paginatorIntl: MatPaginatorIntl,
    private ponderacionService: PonderacionService,
    public login: LoginService
  ) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
    this.criterioEnv = {idcriterio: 0, nombrecriterio: '', descripcio: ''};
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;

  }
  ngOnInit() {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
    this.idUserLogged = this.user.id;
    this.rolUser=this.user.authorities[0].authority;
    this.obtenerModeloMax();
    localStorage.removeItem("datopasado"); 
  }

  obtenerModeloMax() {
    this.modeloService.getModeMaximo().subscribe(
      data => {
        console.log('Respuesta del servicio getModeMaximo:', data);
        this.model = data;
        this.idmodelo = data.id_modelo;
        this.recibeModelo();
      },
      error => {
        console.error('Error al obtener el máximo modelo:', error);
      }
    );
  }
  mostrar(element: any) {
    this.router.navigate(['/sup/modelo/detalle-subcriterio'], { state: { data: element.id_criterio, modelo: this.model, rol: this.rolUser } });
  }

  // Función para formatear la fecha en el formato YYYY-MM-DD
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    let day: string | number = date.getDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
  
    return `${year}-${month}-${day}`;
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

  evaluacion(event: Event, element: any) {
    event.stopPropagation();
    console.log("elemento", element);
    this.criterioEnv.idcriterio = element.id_criterio;
    this.criterioEnv.nombrecriterio = element.nombre_criterio;
    this.criterioEnv.descripcio = element.descripcion_criterio;
    this.router.navigate(['/sup/modelo/matriz-evaluacion'], { state: { criterio:this.criterioEnv, modelo: this.model , rol: this.rolUser} });
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
          console.log("datos fechas " + JSON.stringify(this.dataSourcePonderacion))
        }
      );
    }
    this.criterioService.getCriterioAdm(this.idmodelo, this.idUserLogged).subscribe(info => {      
      this.dataSource.data = [];      
      this.dataSource.data = info;
      console.log("datos " ,this.dataSource.data)
    });
  }

}