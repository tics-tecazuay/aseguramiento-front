import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-criterio-responsable',
  templateUrl: './criterio-responsable.component.html',
  styleUrls: ['./criterio-responsable.component.css']
})
export class CriterioResponsableComponent implements OnInit {

  miModal!: ElementRef;
  public cri = new Criterio();
  criterios: any[] = [];
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

  columnasUsuario: string[] = ['nombre','descripcion','subcriterio'];

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
    private router: Router
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

    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    console.log("El usuario es " + this.user.id + " rol: " + this.rol);

    let id = localStorage.getItem("id");
    this.id_modelo = Number(id);
    console.log("modelo= "+this.id_modelo)


    this.listar(this.id_modelo,this.user.id);

  }

  listar(id: number, id_modelo: number): void {
    console.log("id ver " + id + id_modelo);
    this.criservice.getcriresponsable(id, id_modelo).subscribe(
      (data: any[]) => {
        this.criterios = data;
        this.dataSource.data = this.criterios;
        console.log(data);
      },
      (error: any) => {
        console.error('Error al listar los criterios', error);
      }
    );
  }
  verSubcriterio(idCriterio: number): void {
    this.router.navigate(['/res/detalleSubcriterio'], { state: { idCriterio: idCriterio } });
  }
  aplicarFiltro() {
    if (this.filterPost) {
      const lowerCaseFilter = this.filterPost.toLowerCase();
      this.dataSource.data = this.dataSource.data.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(lowerCaseFilter);
      });
    } else {
      this.dataSource.data = this.criterios;;
    }
  }
}
