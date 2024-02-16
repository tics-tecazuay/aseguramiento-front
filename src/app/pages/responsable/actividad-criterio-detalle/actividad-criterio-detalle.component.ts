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
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { ValoresProjection } from 'src/app/interface/ValoresProjection';
import { IndicadorProjection } from 'src/app/interface/IndicadorProjection';
import { IndiColProjection } from 'src/app/interface/IndiColProjection';
import { criteriosdesprojection } from 'src/app/interface/criteriosdesprojection';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/services/login.service';

type ColumnNames = {
  [key: string]: string;
}
const colors: { [key: string]: string } = {
  verde: '#00FF00', // Por ejemplo, 'verde' se asocia con el color verde en hexadecimal
  naranja: '#FFA500', // 'naranja' se asocia con el color naranja en hexadecimal
  rojo: '#FF0000', // 'rojo' se asocia con el color rojo en hexadecimal
  amarillo: '#f8f32b',
};
@Component({
  selector: 'app-detalle-modelo',
  templateUrl: './actividad-criterio-detalle.component.html',
  styleUrls: ['./actividad-criterio-detalle.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ActividadCriterioDetalle implements OnInit {
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

  public columnNames: ColumnNames = {
    nombre: 'Nombre del Criterio',
    descripcion: 'Descripción del Criterio'
  };
  displayedColumns3: string[] = ['Criterio', 'Subcriterio', 'Indicador','Evidencia','Peso','Obtenido','Utilidad','Valor'];
  displayedColumns4: string[] = ['indicadores', 'nindi', 'porcentaje'];
  dataSource: any;
  asignacion: any;
  consul=false;
  tabla!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  verEvidencia=false;
  verIndicador=true;
  verPeso=true;
  verObtenido=true;
  verUtilidad=true;
  verValor=true;
  verSubcriterio=true;
  verCriterio=false;
  columnsToDisplay = ['nombre', 'descripcion'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay];
  expandedElement: any;
  titulocriterio!: string;
  clic: boolean = false;
  valoresp:ValoresProjection[] = [];
  labesCriterios: any[] = [];
  datosPOrceCriter: number[] = [];
  id_modelo!:number;
  criteri: any;
  valores: number[] = [];
  coloresTarjetas: string[] = [];
  borderStyles: string[] = [];
  listain: IndicadorProjection[] = [];
  indicol:IndiColProjection[] = [];
  model: Modelo = new Modelo();
  datacrite: any[] = [];
  spans3: any[] = [];
  id_criterio!:number;
  rowSpanValue: number = 0;
  coloresAsignados: { [key: string]: string } = {}; 
  seleccionados: { [key: string]: boolean } = {};
  todosSeleccionados=false;
  rol: string ='';
  user: any = null;
  isLoggedIn = false;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
public barChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  scales: {
    x: {
      type: 'category',
      ticks: {
       
        autoSkip: false, // Evita que las etiquetas se salten automáticamente
        maxRotation: 45, // Cambia el ángulo de rotación aquí
        minRotation: 45, // Cambia el ángulo de rotación aquí
        color: 'black',
      },
    },
    y: {
      
    },
  },
  plugins: {
    legend: {
      display: true,
    },
    datalabels: {
      anchor: 'end',
      align: 'end',
      color: 'black',
    },
  },
};
public barChartType: ChartType = 'bar';
public barChartPlugins = [DataLabelsPlugin];

public barChartData: ChartData<'bar'> = {
  labels: [],
    datasets: [
      { data: [], label: 'V/Obtenido', backgroundColor: 'rgba(56,116,188,255)'  },
      { data: [], label: 'V/por obtener', backgroundColor: 'rgba(184,54,51,255)' },
    ],
};
  // Pie
public pieChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    datalabels: {
      formatter: (value: any, ctx: any) => {
        if (ctx.chart.data.labels) {
          return ctx.chart.data.labels[ctx.dataIndex];
        }
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const value = context.raw;
          return `${value}%`;
        }
      }
    }
  },
  elements: {
    arc: {
      backgroundColor: [],
    },}
};
public pieChartData: ChartData<'pie', number[], string | string[]> = {
  labels: [],
  datasets: [
    {
      data: [],
    },
  ],
};
public pieChartType: ChartType = 'pie';
public pieChartPlugins = [DataLabelsPlugin];

// events
public chartClicked({
  event,
  active,
}: {
  event?: ChartEvent;
  active?: object[];
}): void {
  console.log(event, active);
}

public chartHovered({
  event,
  active,
}: {
  event?: ChartEvent;
  active?: object[];
}): void {
  console.log(event, active);
}
  constructor(
    public login: LoginService,private paginatorIntl: MatPaginatorIntl,
    public modeloService: ModeloService,private indi:IndicadoresService,
    public criterioService: CriteriosService,
    public subcriterioService: SubcriteriosService,
    public indicadorService: IndicadoresService,
    private asignacionIndicadorService: AsignacionIndicadorService,
    private sharedDataService: SharedDataService,
    private router: Router) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
    this.rol = this.login.getUserRole();
     }

  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
         this.user = this.login.getUser();
        console.log(" el usuario es "+this.user.id+" rol"+this.rol);

   
   
    let id = localStorage.getItem("id");
    this.id_modelo=Number(id);
    this.recibeModelo();
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }
  
  recibeModelo() {
    this.modeloService.getModeloById(Number(this.id_modelo)).subscribe(data => {
      this.model = data;
      this.asignacionIndicadorService.getAsignacionIndicadorByIdModelo(Number(this.id_modelo)).subscribe(info => {
        this.criterioService.getCriterios().subscribe(result => {
          this.asignacion = info;
          this.dataSource = result.filter((criterio: any) => {
            return info.some((asignacion: any) => {
              return criterio.id_criterio === asignacion.indicador.subcriterio.criterio.id_criterio;
            });
          });
          this.dataSource.paginator = this.paginator; // Moved here
        });
      });
    });
    this.listaind();
    this.coloresPro();
    this.valorespr();
  }

  listaind(){
    if(this.rol=='ADMIN'){
      this.criterioService.getIndicadorad(this.id_modelo,this.user.id).subscribe(
        (data: IndicadorProjection[]) => {
          this.listain=data;
          this.listain.forEach((item) => {
            this.coloresTarjetas.push(this.getRandomColor());
            this.borderStyles.push(this.getBorderColor(item.faltante-item.total));
          });
          if(data.length!=0){
            this.consul=true;
          }
          console.log("lista in "+this.listain)
        });
    }else{
    this.criterioService.getIndicador(this.id_modelo).subscribe(
      (data: IndicadorProjection[]) => {
        this.listain=data;
        this.listain.forEach((item) => {
          this.coloresTarjetas.push(this.getRandomColor());
          this.borderStyles.push(this.getBorderColor(item.faltante-item.total));
        });
        console.log("lista in "+this.listain)
      });
    }
  }

  irPonderacionModelo(modelo: Modelo): void {

    //llevar modelo

    localStorage.setItem("id", modelo.id_modelo.toString());
    console.log(modelo.id_modelo)
    this.model = modelo;
    this.router.navigate(['/sup/ponderacion/ponderacion-modelo']);


  }
  ponderacionCriterio(event: Event, element: any) {
    event.stopPropagation();
    // código del método del botón
    this.router.navigate(['/sup/ponderacion/ponderacion-criterio'], { queryParams: { criterio: element.id_criterio, modelo: this.id_modelo } });
  }

  mostrar(element: any) {
    console.log(element);
    this.sharedDataService.agregarIdCriterio(element.id_criterio);
    this.router.navigate(['/res/criterio-subcriterio']);
  }

  evaluacion(event: Event, element: any) {
    event.stopPropagation();
    // código del método del botón
    this.router.navigate(['/sup/modelo/matriz-evaluacion'], { queryParams: { criterio: element.id_criterio, modelo: this.id_modelo } });
  }

  ponderacion(event: Event, element: any) {
    event.stopPropagation();
    // código del método del botón
    this.sharedDataService.agregarIdCriterio(element.id_criterio);
  }

  getRandomColor(): string {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const alpha = 0.3; // Transparencia

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
  getBorderColor(total: number): string {
    const borderWidth = `${total*100}px`;
    const borderColor = this.getRandomColor();
    return `${borderWidth} solid ${borderColor}`;
  }

  fetchAndProcessData(nombre:string) {
    this.titulocriterio=nombre;
    this.datacrite = [];
    this.spans3 =[];
    this.clic = true;
    if(this.titulocriterio===""){
      this.titulocriterio="ORGANIZACIÓN";
      nombre="ORGANIZACIÓN";
    }
    this.criterioService.getIdCriterio(nombre).subscribe(data => {
      this.id_criterio = data.id_criterio;
      console.log("id crti: "+this.id_criterio);
    });
    this.modeloService.getlisdescrite(this.id_modelo,nombre).subscribe((data: criteriosdesprojection[]) => {
      this.datacrite = data;
      this.datacrite.forEach(item => {
        if (typeof this.seleccionados[item.criterionomj] === 'undefined') {
          this.seleccionados[item.criterionomj] = false;
        }
      });
      // Generar la jerarquía de celdas
      this.cacheSpan3('Criterio', (d) => d.criterionomj);
      this.cacheSpan3('Subcriterio', (d) => d.criterionomj + d.subcrierioj);
      this.cacheSpan3('Indicador', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej);
      this.cacheSpan3('Peso', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej+d.pes);
      this.cacheSpan3('Obtenido', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej+d.pes+d.obt);
      this.cacheSpan3('Utilidad', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej+d.pes+d.obt+d.uti);
      this.cacheSpan3('Valor', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej+d.pes+d.obt+d.uti+d.val);
      this.cacheSpan3('Evidencia', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej+d.pes+d.obt+d.uti+d.val+d.descrip);
      setTimeout(() => {
        this.aplicar();
      }, 0);
    });
  }

  aplicar() {
    this.datacrite.forEach(element => {
      element.randomColor = this.generarColor();
    });
    this.datacrite.forEach(element => {
      element.Colores = this.generarColor2();
    });
    this.datacrite.forEach(element => {
      element.indicol = this.generarColor3();
    });
  }

  generarColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  }
  generarColor2(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
  }
  
  generarColor3(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
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


  showValor() {
    this.verValor = !this.verValor;
  }
  
  showUtilidad() {
    this.verUtilidad = !this.verUtilidad;
  }
  
  showObtenido() {
    this.verObtenido = !this.verObtenido;
  }
  
  showCriterio() {
    this.verCriterio = !this.verCriterio;
  }
  showSubcriterio() {
    this.verSubcriterio = !this.verSubcriterio;
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
  
  getColorcelda(elementName: string, opacity: number): string {
    if (!this.coloresAsignados[elementName]) {
      const red = Math.floor(Math.random() * 256);
      const green = Math.floor(Math.random() * 256);
      const blue = Math.floor(Math.random() * 256);
      
      this.coloresAsignados[elementName] = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
    }
  
    return this.coloresAsignados[elementName];
  }

  calcularRowSpanValue(index: number): void {
    this.rowSpanValue = this.getRowSpan3('Indicador', index);
  }

  colores(color: string): string {
    switch (color) {
      case 'verde':
        return 'green';
      case 'amarillo':
        return 'yellow';
      case 'naranja':
        return 'orange';
      case 'rojo':
        return 'red';
      case 'Total':
        return 'gray';
      default:
        return 'transparent'; // O cualquier otro color por defecto
    }
  }

  coloresPro(){
    if(this.rol=='ADMIN'){
      this.indi.getIndicAdmin(this.id_modelo,this.user.id).subscribe((data: IndiColProjection[]) => {
        this.indicol = data; // Calcula los totales
        this.pieChartData.datasets[0].data = this.indicol.map(val => val.porcentaje);
        const estadoColores: { [key: string]: string } = {
          'rojo': '>=0',
          'naranja':'>25',
          'amarillo':'>50',
          'verde':'>75',
        };
  
        const estadosIndicadores = data.map(indicador => indicador.color);
        
        // Asigna colores a los elementos del gráfico según los estados
        this.pieChartData.labels = estadosIndicadores.map(estado=> estadoColores[estado]);
  
       // this.pieChartData.labels = data.map(indicador => indicador.color);
  
        if(this.pieChartOptions?.elements?.arc?.backgroundColor !=undefined){
        this.pieChartOptions.elements.arc.backgroundColor = this.indicol.map(
          indicador => colors[indicador.color]
        );}
        this.pieChartData = { ...this.pieChartData };
        const totalIndicadores = this.indicol.reduce((total, element) => total + element.indica, 0);
        const totalPorcentaje = this.indicol.reduce((total, element) => total + element.porcentaje, 0);
        const total=Math.round(totalPorcentaje);
  
        // Agrega la fila de totales al final del arreglo
        this.indicol.push({
          color: 'Total',
          indica: totalIndicadores,
          porcentaje: total,
        });
        
        this.indicol.sort((a, b) => {
          const orden = ['verde', 'amarillo', 'naranja', 'rojo','Total'];
          return orden.indexOf(a.color) - orden.indexOf(b.color);
        });
        // Asigna el arreglo de datos actualizado al dataSource
        this.tabla = new MatTableDataSource(this.indicol);
      });
    }else{
    this.indi.getIndicadorColProjection(this.id_modelo).subscribe((data: IndiColProjection[]) => {
      this.indicol = data;
      this.pieChartData.datasets[0].data = this.indicol.map(val => val.porcentaje);
      const estadoColores: { [key: string]: string } = {
        'rojo': '>=0',
        'naranja':'>25',
        'amarillo':'>50',
        'verde':'>75',
      };

      const estadosIndicadores = data.map(indicador => indicador.color);
      this.pieChartData.labels = estadosIndicadores.map(estado=> estadoColores[estado]);

      if(this.pieChartOptions?.elements?.arc?.backgroundColor !=undefined){
      this.pieChartOptions.elements.arc.backgroundColor = this.indicol.map(
        indicador => colors[indicador.color]
      );}
      this.pieChartData = { ...this.pieChartData };
      const totalIndicadores = this.indicol.reduce((total, element) => total + element.indica, 0);
      const totalPorcentaje = this.indicol.reduce((total, element) => total + element.porcentaje, 0);
      const total=Math.round(totalPorcentaje);

      this.indicol.push({
        color: 'Total',
        indica: totalIndicadores,
        porcentaje: total,
      });
      
      this.indicol.sort((a, b) => {
        const orden = ['verde', 'amarillo', 'naranja', 'rojo','Total'];
        return orden.indexOf(a.color) - orden.indexOf(b.color);
      });

      this.tabla = new MatTableDataSource(this.indicol);
    });
   }
  }

  valorespr(){
    this.criterioService.getvalorad(this.id_modelo,this.user.id).subscribe((valores: ValoresProjection[]) => {
      this.valoresp = valores;
      this.barChartData.labels = this.valoresp.map(val => val.nomcriterio);
      this.barChartData.datasets[0].data = this.valoresp.map(val => val.vlObtenido);
      this.barChartData.datasets[1].data = this.valoresp.map(val => val.vlobtener);
  
      this.barChartData = { ...this.barChartData };
    });
  }
}