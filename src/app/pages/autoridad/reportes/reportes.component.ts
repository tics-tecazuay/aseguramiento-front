import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ChartOptions, ChartConfiguration, Color, ChartEvent, ChartType, ChartData } from 'chart.js';
import { forkJoin } from 'rxjs';
import { IndiColProjection } from 'src/app/interface/IndiColProjection';
import { IndicadorProjection } from 'src/app/interface/IndicadorProjection';
import { criteriosdesprojection } from 'src/app/interface/criteriosdesprojection';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { CriteriosService } from 'src/app/services/criterios.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { BaseChartDirective } from 'ng2-charts';
import { ValoresProjection } from 'src/app/interface/ValoresProjection';

const colors: { [key: string]: string } = {
  verde: '#00FF00', // Por ejemplo, 'verde' se asocia con el color verde en hexadecimal
  naranja: '#FFA500', // 'naranja' se asocia con el color naranja en hexadecimal
  rojo: '#FF0000', // 'rojo' se asocia con el color rojo en hexadecimal
  amarillo: '#f8f32b',
};

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  title = 'ng2-charts-demo';
  modeloMaximo:any;
  id_modelo!:number;
  titulocriterio!: string;
  datacrite: any[] = [];
  spans3: any[] = [];
  displayedColumns3: string[] = ['Criterio', 'Subcriterio', 'Indicador','Evidencia','Peso','Obtenido','Utilidad','Valor'];
  displayedColumns4: string[] = ['indicadores', 'nindi', 'porcentaje'];
  id_criterio!:number;
  rowSpanValue: number = 0;
  seleccionados: { [key: string]: boolean } = {};
  todosSeleccionados=false;
  tabla!: MatTableDataSource<any>;
  coloresAsignados: { [key: string]: string } = {}; 
//let id = localStorage.getItem("idM");
verEvidencia=false;
verIndicador=true;
verPeso=true;
verObtenido=true;
verUtilidad=true;
verValor=true;
verSubcriterio=true;
verCriterio=false;
  //
  clic: boolean = false;
  valoresp:ValoresProjection[] = [];
  labesCriterios: any[] = [];
  datosPOrceCriter: number[] = [];
  criteri: any;
  valores: number[] = [];
  coloresTarjetas: string[] = [];
  borderStyles: string[] = [];
  listain: IndicadorProjection[] = [];
  indicol:IndiColProjection[] = [];
  //barras
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
  constructor(private modelservices: ModeloService,private httpCriterios:CriteriosService,private indi:IndicadoresService) {
    //this.getButtonCriterio();
  }


  ngOnInit(): void {
    //this.getButtonIndicadores();
    let id = localStorage.getItem("idM");
    this.id_modelo=Number(id);
    console.log("Id modelo aut "+this.id_modelo);
    this.nombremodelo();
    this.listaind();
    this.coloresPro();
    this.valorespr();
  }

  nombremodelo(){
    this.modelservices.getModeloById(this.id_modelo).subscribe((data) => {
      this.modeloMaximo = data;});
     
  }
  
  listaind(){
    this.httpCriterios.getIndicador(this.id_modelo).subscribe(
      (data: IndicadorProjection[]) => {
        this.listain=data;
        this.listain.forEach((item) => {
          this.coloresTarjetas.push(this.getRandomColor());
          this.borderStyles.push(this.getBorderColor(item.faltante-item.total));
        });
        console.log("lista in "+this.listain)
      });
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
    this.httpCriterios.getIdCriterio(nombre).subscribe(data => {
      this.id_criterio = data.id_criterio;
      console.log("id crti: "+this.id_criterio);
    });
    this.modelservices.getlisdescrite(this.id_modelo,nombre).subscribe((data: criteriosdesprojection[]) => {
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
    this.indi.getIndicadorColProjection(this.id_modelo).subscribe((data: IndiColProjection[]) => {
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
  }

  valorespr(){
    this.httpCriterios.getvalores(this.id_modelo).subscribe((valores: ValoresProjection[]) => {
      this.valoresp = valores;
      console.log("Valores de tabla"+JSON.stringify(this.valoresp))
      this.barChartData.labels = this.valoresp.map(val => val.nomcriterio);
      this.barChartData.datasets[0].data = this.valoresp.map(val => val.vlObtenido);
      this.barChartData.datasets[1].data = this.valoresp.map(val => val.vlobtener);
  
      this.barChartData = { ...this.barChartData };
    });
  }
}
