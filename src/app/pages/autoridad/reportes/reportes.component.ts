import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ChartConfiguration, ChartEvent, ChartType, ChartData } from 'chart.js';
import { IndiColProjection } from 'src/app/interface/IndiColProjection';
import { IndicadorProjection } from 'src/app/interface/IndicadorProjection';
import { criteriosdesprojection } from 'src/app/interface/criteriosdesprojection';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { CriteriosService } from 'src/app/services/criterios.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { BaseChartDirective } from 'ng2-charts';
import { ValoresProjection } from 'src/app/interface/ValoresProjection';
import { CriterioPorcProjection } from 'src/app/interface/CriterioPorcProjection';
import { SubcriterioPorcProjection } from 'src/app/interface/SubcriterioPorcProjection';
import { IndicadorPorcProjection } from 'src/app/interface/IndicadorPorcProjection';
import { SubcriteriosService } from 'src/app/services/subcriterios.service';
import { ActividadService } from 'src/app/services/actividad.service';
import { ActividadesProjection } from 'src/app/interface/ActividadesProjection';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { ActiDiagramaPieProjection } from 'src/app/models/Evidencia';
import { Chart, registerables } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LoginService } from 'src/app/services/login.service';
import { Modelo } from 'src/app/models/Modelo';

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
  coloresPasteles: string[] = ['#9befd7', '#ff8c78', '#e0b0ff', '#f9db4a', '#bceeff', '#ff69b4'];
  title = 'ng2-charts-demo';
  //id_modelo!: number;
  idmodel!: number;
  nombreModelo!: string;
  titulocriterio!: string;
  datacrite: any[] = [];
  spans3: any[] = [];
  displayedColumns3: string[] = ['Criterio', 'Subcriterio', 'Indicador', 'Evidencia', 'Peso', 'Obtenido', 'Utilidad', 'Valor'];
  displayedColumns4: string[] = ['indicadores', 'nindi', 'porcentaje'];
  id_criterio!: number;
  rowSpanValue: number = 0;
  seleccionados: { [key: string]: boolean } = {};
  todosSeleccionados = false;
  tabla!: MatTableDataSource<any>;
  coloresAsignados: { [key: string]: string } = {};
  isLoading = false;
  gbarrasCriterios = false;
  mostrargrafico = false;
  gbarrasSubcriterios = false;
  gbarrasIndicadores = false;
  gbarrasIndividual = false;
  vertit = true;
  texto!: string;
  cnombre: string = ''
  listaIndicadores: CriterioPorcProjection[] = [];
  listain: CriterioPorcProjection[] = [];
  valoresp: CriterioPorcProjection[] = [];
  valoresp2: ValoresProjection[] = [];
  valoresporcsub: SubcriterioPorcProjection[] = [];
  valoresporcind: IndicadorPorcProjection[] = [];
  datos: any[] = [];
  colorScheme: any;
  listact: ActividadesProjection[] = [];
  conteoActividades: { estado: string, conteo: number }[] = [];
  //let id = localStorage.getItem("idM");
  verEvidencia = true;
  verIndicador = true;
  verPeso = true;
  verObtenido = true;
  verUtilidad = true;
  verValor = true;
  verSubcriterio = true;
  verCriterio = true;
  listaCriterios: any[] = [];
  snombre!: string;
  crite: any[] = [];
  avances: any[] = [];
  valoresevid = false;
  isLoggedIn = false;
  user: any = null;
  id!: number;
  titulo = '% de Avance';
  //
  clic: boolean = false;
  labesCriterios: any[] = [];
  datosPOrceCriter: number[] = [];
  criteri: any;
  valores: number[] = [];
  coloresTarjetas: string[] = [];
  borderStyles: string[] = [];
  indicol: IndiColProjection[] = [];
  valoresporcentajes: number[] = [];
  porcentajes!: ActiDiagramaPieProjection;
  modeloVigente!: Modelo;
  modeloSeleccionado!: Modelo;
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

  //Grafica de barrasGeneral- Criterios
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'V/Obtenido', backgroundColor: ['#9befd7', '#ff8c78', '#e0b0ff', '#f9db4a', '#bceeff', '#ff69b4'] },
      { data: [], label: 'V/por obtener', backgroundColor: 'rgba(184,54,51,255)' },
    ],
  };
  //Grafica de barrasIndividual- Criterios
  public barChartData2: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'V/Obtenido', backgroundColor: ['#9befd7', '#ff8c78', '#e0b0ff', '#f9db4a', '#bceeff', '#ff69b4'] },
      { data: [], label: 'V/por obtener', backgroundColor: 'rgba(184,54,51,255)' },
    ],
  };
  //Grafica de barrasGeneral- Subcriterios
  public barChartDataSubcriterios: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'V/Obtenido', backgroundColor: ['#9befd7', '#ff8c78', '#e0b0ff', '#f9db4a', '#bceeff', '#ff69b4'] },
      { data: [], label: 'V/por obtener', backgroundColor: 'rgba(184,54,51,255)' },
    ],
  };
  //Grafica de barrasGeneral- Indicadores
  public barChartDataIndicadores: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'V/Obtenido', backgroundColor: ['#9befd7', '#ff8c78', '#e0b0ff', '#f9db4a', '#bceeff', '#ff69b4'] },
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
        color: '#000',
        font: {
          weight: 'bold',
          size: 16,
        },
        formatter: (value: any, ctx: any) => {
          const dataset = ctx.chart.data.datasets[ctx.datasetIndex];
          const total = dataset.data.reduce((prev: any, curr: any) => prev + curr, 0);
          const currentValue = dataset.data[ctx.dataIndex];
          const percentage = Math.round((currentValue / total) * 100) + '%';
          return percentage;
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
      },
    }
  };
  // Pie 2 (Grafica de Estados de Evidencias)
  public pieChartOptions2: ChartConfiguration['options'] = {
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
      },
    }
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

  public pieChartData2: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };
  public pieChartType2: ChartType = 'pie';
  public pieChartPlugins2 = [DataLabelsPlugin];

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
  //** Grafica de dona  
  public chartDoughnut!: Chart;
  public dataD = {
    labels: [] as string[],
    datasets: [
      {
        label: 'Total',
        data: [] as number[],
        backgroundColor: [] as string[],
      },
      {
        label: 'Faltante',
        data: [] as number[],
        backgroundColor: [] as string[],
      }
    ]
  };

  constructor(private indicadorService: IndicadoresService, private modelservices: ModeloService, private httpCriterios: CriteriosService, private indi: IndicadoresService,
    private criterioService: CriteriosService, private subcriterioService: SubcriteriosService, private services: ActividadService,
    private servicesEvidencia: EvidenciaService, public login: LoginService,
  ) {
    this.colorScheme = {
      domain: ['#9befd7', '#ff8c78', '#e0b0ff', '#f9db4a', '#bceeff', '#ff69b4'],
    };
    Chart.register(...registerables);
    Chart.register(ChartDataLabels); // Registrar el plugin datalabels
  }


  ngOnInit(): void {
    this.isLoading = true;
    this.gbarrasCriterios = true;

    //Dos flujos uno para comprabar si se mando el rol autoridad con el modelo que seleciono para que entre a mostrar con ese modelo o caso contrario se asigna el modelo vigente si no es el caso
    if(history.state.rol == "AUTORIDAD"){
    this.modeloSeleccionado = history.state.modelo || {};
    this.idmodel= this.modeloSeleccionado.id_modelo;
    this.nombreModelo = this.modeloSeleccionado.nombre;
    }else{
      this.modeloVigente = JSON.parse(localStorage.getItem('modelo') || '{}');
      this.idmodel = this.modeloVigente.id_modelo;
      this.nombreModelo = this.modeloVigente.nombre;
    }
    //let id = localStorage.getItem("idM");
    //this.id_modelo = Number(id);
    //console.log("Id modelo seleccionado " + this.id_modelo);
    //this.nombremodelo();
    //this.coloresPro();
    //this.valorespr();
    //Grafica de dona
    this.modeloMax();
    //Grafica de dona
    this.chartDoughnut = new Chart("cdoughtnut", {
      type: 'doughnut' as ChartType,
      data: this.dataD,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          datalabels: {
            color: '#000',
            font: {
              weight: 'bold'
            },
            formatter: (value, ctx) => {
              if (typeof value === 'number') {
                return value.toFixed(2) + "%"; // Agregar símbolo de porcentaje
              }
              return "";
            }
          }
        }
      }
    });
    this.servicesEvidencia.getPorcentajesEstadosGeneral(this.idmodel).subscribe((data: ActiDiagramaPieProjection) => {
      console.log('DATA DEL GRAFICO', data);
      if (data.porcentaje_pendientes == null) {
        this.valoresevid = true;
      }
      this.porcentajes = data;
      this.valoresporcentajes = [
        this.porcentajes.porcentaje_rechazados,
        this.porcentajes.porcentaje_pendientes,
        this.porcentajes.porcentaje_aprobados
      ];
      this.conteoActividades = [
        { estado: 'Actividad/es Aprobadas', conteo: this.porcentajes.aprobados },
        { estado: 'Actividad/es Rechazadas', conteo: this.porcentajes.rechazados },
        { estado: 'Actividad/es Pendientes', conteo: this.porcentajes.pendientes }

      ];
      // Actualiza los datos de la gráfica
      this.pieChartData2 = {
        labels: ['RECHAZADAS', 'PENDIENTES', 'APROBADAS'],
        datasets: [
          {
            label: 'Seguimiento de Actividades',
            data: this.valoresporcentajes,
            backgroundColor: ['rgb(251, 98, 100)', 'rgb(255, 205, 86)', 'rgb(132, 230, 142)'],
            hoverOffset: 4,
          },
        ],
      };
    });

    //this.isLoading = false;
  }


  modeloMax() {
      
      this.valorespr();
      this.coloresPro();
      this.obtenerPorcentajeAvances(this.idmodel);
      console.log("ID Modelo:", this.idmodel);
      //this.fetchAndProcessData("");
      this.isLoading = false;
  
  }

  grafCom() {
    this.mostrargrafico = !this.mostrargrafico;
    this.gbarrasCriterios = !this.gbarrasCriterios;
    this.vertitulo();
  }

  cargarDatos() {
    console.log("INDICADORES AAAAAAAAAAAAAAAAAAA", this.listaIndicadores);
    this.crite = this.listaIndicadores.map(item => ({
      name: item.nombre,
      value: ((item.total + item.faltante) !== 0 ? (item.total / (item.total + item.faltante)) * 100 : 0)
    }));

    // Reiniciar los arreglos para evitar duplicados
    this.coloresTarjetas = [];
    this.borderStyles = [];
    // Asignar colores predefinidos
    this.listaIndicadores.forEach((item, index) => {
      // Limitar el número de decimales a 2 para total y faltante
      item.total = Number(item.total);
      item.faltante = Number(item.faltante);
      this.coloresTarjetas.push(this.coloresPasteles[index % this.coloresPasteles.length]);
      this.borderStyles.push(this.getBorderColor(item.faltante - item.total));
    }
    );
    
    // Asignar los datos a la gráfica
    const ndatosTotales = this.listaIndicadores.map(val => parseFloat(((val.total + val.faltante) * 100).toFixed(2)));
    const ndatosFaltantes = this.listaIndicadores.map(val => parseFloat(((val.faltante) * 100).toFixed(2)));
    const labels = this.listaIndicadores.map(val => this.truncateCadenaGrafica(val.nombre));
    const nuevosColores = this.listaIndicadores.map((_, index) => this.coloresPasteles[index % this.coloresPasteles.length]);
    this.dataD.datasets[0].data = ndatosTotales;
    this.dataD.datasets[0].backgroundColor = nuevosColores;
    this.dataD.datasets[1].data = ndatosFaltantes;
    this.dataD.datasets[1].backgroundColor = nuevosColores;
    this.dataD.labels = labels;

    // Llamar a update() para actualizar la gráfica
    if (this.chartDoughnut) {
      this.chartDoughnut.data = this.dataD;
      this.chartDoughnut.update();
    }
  }

  getRandomColor(): string {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const alpha = 0.3; // Transparencia

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
  getBorderColor(total: number): string {
    const borderWidth = `${total * 100}px`;
    const borderColor = this.getRandomColor();
    return `${borderWidth} solid ${borderColor}`;
  }

  volvergbCriterios() {
    if (this.clic == true && this.gbarrasIndividual == true) {
      this.mostrargrafico = true;
      this.gbarrasSubcriterios = false;
      this.gbarrasIndicadores = false;
    } else if (this.clic == false || this.mostrargrafico == false) {
      this.gbarrasCriterios = true;
      this.gbarrasSubcriterios = false;
      this.gbarrasIndicadores = false;
      this.gbarrasIndividual = false;
    }
  }
  volvergbSubcriterios() {
    this.gbarrasCriterios = false;
    this.gbarrasSubcriterios = true;
    this.gbarrasIndicadores = false;
  }

  vertitulo() {
    if (this.vertit) {
      this.texto = "-           No ha seleccionado ningún criterio"
    } else {
      this.texto = "";
    }
  }

  fetchAndProcessData(nombre: string) {
    this.isLoading = true;
    this.titulocriterio = nombre;
    this.datacrite = [];
    this.spans3 = [];
    this.clic = true;
    this.vertit = false;
    this.vertitulo();
    this.mostrargrafico = true;
    this.gbarrasCriterios = false;
    this.gbarrasSubcriterios = false;
    this.gbarrasIndicadores = false;
    this.valorescriterio(nombre);
    if (this.titulocriterio === "") {
      this.titulocriterio = "ORGANIZACIÓN";
      nombre = "ORGANIZACIÓN";
    }
    this.httpCriterios.getIdCriterio(nombre).subscribe(data => {
      this.id_criterio = data.id_criterio;

    });
    this.modelservices.getlisdescrite(this.idmodel, nombre).subscribe((data: criteriosdesprojection[]) => {
      this.datacrite = data;
      console.log("DATA DE CRITERIOS", this.datacrite);
      this.datacrite.forEach(item => {
        if (typeof this.seleccionados[item.criterionomj] === 'undefined') {
          this.seleccionados[item.criterionomj] = false;
        }
      });
      // Generar la jerarquía de celdas
      this.cacheSpan3('Criterio', (d) => d.criterionomj);
      this.cacheSpan3('Subcriterio', (d) => d.criterionomj + d.subcrierioj);
      this.cacheSpan3('Indicador', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej);
      this.cacheSpan3('Peso', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes);
      this.cacheSpan3('Obtenido', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt);
      this.cacheSpan3('Utilidad', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti);
      this.cacheSpan3('Valor', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti + d.val);
      this.cacheSpan3('Evidencia', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti + d.val + d.descrip);
      setTimeout(() => {
        this.aplicar();
      }, 0);
    });
  }

  //Valores de las grafica de barras general - Criterios
  valorespr() {
    this.criterioService.getvaloresporcCriterios(this.idmodel).subscribe((valores: CriterioPorcProjection[]) => {
      console.log("VALORES DE CRITERIOS TRAIDOS DEL BACK SIN ASIGNAR V", valores);
      this.listain = valores;
      console.log("LISTAIN: ", this.listain);
      this.valoresp = valores;
      this.listaIndicadores = valores;
      this.cargarDatos();
      this.barChartData.labels = this.valoresp.map(val => val.nombre);
      this.barChartData.datasets[0].data = this.valoresp.map(val => parseFloat(val.total.toFixed(3))); // Redondear y convertir a número
      this.barChartData.datasets[1].data = this.valoresp.map(val => parseFloat(val.faltante.toFixed(3))); // Redondear y convertir a número

      this.barChartData = { ...this.barChartData };
    });
  }
  //Valores de las grafica de barras individual - Criterios
  valorescriterio(nombre: string) {
    this.httpCriterios.getvalorescriterio(this.idmodel, nombre).subscribe((valores: ValoresProjection[]) => {
      this.valoresp2 = valores;

      this.barChartData2.labels = this.valoresp2.map(val => val.nomcriterio);
      this.barChartData2.datasets[0].data = this.valoresp2.map(val => val.vlObtenido);
      this.barChartData2.datasets[1].data = this.valoresp2.map(val => val.vlobtener);

      this.barChartData2 = { ...this.barChartData2 };
    });
  }
  //Valores de las grafica de barras general - Subcriterios
  valoresSubcriterios(cri_nombre: string) {
    this.subcriterioService.getvaloresporcSubcriterios(cri_nombre, this.idmodel).subscribe((valores: SubcriterioPorcProjection[]) => {
      this.valoresporcsub = valores;

      this.barChartDataSubcriterios.labels = this.valoresporcsub.map(val => val.nombre);
      this.barChartDataSubcriterios.datasets[0].data = this.valoresporcsub.map(val => parseFloat(val.total.toFixed(3)));
      this.barChartDataSubcriterios.datasets[1].data = this.valoresporcsub.map(val => parseFloat(val.faltante.toFixed(3)));

      this.barChartDataSubcriterios = { ...this.barChartDataSubcriterios };
    });
  }
  //Valores de las grafica de barras general - Indicadores
  valoresIndicadores(sub_nombre: string) {
    this.indicadorService.getvaloresporcIndicadores(sub_nombre, this.idmodel).subscribe((valores: IndicadorPorcProjection[]) => {
      this.valoresporcind = valores;

      this.barChartDataIndicadores.labels = this.valoresporcind.map(val => this.truncateCadenaGrafica(val.nombre));
      this.barChartDataIndicadores.datasets[0].data = this.valoresporcind.map(val => parseFloat(val.total.toFixed(3)));
      this.barChartDataIndicadores.datasets[1].data = this.valoresporcind.map(val => parseFloat(val.faltante.toFixed(3)));

      this.barChartDataIndicadores = { ...this.barChartDataIndicadores };
    });
  }

  truncateCadenaGrafica(cadena: string): string {
    const words = cadena.split(' ');
    if (words.length > 3) {
      return words.slice(0, 3).join(' ') + '...';
    } else {
      return cadena;
    }
  }

  public chartClickedCS({ active }: {
    active?: object[];
  }): void {
    if (active != null) {
      if (active.length == 0) {
        console.log("No se selecciono ningun criterio");
      } else {
        active.forEach((element: any) => {
          this.cnombre = this.barChartData.labels?.[element.index]?.toString() || ''; // Obtener el criterio con verificación de nulidad
          if (this.cnombre != null) {
            this.valoresSubcriterios(this.cnombre);
          }

        });
        this.gbarrasCriterios = false;
        this.gbarrasSubcriterios = true;
        this.gbarrasIndicadores = false;
        this.gbarrasIndividual = false;
        if (this.clic == true && this.mostrargrafico == true) {
          this.mostrargrafico = !this.mostrargrafico;
          this.gbarrasIndividual = true
        }
      }
    }
  }
  public chartClickedSI({ active }: {
    active?: object[];
  }): void {
    if (active != null) {
      if (active.length == 0) {
        console.log("No se selecciono ningun subcriterio");
      } else {
        active?.forEach((element: any) => {
          this.snombre = this.barChartDataSubcriterios?.labels?.[element.index]?.toString() || ''; // Obtener el subcriterio con verificación de nulidad
          this.valoresIndicadores(this.snombre);
        });
        this.gbarrasCriterios = false;
        this.gbarrasSubcriterios = false;
        this.gbarrasIndicadores = true;
      }
    }
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
    this.isLoading = false;
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

  coloresPro() {
    this.indi.getIndicadorColProjection(this.idmodel).subscribe((data: IndiColProjection[]) => {
      this.indicol = data; // Calcula los totales
      this.pieChartData.datasets[0].data = this.indicol.map(val => val.porcentaje);
      const estadoColores: { [key: string]: string } = {
        'rojo': '>=0',
        'naranja': '>25',
        'amarillo': '>50',
        'verde': '>75',
      };

      const estadosIndicadores = data.map(indicador => indicador.color);

      // Asigna colores a los elementos del gráfico según los estados
      this.pieChartData.labels = estadosIndicadores.map(estado => estadoColores[estado]);

      // this.pieChartData.labels = data.map(indicador => indicador.color);

      if (this.pieChartOptions?.elements?.arc?.backgroundColor != undefined) {
        this.pieChartOptions.elements.arc.backgroundColor = this.indicol.map(
          indicador => colors[indicador.color]
        );
      }
      this.pieChartData = { ...this.pieChartData };
      const totalIndicadores = this.indicol.reduce((total, element) => total + element.indica, 0);
      const totalPorcentaje = this.indicol.reduce((total, element) => total + element.porcentaje, 0);
      const total = Math.round(totalPorcentaje);

      // Agrega la fila de totales al final del arreglo
      this.indicol.push({
        color: 'Total',
        indica: totalIndicadores,
        porcentaje: total,
      });

      this.indicol.sort((a, b) => {
        const orden = ['verde', 'amarillo', 'naranja', 'rojo', 'Total'];
        return orden.indexOf(a.color) - orden.indexOf(b.color);
      });
      // Asigna el arreglo de datos actualizado al dataSource
      this.tabla = new MatTableDataSource(this.indicol);
    });
  }
  obtenerPorcentajeAvances(id_modelo: number) {
    this.services.getAc(id_modelo).subscribe(
      (actividades: ActividadesProjection[]) => {
        this.listact = actividades;

        this.avances = this.listact.map(item => ({
          name: item.nombres,
          value: item.avance
        }));

      },
      (error) => {
        console.error('Error al obtener las actividades:', error);
      }
    );
  }
}
