import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Indicador } from 'src/app/models/Indicador';
import { Modelo } from 'src/app/models/Modelo';
import { Subcriterio } from 'src/app/models/Subcriterio';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { AsignacionIndicadorService } from 'src/app/services/asignacion-indicador.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SubcriteriosService } from 'src/app/services/subcriterios.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-detalle-indicador',
  templateUrl: './detalle-indicador.component.html',
  styleUrls: ['./detalle-indicador.component.css']
})
export class DetalleIndicadorComponent implements OnInit {

  itemsPerPageLabel = 'Items por página';
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
  //subcriterio: Subcriterio = new Subcriterio();

  miModal!: ElementRef;
  public indic = new Indicador();

  frmIndicador: FormGroup;
  guardadoExitoso: boolean = false;
  model: Modelo = new Modelo();
  subcrite: Subcriterio = new Subcriterio();
  sub: any;
  dataSource = new MatTableDataSource<any>();
  columnasUsuario: string[] = ['id_indicador', 'nombre', 'descripcion', 'peso', 'valor_obtenido', 'porc_obtenido', 'estandar', 'tipo'];
  asignacion: any;

  @ViewChild('datosModalRef') datosModalRef: any;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  constructor(
    private indicadorservice: IndicadoresService,
    private router: Router,private paginatorIntl: MatPaginatorIntl,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public modeloService: ModeloService,
    public asignacionIndicadorService: AsignacionIndicadorService,
    public sharedDataService: SharedDataService,
  ) {
    this.frmIndicador = fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(250)]],
      peso: ['', Validators.required],
      estandar: ['', Validators.required],
      tipo: ['', Validators.required],
    });
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
    this.recibeIndicador();
    this.verSubcriterios();
  }


  assignColorsToIndicators(indicators: any[]) {
    indicators.forEach((indicador: any) => {
      if (indicador.porc_obtenido > 75 && indicador.porc_obtenido <= 100) {
        indicador.color = 'verde';
      } else if (indicador.porc_obtenido > 50 && indicador.porc_obtenido <= 75) {
        indicador.color = 'amarillo';
      } else if (indicador.porc_obtenido > 25 && indicador.porc_obtenido <= 50) {
        indicador.color = 'naranja';
      } else if (indicador.porc_obtenido <= 25) {
        indicador.color = 'rojo';
      } else {
        indicador.color = '';
      }
    });
  }
  colresIndicador() {
    if (this.dataSource.data) {
      this.assignColorsToIndicators(this.dataSource.data);
    }
  }
  //optimizar
  recibeIndicador() {
    this.model = history.state.modelo;
    let id = history.state.data;
    //this.asignacionIndicadorService.getAsignacionIndicadorByIdModelo(this.model.id_modelo).subscribe((info) => {
      this.indicadorservice.getSubcrindica(id,this.model.id_modelo).subscribe((info) => {
       /* this.dataSource.data = [];
        this.asignacion = info;*/
        this.dataSource.data = info;
        /*result.filter((indicador: any) => {
          return info.some((asignacion: any) => {
            return (
              indicador.id_indicador === asignacion.indicador.id_indicador &&
              indicador.subcriterio?.id_subcriterio === id
            );
          });
        });*/
        this.assignColorsToIndicators(this.dataSource.data);
     // });
    });
  }


  verSubcriterios1(indicador: Indicador) {
    localStorage.setItem("id", indicador.id_indicador.toString());
    this.router.navigate(['/sup/modelo/detalle-subcriterio']);
  }

  verSubcriterios() {
    window.onpopstate = () => {
      if (this.router.url === '/sup/modelo/detalle-subcriterio') {
        this.recibeIndicador();
      }
    };
  }

  verCriterios() {
    this.router.navigate(['/sup/modelo/detallemodelo'], { state: { modelo: this.model } });
  }
  goBack() {
    window.history.back();
    this.router.navigate(['/sup/modelo/detalle-subcriterio'], { state: { modelo: this.model , data:  history.state.data}});
  }

  irinicio() {
    this.router.navigate(['/sup/modelo/modelo']);
  }
}
