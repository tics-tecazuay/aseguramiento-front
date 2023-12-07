import { trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition } from '@angular/animations';
import { Indicador } from 'src/app/models/Indicador';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CalificacionComponent } from './calificacion/calificacion.component';
import Swal from 'sweetalert2';
import { Criterio } from 'src/app/models/Criterio';
import { Modelo } from 'src/app/models/Modelo';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ArchivoService } from 'src/app/services/archivo.service';
import { Archivo } from 'src/app/models/Archivo';
import { ModeloService } from 'src/app/services/modelo.service';
import { criteriosdesprojection } from 'src/app/interface/criteriosdesprojection';

type Columnname = {
  [key: string]: string;
}

@Component({
  selector: 'app-matriz-evaluacion',
  templateUrl: './matriz-evaluacion.component.html',
  styleUrls: ['./matriz-evaluacion.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class MatrizEvaluacionComponent implements OnInit {
  spans3: any[] = [];
  itemsPerPageLabel = 'Indicadores por página';
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
  displayedColumns3: string[] = ['Indicador','DescIn','Evidencia','Peso','Obtenido','Utilidad','Valor','Archivos','Idind','Tipo', 'Calificar'];
  rowSpanValue: number = 0;
  verEvidencia=false;
  verTipo=true;
  ocultar=false;
  verIndicador=true;
  verPeso=true;
  verObtenido=true;
  verUtilidad=true;
  verArchivo=false;
  verValor=true;
  verDescripcion=false;
  verDesIndicador=true;
  public columnNames: Columnname = {
    nombre: 'Nombre del Indicador',
    descripcion: 'Descripción del Indicador',
    tipo: 'Tipo',
    valor_obtenido: 'Valor Obtenido'
  };

  dataSource = new MatTableDataSource<any>();
  archivosPorIndicador: { [idIndicador: number]: Archivo[] } = {};

  columnsToDisplay = ['nombre', 'descripcion', 'tipo', 'valor_obtenido'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,'archivo', 'evaluar'];
  expandedElement: any;
  nombre:string="";
  idcriterio: Criterio = new Criterio();
  idmodelo: Modelo = new Modelo();
  indicador: Indicador = new Indicador();
  datacrite: any[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  constructor(
    private route: Router,private paginatorIntl: MatPaginatorIntl,
    private indicadorService: IndicadoresService,
    private archi: ArchivoService,private modelserv:ModeloService,
    private dialog: MatDialog) 
  { 
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
    this.llenar_datasource();
    this.llenardatos();
    localStorage.removeItem("datopasado");
  }
  calcularRowSpanValue(index: number): void {
    this.rowSpanValue = this.getRowSpan3('Indicador', index);
  }
  showTipo() {
    this.verTipo = !this.verTipo;
  }
  showArchivo() {
    this.verArchivo = !this.verArchivo;
  }
  
  showValor() {
    this.verValor = !this.verValor;
  }
  
  showUtilidad() {
    this.verUtilidad = !this.verUtilidad;
  }
  
  showObtenido() {
    this.verObtenido = !this.verObtenido;
  }
  
  showDescripcionin() {
    this.verDesIndicador = !this.verDesIndicador;
  }
  
  
  showIndicador() {
    this.verIndicador = !this.verIndicador;
  }
  showPeso() {
    this.verPeso = !this.verPeso;
  }
  showEvidencia() {
    this.verEvidencia = !this.verEvidencia;
  }
  showDescripcion() {
    this.verDescripcion = !this.verDescripcion;
  }

  cacheSpan3(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.datacrite.length;) {
      let currentValue = accessor(this.datacrite[i]);
      let count = 1;

      for (let j = i + 1; j < this.datacrite.length; j++) {
        if (currentValue !== accessor(this.datacrite[j])) {
          break;
        }
        count++;
      }
  
      if (!this.spans3[i]) {
        this.spans3[i] = {};
      }
  
      this.spans3[i][key] = count;
      i += count;
    }
  }
  
  
  getRowSpan3(col: any, index: any) {
    return this.spans3[index] && this.spans3[index][col];
  }
llenardatos(){
  this.idcriterio = history.state.criterio;
  this.idmodelo = history.state.modelo;
  let id=history.state.criterio.idcriterio;
  this.nombre=history.state.criterio.nombrecriterio;
  // console.log("nombrec"+history.state.criterio.nombrecriterio);
  this.modelserv.getliscritemod(id, this.idmodelo.id_modelo).subscribe((data: criteriosdesprojection[]) => {
    this.datacrite = data;
    // console.log("Datos mios "+"id mod "+this.idmodelo.id_modelo+"id crite "+this.idcriterio.id_criterio+" "+JSON.stringify(data));
    
    this.cacheSpan3('Indicador', (d) => d.ind_nombrej);
    this.cacheSpan3('DescIn', (d) => d.criterionomj+d.ides);
    this.cacheSpan3('Peso', (d) => d.ind_nombrej+d.ides+d.pes);
    this.cacheSpan3('Obtenido', (d) => d.ind_nombrej+d.ides+d.pes+d.obt);
    this.cacheSpan3('Utilidad', (d) => d.ind_nombrej+d.ides+d.pes+d.obt+d.uti);
    this.cacheSpan3('Valor', (d) =>  d.ind_nombrej+d.ides+d.pes+d.obt+d.uti+d.val);
    this.cacheSpan3('Evidencia', (d) =>  d.ind_nombrej+d.ides+d.pes+d.obt+d.uti+d.val+d.descrip);
    this.cacheSpan3('Archivos', (d) =>d.ind_nombrej+d.ides +d.pes+d.obt+d.uti+d.val+d.descrip+ d.archivo_enlace);
    this.cacheSpan3('Idind', (d) =>  d.ind_nombrej+d.ides +d.pes+d.obt+d.uti+d.val+d.descrip+ d.archivo_enlace+d.id_indicardorj);
    this.cacheSpan3('Tipo', (d) =>  d.ind_nombrej+d.ides +d.pes+d.obt+d.uti+d.val+d.descrip+ d.archivo_enlace+d.id_indicardorj+d.tip);
  },
  (error) => {

    console.error("Error al obtener datos:", error);
  })
}
  llenar_datasource() {
    const datosString = localStorage.getItem('datopasado');
    if (datosString) {
      const datos = JSON.parse(datosString);
      let idmodelo = datos.modelo;
      let idcriterio = datos.idCriterio;
      this.indicadorService.listarIndicadorPorCriterioModelo(idcriterio, idmodelo).subscribe(data => {
        this.dataSource.data = data;
        if (data.length > 0) {
          data.forEach(indicador => {
            this.archi.getarchivoindi(idcriterio, idmodelo, indicador.id_indicador).subscribe(
              arch => {
                // console.log("Archivos: " + JSON.stringify(arch));
                const enlaces = arch.map(archivo => archivo.enlace); // Obtener solo los enlaces
            
            // Asociar los enlaces a los elementos correspondientes en dataSource.data
            this.dataSource.data = this.dataSource.data.map(item => {
              if (item.id_indicador === indicador.id_indicador) {
                return { ...item, enlaces: enlaces };
              }
              return item;
            });
              }
            );
          });
        }
      });
      
    }else{
   // this.idcriterio = history.state.criterio;
   let id=history.state.criterio.idcriterio;
  //  console.log("idcrit "+id);
    this.idmodelo = history.state.modelo;

    this.indicadorService.listarIndicadorPorCriterioModelo(id, this.idmodelo.id_modelo).subscribe(data => {
      
      this.dataSource.data = data;
      if (data.length > 0) {
        data.forEach(indicador => {
          this.archi.getarchivoindi(id, this.idmodelo.id_modelo, indicador.id_indicador).subscribe(
            arch => {
              // console.log("Archivos: " + JSON.stringify(arch));
              const enlaces = arch.map(archivo => archivo.enlace); // Obtener solo los enlaces
          
          // Asociar los enlaces a los elementos correspondientes en dataSource.data
          this.dataSource.data = this.dataSource.data.map(item => {
            if (item.id_indicador === indicador.id_indicador) {
              return { ...item, enlaces: enlaces };
            }
            return item;
          });
            }
          );
        });
      }
    });}
  }
  getFileName(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
  
  abrirDialogo(valor: any, id: any, peso: any): void {
    const dialogRef = this.dialog.open(CalificacionComponent, {
      data: { valor, id, peso },
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      if (result.event == 'success') {
        // console.log(result);
        this.llenardatos();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Calificación registrada',
          showConfirmButton: true,
          timer: 1500
        })
      }
    });
  }

  regresar() {
    this.route.navigate(['/sup/modelo/detallemodelo'], { state: { modelo: this.idmodelo } });
  }
  irinicio() {

    // código del método del botón
    this.route.navigate(['/sup/modelo/modelo']);

  }
}