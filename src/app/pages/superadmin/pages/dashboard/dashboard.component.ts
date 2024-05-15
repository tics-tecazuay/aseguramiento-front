import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Persona2 } from 'src/app/models/Persona2';
import { ActividadService } from 'src/app/services/actividad.service';
import Swal from 'sweetalert2';
import { CriteriosService } from 'src/app/services/criterios.service';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { CalendarOptions } from '@fullcalendar/core';;
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { Notificacion } from 'src/app/models/Notificacion';
import { LoginService } from 'src/app/services/login.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { ActividadesProjection } from 'src/app/interface/ActividadesProjection';
import { ActivAprobadaProjection } from 'src/app/interface/ActivAprobadaProjection';
import { criteriosdesprojection } from 'src/app/interface/criteriosdesprojection';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { ValoresProjection } from 'src/app/interface/ValoresProjection';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { IndiColProjection } from 'src/app/interface/IndiColProjection';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CalificacionComponent } from '../../modelo/matriz-evaluacion/calificacion/calificacion.component';
import { ActividadesCalendar } from 'src/app/models/Asignacion-Evidencia';
import { SubcriteriosService } from 'src/app/services/subcriterios.service';
import { SubcriterioPorcProjection } from 'src/app/interface/SubcriterioPorcProjection';
import { IndicadorPorcProjection } from 'src/app/interface/IndicadorPorcProjection';
import { CriterioPorcProjection } from 'src/app/interface/CriterioPorcProjection';
import { Chart, registerables } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Modelo } from 'src/app/models/Modelo';
import { ActiDiagramaPieProjection } from 'src/app/models/Evidencia';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})

export class DashboardComponent2 implements OnInit {
  coloresPasteles: string[] = ['#9befd7', '#ff8c78', '#e0b0ff', '#f9db4a', '#bceeff', '#ff69b4'];
  colorcontraste: string[] = ['#8a8a8a'];
  coloresPredefinidos: string[] = [
    '#9befd7', // Verde agua claro
    '#ff8c78', // Rosa pálido
    '#e0b0ff', // Lila suave
    '#f9db4a', // Amarillo pastel
    '#bceeff', // Azul claro
    '#ff69b4', // Coral suave
    '#b19cd9', // Lila lavanda
    '#ffd700', // Amarillo oro
    '#87ceeb', // Azul cielo
    '#ff7f50', // Naranja coral
    '#00fa9a', // Verde menta
    '#ff1493'  // Rosa profundo
  ];
  indiceColorGlobal = 0;
  displayedColumns5: string[] = ['enca', 'crit', 'subc', 'indic', 'descr'];
  displayedColumns6: string[] = ['enca', 'crit', 'subc', 'indic', 'descr'];
  displayedColumns4: string[] = ['indicadores', 'nindi', 'porcentaje'];
  displayedColumns: string[] = ['encargado', 'fechainicio', 'fechafin', 'criterio', 'subcriterio', 'indicadores', 'evidencia', 'enlace'];
  displayedColumns1: string[] = ['encargado', 'fechainicio', 'fechafin', 'criterio', 'subcriterio', 'indicadores', 'evidencia', 'enlace'];
  displayedColumns8: string[] = ['encargado', 'fechainicio', 'fechafin', 'criterio', 'subcriterio', 'indicadores', 'evidencia', 'enlace'];
  displayedColumns3: string[] = ['Criterio', 'Subcriterio', 'Indicador', 'Peso', 'Evidencia', 'PesoEvid', 'Obtenido', 'Utilidad', 'Valor', 'Archivos', 'Idind', 'Tipo', 'CalificarEvid', 'Calificar'];
  isLoggedIn = false;
  user: any = null;
  texto!: string;
  id_criterio!: number;
  titulocriterio!: string;
  rol: any = null;
  notificaciones: Notificacion[] = [];
  numNotificacionesSinLeer: number = 0;
  selectedColor: string = "";
  mostrargrafico = false;
  valoresevid = false;
  //** Tablas de evidencias
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
  @ViewChild('paginatorAprob', { static: false }) paginatorAprob?: MatPaginator;
  @ViewChild('paginatorPend', { static: false }) paginatorPend?: MatPaginator;
  @ViewChild('paginatorRecha', { static: false }) paginatorRecha?: MatPaginator;
  dataSource = new MatTableDataSource<ActivAprobadaProjection>();
  dataSource1 = new MatTableDataSource<ActivAprobadaProjection>();
  dataSource8 = new MatTableDataSource<ActivAprobadaProjection>();

  titulo = '% de Avance';
  titulo2 = 'Avance de las Actividades';
  titulo3 = 'Responsables';
  @Input() color: ThemePalette = "primary";
  //Seleccionar check
  seleccionados: { [key: string]: boolean } = {};
  todosSeleccionados = false;
  spansAprob: any[] = [];
  spansPend: any[] = [];
  spansRech: any[] = [];
  spansTablaCriterios: any[] = [];
  coloresTarjetas: string[] = [];
  borderStyles: string[] = [];
  rowSpanValue: number = 0;
  vertit = true;
  datacrite: any[] = [];
  valores: number[] = [10, 0];
  listaCriterios: any[] = [];
  valoresp: CriterioPorcProjection[] = [];
  valoresp2: ValoresProjection[] = [];
  valoresporcsub: SubcriterioPorcProjection[] = [];
  valoresporcind: IndicadorPorcProjection[] = [];
  modeloVigente!: Modelo;
  listaIndicadores: CriterioPorcProjection[] = [];
  listain: CriterioPorcProjection[] = [];
  persona: Persona2 = new Persona2();
  suma: { [nombre: string]: number } = {};
  colorScheme: any;
  datos: any[] = [];
  width = 600;
  height = 400;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  view: [number, number] = [700, 400]; // Tamaño del gráfico (ancho x alto)
  id_ev!: number;
  Utilidad!: number;
  idmodel!: number;
  items: any[] = [];
  eventos: any[] = [];
  crite: any[] = [];
  avances: any[] = [];
  //FIN DE VISTA
  listact: ActividadesProjection[] = [];
  indicol: IndiColProjection[] = [];
  tabla!: MatTableDataSource<any>;
  Evidencias: any[] = [];
  clic: boolean = false;
  verEvidencia = true;
  verTipo = true;
  ocultar = false;
  verIndicador = true;
  verPeso = true;
  verPesoEvid = true;
  verObtenido = true;
  verUtilidad = false;
  verArchivo = true;
  verValor = true;
  verSubcriterio = true;
  verCriterio = false;
  gbarrasCriterios = false;
  gbarrasSubcriterios = false;
  gbarrasIndicadores = false;
  gbarrasIndividual = false;
  isLoading = false;
  cnombre: string = ''
  snombre!: string;
  coloresAsignados: { [key: string]: string } = {};
  background!: string;
  conteoActividades: { estado: string, conteo: number }[] = [];
  porcentajes!: ActiDiagramaPieProjection;
  valoresporcentajes: number[] = [];

  //Bar grafica
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

  //** Grafica de barrasGeneral- Criterios
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'V/Obtenido', backgroundColor: ['#9befd7', '#ff8c78', '#e0b0ff', '#f9db4a', '#bceeff', '#ff69b4'] },
      { data: [], label: 'V/por obtener', backgroundColor: 'rgba(184,54,51,255)' },
    ],
  };
  //** Grafica de barrasIndividual- Criterios
  public barChartData2: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'V/Obtenido', backgroundColor: ['#9befd7', '#ff8c78', '#e0b0ff', '#f9db4a', '#bceeff', '#ff69b4'] },
      { data: [], label: 'V/por obtener', backgroundColor: 'rgba(184,54,51,255)' },
    ],
  };
  //** Grafica de barrasGeneral- Subcriterios
  public barChartDataSubcriterios: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'V/Obtenido', backgroundColor: ['#9befd7', '#ff8c78', '#e0b0ff', '#f9db4a', '#bceeff', '#ff69b4'] },
      { data: [], label: 'V/por obtener', backgroundColor: 'rgba(184,54,51,255)' },
    ],
  };
  //** Grafica de barrasGeneral- Indicadores
  public barChartDataIndicadores: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'V/Obtenido', backgroundColor: ['#9befd7', '#ff8c78', '#e0b0ff', '#f9db4a', '#bceeff', '#ff69b4'] },
      { data: [], label: 'V/por obtener', backgroundColor: 'rgba(184,54,51,255)' },
    ],
  };
  //** Pie grafica
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
        backgroundColor: ['#9befd7', '#ff8c78', '#e0b0ff', '#f9db4a', '#bceeff', '#ff69b4'],
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

  //** Grafica de pastel Responsables
  public pieChartOptionsGRes: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value: any, ctx: any) => {
          // Solo muestra el label si hay un valor en el dataset
          if (ctx.chart.data.datasets[0].data[ctx.dataIndex] > 0) {
            return ctx.chart.data.labels[ctx.dataIndex] + '\n' + value + '%';
          } else {
            return '';
          }
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${value}%`;
          },
        },
      },
    },
    elements: {
      arc: {
        backgroundColor: [],
      },
    },
  };
  public pieChartDataRes: ChartData<'pie', number[], string | string[]> = {
    labels: ['RECHAZADAS', 'PENDIENTES', 'APROBADAS'],
    datasets: [
      {
        label: 'Seguimiento de Actividades',
        data: [],
        backgroundColor: ['rgb(251, 98, 100)', 'rgb(255, 205, 86)', 'rgb(132, 230, 142)'],
        hoverOffset: 4,
      },
    ],
  };
  public pieChartTypeRes: ChartType = 'pie';
  public pieChartPluginsRes = [DataLabelsPlugin];

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

  constructor(private services: ActividadService, private paginatorIntl: MatPaginatorIntl,
    private modelservices: ModeloService, private dialog: MatDialog, private eviden: EvidenciaService,
    private router: Router, public login: LoginService, private notificationService: NotificacionService,
    private httpCriterios: CriteriosService, private indicadorService: IndicadoresService,
    private subcriterioService: SubcriteriosService, private criterioService: CriteriosService) {
    this.colorScheme = {
      domain: ['#9befd7', '#ff8c78', '#e0b0ff', '#f9db4a', '#bceeff', '#ff69b4'],
    };
    this.rol = this.login.getUserRole();
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
    Chart.register(...registerables);
    Chart.register(ChartDataLabels); // Registrar el plugin datalabels
  }

  onSelect(event: any) {
    console.log(event);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginatorAprob || null;
    this.dataSource1.paginator = this.paginatorPend || null;
    this.dataSource8.paginator = this.paginatorRecha || null;
  }
  ngOnInit(): void {
    this.isLoading = true;
    //Datos de la sesion
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    );
    this.modeloVigente = JSON.parse(localStorage.getItem('modelo') || '{}');
    this.modeloMax();
    this.cargarCalendarioEvidencias();
    this.cargarDatosGraficaEvidencia();
    //Notificaciones
    this.listarnot(this.user.id);
    //cambiar color
    const storedColor = localStorage.getItem('selectedColor');
    if (storedColor) {
      this.selectedColor = storedColor;
      this.aplicarColorFondo(storedColor);
    }
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
    this.gbarrasCriterios = true;
  }

  cargarCalendarioEvidencias() {
    //Calendario
    this.services.get(this.idmodel).subscribe((data: ActividadesCalendar[]) => {
      this.eventos = data.map(evento => ({
        title: evento.descripcion,
        start: new Date(evento.fecha_inicio),
        end: new Date(evento.fecha_fin),
        color: colorCalendario()
      }));
      this.calendarOptions.events = this.eventos;
    });
  }
  //fin evidencias combinar
  calcularRowSpanValue(index: number): void {
    this.rowSpanValue = this.getRowSpanTablaCriterios('Indicador', index);
  }
  //listar archivos
  obtenerNombreArchivo(url: string): string {
    if (url) {
      const nombreArchivo = url.substring(url.lastIndexOf('/') + 1);
      return nombreArchivo;
    } else {
      return '';
    }
  }
  obtenerNombreArchivo2(url: string): string {
    if (url) {
      const nombreAr = url.substring(url.lastIndexOf('/') + 1);
      return nombreAr;
    } else {
      return '';
    }
  }
  actualizarSeleccionGeneral() {
    this.todosSeleccionados = this.datacrite.every(item => this.seleccionados[item.criterionomj]);
  }
  grafCom() {
    this.mostrargrafico = !this.mostrargrafico;
    this.gbarrasCriterios = !this.gbarrasCriterios;
    this.vertitulo();
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
    this.spansTablaCriterios = [];
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
      //'subcriterio', 'idind','indicadores','tipo', 'inicio', 
      this.cacheSpanTablaCriterios('Criterio', (d) => d.criterionomj);
      this.cacheSpanTablaCriterios('Subcriterio', (d) => d.criterionomj + d.subcrierioj);
      this.cacheSpanTablaCriterios('Indicador', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej);
      this.cacheSpanTablaCriterios('Peso', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes);
      this.cacheSpanTablaCriterios('Obtenido', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt);
      this.cacheSpanTablaCriterios('Utilidad', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti);
      this.cacheSpanTablaCriterios('Valor', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti + d.val);
      this.cacheSpanTablaCriterios('Evidencia', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti + d.val + d.descrip);
      this.cacheSpanTablaCriterios('PesoEvidencia', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti + d.val + d.descrip);
      this.cacheSpanTablaCriterios('Archivos', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti + d.val + d.descrip + d.archivo_enlace);
      this.cacheSpanTablaCriterios('Idind', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti + d.val + d.descrip + d.archivo_enlace + d.id_indicardorj);
      this.cacheSpanTablaCriterios('Tipo', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti + d.val + d.descrip + d.archivo_enlace + d.id_indicardorj + d.tip);
      //'Idind','Tipo'
      setTimeout(() => {
        this.aplicar();
      }, 0);
    });
  }
  seleccionTodo(checked: boolean) {
    this.todosSeleccionados = checked;
    this.datacrite.forEach(item => {
      this.seleccionados[item.criterionomj] = checked;
    });
  }
  evaluar(valor: any, id: any, peso: any): void {
    console.log("tipo " + valor + " id ind " + id + " peso " + peso);
    const dialogRef = this.dialog.open(CalificacionComponent, {
      data: { valor, id, peso },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.event == 'success') {
        console.log(result);
        this.fetchAndProcessData(this.titulocriterio);
        this.coloresPro();
        this.valorespr();
        this.cargarDatos();
        this.valorescriterio(this.titulocriterio);
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
  evaluarEvid(valor: any, id: any, peso_evid: any, id_evidencia: any): void {
    console.log("tipo " + valor + " id ind " + id + " peso " + peso_evid + " id evid " + id_evidencia);
    const dialogRef = this.dialog.open(CalificacionComponent, {
      data: { valor, id, peso_evid, id_evidencia },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.event == 'success') {
        console.log(result);
        this.fetchAndProcessData(this.titulocriterio);
        this.coloresPro();
        this.valorespr();
        this.cargarDatos();
        this.valorescriterio(this.titulocriterio);
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
  listarnot(id: any) {
    const idEvidencia = localStorage.getItem('eviden');
    this.id_ev = Number(idEvidencia);
    console.log('traido ev ' + idEvidencia);

    if (this.rol == "ADMIN" || this.rol == "SUPERADMIN") {
      // Cargar notificaciones del rol ADMIN
      this.notificationService.notificacionePorRol(this.rol, this.modeloVigente.id_modelo).subscribe(
        (data: Notificacion[]) => {
          this.notificaciones = data;
          this.numNotificacionesSinLeer = this.notificaciones.filter(n => !n.visto).length;
          // Cargar notificaciones propias por id
          this.notificationService.getNotificaciones(id, this.modeloVigente.id_modelo).subscribe(
            (dataPropias: Notificacion[]) => {
              this.notificaciones = this.notificaciones.concat(dataPropias);
              this.numNotificacionesSinLeer += dataPropias.filter(n => !n.visto).length;
            },
            (errorPropias: any) => {
              console.error('No se pudieron listar las notificaciones propias');
            }
          );
        },
        (error: any) => {
          console.error('No se pudieron listar las notificaciones');
        }
      );
    } else {
      this.notificationService.getNotificaciones(id, this.modeloVigente.id_modelo).subscribe(
        (data: Notificacion[]) => {
          this.notificaciones = data;
          this.numNotificacionesSinLeer = this.notificaciones.filter(n => !n.visto).length;
        },
        (error: any) => {
          console.error('No se pudieron listar las notificaciones');
        }
      );
    }
  }
  irmodelo() {
    this.router.navigate(['/sup/modelo/modelo']);
  }
  detalle() {
    this.router.navigate(['/sup/modelo/detallemodelo']);
  }
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: this.eventos,
    eventContent: this.personalizarEvent.bind(this),
    locale: esLocale
  };
  personalizarEvent(info: any) {
    const fechafin = new Date(info.event.end).toLocaleDateString('es', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const fechai = new Date(info.event.start).toLocaleDateString('es', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    return { html: `<b>${info.event.title}</b><br>Inicio: ${fechai} - Fin: ${fechafin}` };
  }
  modeloMax() {
      this.idmodel = this.modeloVigente.id_modelo;
      this.valorespr();
      this.coloresPro();
      this.listaractividades(this.idmodel);
      this.obtenerPorcentajeAvances(this.idmodel);
      console.log("ID Modelo:", this.idmodel);
      //this.fetchAndProcessData("");
      this.isLoading = false;
  }
  //Valores de las grafica de barras general - Criterios
  valorespr() {
    this.criterioService.getvaloresporcCriterios(this.idmodel).subscribe((valores: CriterioPorcProjection[]) => {
      console.log("VALORES DE CRITERIOS TRAIDOS DEL BACK SIN ASIGNAR V", valores);
      this.listain = valores;
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
    this.subcriterioService.getvaloresporcSubcriterios(cri_nombre, this.modeloVigente.id_modelo).subscribe((valores: SubcriterioPorcProjection[]) => {
      this.valoresporcsub = valores;

      this.barChartDataSubcriterios.labels = this.valoresporcsub.map(val => val.nombre);
      this.barChartDataSubcriterios.datasets[0].data = this.valoresporcsub.map(val => parseFloat(val.total.toFixed(3)));
      this.barChartDataSubcriterios.datasets[1].data = this.valoresporcsub.map(val => parseFloat(val.faltante.toFixed(3)));

      this.barChartDataSubcriterios = { ...this.barChartDataSubcriterios };
    });
  }
  //Valores de las grafica de barras general - Indicadores
  valoresIndicadores(sub_nombre: string) {
    this.indicadorService.getvaloresporcIndicadores(sub_nombre, this.modeloVigente.id_modelo).subscribe((valores: IndicadorPorcProjection[]) => {
      this.valoresporcind = valores;

      this.barChartDataIndicadores.labels = this.valoresporcind.map(val => this.truncateCadenaGrafica(val.nombre));
      this.barChartDataIndicadores.datasets[0].data = this.valoresporcind.map(val => parseFloat(val.total.toFixed(3)));
      this.barChartDataIndicadores.datasets[1].data = this.valoresporcind.map(val => parseFloat(val.faltante.toFixed(3)));

      this.barChartDataIndicadores = { ...this.barChartDataIndicadores };
    });
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
  //Logica de archivos
  async descargarArchivosSeleccionados() {
    const archivosSeleccionados = this.datacrite.filter(element => element.isSelected);

    if (archivosSeleccionados.length === 0) {
      // Mostrar alerta si no hay archivos seleccionados
      await Swal.fire('Error', 'Por favor, seleccione al menos un archivo para descargar.', 'error');
      return;
    }

    const downloadPromises = archivosSeleccionados.map(element => {
      return this.descargarArchivo(element.archivo_enlace, this.obtenerNombreArchivo2(element.archivo_enlace));
    });

    try {
      await Promise.all(downloadPromises);

      // Quitar los checks de selección
      archivosSeleccionados.forEach(element => {
        element.isSelected = false;
      });

      await Swal.fire('Descarga confirmacion', 'Tiene que confirmar la descarga.', 'success');
    } catch (error) {
      console.error('Error en las descargas:', error);
      await Swal.fire('Error', 'Hubo un error durante las descargas.', 'error');
    }
  }
  async descargarArchivo(enlace: string, nombre: string) {
    try {
      const response = await fetch(enlace);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = nombre;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('No se pudo descargar el archivo: ' + nombre);
    }

  }
  seleccionarTodosArchivos() {
    // Cambia el estado de selección de todos los archivos
    for (const element of this.datacrite) {
      element.isSelected = this.todosSeleccionados;
    }

  }
  listarEvidencias() {
    this.eviden.getEvidencias().subscribe(data => {
      this.Evidencias = data;
    })
  }
  //** Cargar Tabla de evidencias 
  listaractividades(id_modelo: number) {
    this.services.getActividadrechazada(id_modelo).subscribe((data: ActivAprobadaProjection[]) => {
      this.dataSource1.data = data;
      this.cacheSpanRech('encargado', (d) => d.encargado);
      this.cacheSpanRech('inicio', (d) => d.encargado + d.inicio);
      this.cacheSpanRech('fin', (d) => d.encargado + d.inicio + d.fin);
      this.cacheSpanRech('criterio', (d) => d.encargado + d.inicio + d.fin + d.criterio);
      this.cacheSpanRech('subcriterio', (d) => d.encargado + d.inicio + d.fin + d.criterio + d.subcriterio);
      this.cacheSpanRech('indicadores', (d) => d.encargado + d.inicio + d.fin + d.criterio + d.subcriterio + d.indicador);
      this.cacheSpanRech('evidencia', (d) => d.encargado + d.inicio + d.fin + d.criterio + d.subcriterio + d.indicador + d.evidencia);
      this.cacheSpanRech('enlace', (d) => d.encargado + d.inicio + d.fin + d.criterio + d.subcriterio + d.indicador + d.evidencia + d.enlace);
    });

    this.services.getActividadaprobada(id_modelo).subscribe((data: ActivAprobadaProjection[]) => {
      this.dataSource.data = data;
      this.cacheSpanAprob('encargado', (d) => d.encargado);
      this.cacheSpanAprob('inicio', (d) => d.encargado + d.inicio);
      this.cacheSpanAprob('fin', (d) => d.encargado + d.inicio + d.fin);
      this.cacheSpanAprob('criterio', (d) => d.encargado + d.inicio + d.fin + d.criterio);
      this.cacheSpanAprob('subcriterio', (d) => d.encargado + d.inicio + d.fin + d.criterio + d.subcriterio);
      this.cacheSpanAprob('indicadores', (d) => d.encargado + d.inicio + d.fin + d.criterio + d.subcriterio + d.indicador);
      this.cacheSpanAprob('evidencia', (d) => d.encargado + d.inicio + d.fin + d.criterio + d.subcriterio + d.indicador + d.evidencia);
      this.cacheSpanAprob('enlace', (d) => d.encargado + d.inicio + d.fin + d.criterio + d.subcriterio + d.indicador + d.evidencia + d.enlace);
    });

    this.services.getActividadpendiente(id_modelo).subscribe((data: ActivAprobadaProjection[]) => {
      this.dataSource8.data = data;
      this.cacheSpanPend('encargado', (d) => d.encargado);
      this.cacheSpanPend('inicio', (d) => d.encargado + d.inicio);
      this.cacheSpanPend('fin', (d) => d.encargado + d.inicio + d.fin);
      this.cacheSpanPend('criterio', (d) => d.encargado + d.inicio + d.fin + d.criterio);
      this.cacheSpanPend('subcriterio', (d) => d.encargado + d.inicio + d.fin + d.criterio + d.subcriterio);
      this.cacheSpanPend('indicadores', (d) => d.encargado + d.inicio + d.fin + d.criterio + d.subcriterio + d.indicador);
      this.cacheSpanPend('evidencia', (d) => d.encargado + d.inicio + d.fin + d.criterio + d.subcriterio + d.indicador + d.evidencia);
      this.cacheSpanPend('enlace', (d) => d.encargado + d.inicio + d.fin + d.criterio + d.subcriterio + d.indicador + d.evidencia + d.enlace);

    });
  }
  //** Funciones para las graficas de barras
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
  //** Ajustes para la tabla y colores
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
  getRandomColor(): string {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const alpha = 0.3; // Transparencia

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
  getColorA(): string {
    const colorcontraste: string = '#8a8a8a';
    const alpha = 1; // Transparencia
    return `rgba(${colorcontraste}, ${alpha})`;
  }
  getBorderColor(total: number): string {
    const borderWidth = `${total * 100}px`;
    const borderColor = this.getColorA();
    return `${borderWidth} solid ${borderColor}`;
  }
  getColor(item: any): string {
    return cambiarColor(item.nombre);
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
    this.indicadorService.getIndicadorColProjection(this.idmodel).subscribe((data: IndiColProjection[]) => {
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
  //Color de barra
  getColorp(value: number): string {
    if (value >= 0.75) {
      //verde
      return '#4caf50';
    } else if (value >= 0.4) {
      //amarillo
      return '#ffc107';
    } else {
      //rojo
      return '#f44336';
    }
  }
  aplicarColorFondo(color: string) {
    // Aplicar el color seleccionado al fondo
    const body = document.getElementById("body");
    const enc = document.getElementById("enc");
    const let1 = document.getElementById("letra");
    const let2 = document.getElementById("letra2");
    const cal = document.getElementById("cal");
    const tit = document.getElementById("tit");
    const tit2 = document.getElementById("tit2");
    const tit3 = document.getElementById("tit3");
    const fig = document.getElementById("fig");
    const fig5 = document.getElementById("fig5");
    const menu = document.getElementById("menu");
    const notif = document.getElementById("notif");
    const txt = document.getElementById("txt");
    const graf = document.getElementById("graf");
    const indic = document.getElementById("indic");
    if (body) {
      body.style.backgroundColor = color;
    }
    //color
    if (color === "white") {
      if (enc) {
        enc.style.backgroundColor = "#eeeee4";
        enc.style.background = "#eeeee4";
      }
      if (let1) {
        let1.style.color = "black";
        let1.style.backgroundColor = "#eeeee4";
        let1.style.boxShadow = "";
      }
      if (tit) {
        tit.style.color = "black";

        tit.style.boxShadow = "";
      }
      if (tit2) {
        tit2.style.color = "black";

        tit2.style.boxShadow = "";
      }
      if (tit3) {
        tit3.style.color = "black";

        tit3.style.boxShadow = "";
      }
      if (let2) {
        let2.style.color = "black";
      }
      if (fig) {
        fig.style.backgroundColor = "white";
      }
      if (notif) {
        notif.style.backgroundColor = "white";
        notif.style.color = "black";
      }
      if (txt) {
        txt.style.backgroundColor = "white";
        txt.style.color = "black";
      }
      if (fig5) {
        fig5.style.backgroundColor = "white";
      }
      if (indic) {
        indic.style.backgroundColor = "white";
      }
      if (menu) {
        menu.style.backgroundColor = "#b0bec5";
      }

      if (graf) {
        graf.style.color = "black";
      }
      // Tema 2
    } else if (color === "#151a30") {
      if (enc) {
        enc.style.backgroundColor = "#222b45";
        enc.style.background = "#222b45";
      }
      if (let1) {
        let1.style.color = "white";
        let1.style.backgroundColor = "#222b45";
        let1.style.boxShadow = "";
      }
      if (tit) {
        tit.style.color = "white";

        tit.style.boxShadow = "";
      }
      if (tit2) {
        tit2.style.color = "white";

        tit2.style.boxShadow = "";
      }
      if (tit3) {
        tit3.style.color = "white";

        tit3.style.boxShadow = "";
      }
      if (let2) {
        let2.style.color = "white";
      }
      if (notif) {
        notif.style.backgroundColor = "#151a30";
        notif.style.color = "white";
      }
      if (txt) {
        txt.style.backgroundColor = "#0d47a1";
        txt.style.color = "white";
      }
      if (menu) {
        menu.style.backgroundColor = "#BEC8DC80";
      }
      if (fig) {
        fig.style.backgroundColor = "#BEC8DC80";
      }
      if (fig5) {
        fig5.style.backgroundColor = "#BEC8DC80";
      }
      if (indic) {
        indic.style.backgroundColor = "#BEC8DC80";
      }
      if (cal) {
        cal.style.color = "white";
      }

      if (graf) {
        graf.style.color = "black";
      }
      // Tema 3
    } else if (color === "#131a22") {
      if (enc) {
        enc.style.background = "radial-gradient(circle, #6e14c4, #00b2d6)";
      }
      if (let1) {
        let1.style.color = "white";
        let1.style.backgroundColor = "rgba(2, 27, 32, 0.25)";
        let1.style.boxShadow = "0 0 10px #00b2d6, 0 0 20px #00b2d6, 0 0 40px #00b2d6, 0 0 80px #00b2d6";
      }
      if (tit) {
        tit.style.color = "white";

        tit.style.boxShadow = "0 0 10px #00b2d6, 0 0 20px #00b2d6, 0 0 40px #00b2d6, 0 0 80px #00b2d6";
      }
      if (tit2) {
        tit2.style.color = "white";

        tit2.style.boxShadow = "0 0 10px #00b2d6, 0 0 20px #00b2d6, 0 0 40px #00b2d6, 0 0 80px #00b2d6";
      }
      if (tit3) {
        tit3.style.color = "white";

        tit3.style.boxShadow = "0 0 10px #00b2d6, 0 0 20px #00b2d6, 0 0 40px #00b2d6, 0 0 80px #00b2d6";
      }
      if (let2) {
        let2.style.color = "white";
      }
      if (notif) {
        notif.style.backgroundColor = "";
        notif.style.color = "white";
      }
      if (txt) {
        txt.style.backgroundColor = "rgba(254,30,241,0.25)";
        txt.style.color = "white";
      }
      if (fig) {
        fig.style.backgroundColor = "rgb(0,247,255, 0.5) ";
      }
      if (fig5) {
        fig5.style.backgroundColor = "rgb(0,247,255, 0.25)";
      }
      if (indic) {
        indic.style.backgroundColor = "rgb(0,247,255, 0.25)";
      }
      if (menu) {
        menu.style.backgroundColor = "radial-gradient(circle, #013b3f, ##01060a)";
      }
      if (graf) {
        graf.style.color = "black";
      }
    }
  }
  cambiar() {
    localStorage.setItem('selectedColor', this.selectedColor);
    this.aplicarColorFondo(this.selectedColor);
  }
  getColorSubcriterio(index: number): string {
    const colorIndex = this.indiceColorGlobal % this.coloresPredefinidos.length;
    this.indiceColorGlobal++; // Incrementa el índice global para el siguiente color
    return this.coloresPredefinidos[colorIndex];
  }
  getColorcelda(elementName: string, opacity: number): string {
    let index: number;
    // Asignar un color del array coloresPasteles basado en el nombre del elemento
    switch (elementName) {
      case 'ORGANIZACIÓN':
        index = 0;
        break;
      case 'INFRAESTRUCTURA':
        index = 1;
        break;
      case 'PROFESORES':
        index = 2;
        break;
      case 'DOCENCIA':
        index = 3;
        break;
      case 'INVESTIGACIÓN +DESARROLLO E INNOVACIÓN':
        index = 4;
        break;
      case 'VINCULACIÓN CON LA SOCIEDAD':
        index = 5;
        break;
      default:
        index = 5; // Valor predeterminado en caso de que el nombre del elemento no coincida
    }

    // Si no se ha asignado un color a este elemento, asignar uno del array de coloresPasteles
    if (!this.coloresAsignados[elementName]) {
      this.coloresAsignados[elementName] = this.coloresPasteles[index]; // Asignar el color del array de coloresPasteles
    }

    return this.coloresAsignados[elementName];
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
  showPesoEvid() {
    this.verPesoEvid = !this.verPesoEvid;
  }
  showEvidencia() {
    this.verEvidencia = !this.verEvidencia;
  }
  //Configuraciones de las tablas
  cacheSpanAprob(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.dataSource.data.length;) {
      let currentValue = accessor(this.dataSource.data[i]);
      let count = 1;
      for (let j = i + 1; j < this.dataSource.data.length; j++) {
        if (currentValue !== accessor(this.dataSource.data[j])) {
          break;
        }
        count++;
      }
      if (!this.spansAprob[i]) {
        this.spansAprob[i] = {};
      }
      this.spansAprob[i][key] = count;
      i += count;
    }
  }
  cacheSpanPend(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.dataSource8.data.length;) {
      let currentValue = accessor(this.dataSource8.data[i]);
      let count = 1;
      for (let j = i + 1; j < this.dataSource8.data.length; j++) {
        if (currentValue !== accessor(this.dataSource8.data[j])) {
          break;
        }
        count++;
      }
      if (!this.spansPend[i]) {
        this.spansPend[i] = {};
      }

      this.spansPend[i][key] = count;
      i += count;
    }
  }
  cacheSpanRech(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.dataSource1.data.length;) {
      let currentValue = accessor(this.dataSource1.data[i]);
      let count = 1;
      for (let j = i + 1; j < this.dataSource1.data.length; j++) {
        if (currentValue !== accessor(this.dataSource1.data[j])) {
          break;
        }
        count++;
      }

      if (!this.spansRech[i]) {
        this.spansRech[i] = {};
      }

      this.spansRech[i][key] = count;
      i += count;
    }
  }
  cargarDatosGraficaEvidencia(){
    this.eviden.getPorcentajesEstadosGeneral(this.idmodel).subscribe((data: ActiDiagramaPieProjection) => {
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
  }
  getRowSpanAprob(col: any, index: any) {
    return this.spansAprob[index] && this.spansAprob[index][col];
  }
  getRowSpanPend(col: any, index: any) {
    return this.spansPend[index] && this.spansPend[index][col];
  }
  getRowSpanRech(col: any, index: any) {
    return this.spansRech[index] && this.spansRech[index][col];
  }
  //Tabla de criterios
  cacheSpanTablaCriterios(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.datacrite.length;) {
      let currentValue = accessor(this.datacrite[i]);
      let count = 1;

      for (let j = i + 1; j < this.datacrite.length; j++) {
        if (currentValue !== accessor(this.datacrite[j])) {
          break;
        }
        count++;
      }

      if (!this.spansTablaCriterios[i]) {
        this.spansTablaCriterios[i] = {};
      }

      this.spansTablaCriterios[i][key] = count;
      i += count;
    }
  }
  getRowSpanTablaCriterios(col: any, index: any) {
    return this.spansTablaCriterios[index] && this.spansTablaCriterios[index][col];
  }
  //** Otras funciones para ajustar texto
  truncateCadena(cadena: string): string {
    const words = cadena.split(' ');
    if (words.length > 7) {
      return words.slice(0, 7).join(' ') + '...';
    } else {
      return cadena;
    }
  }
  truncateCadenaGrafica(cadena: string): string {
    const words = cadena.split(' ');
    if (words.length > 3) {
      return words.slice(0, 3).join(' ') + '...';
    } else {
      return cadena;
    }
  }
  truncateDescription(description: string): string {
    const words = description.split(' ');
    if (words.length > 10) {
      return words.slice(0, 10).join(' ') + '...';
    } else {
      return description;
    }
  }
 }
//Color aleatorio
function cambiarColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = "#" + ((hash & 0x00FFFFFF) | 0x99000000).toString(16).slice(1);
  return color;
}
//Color calendario
function colorCalendario(): string {
  const letras = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letras[Math.floor(Math.random() * 16)];
  }
  // Convertimos el color a un valor hexadecimal numérico
  const colorNumerico = parseInt(color.substring(1), 16);
  const maxColorNumerico = 13421772;
  if (colorNumerico > maxColorNumerico) {
    color = colorCalendario();
  }

  return color;
}
const colors: { [key: string]: string } = {
  verde: '#00FF00', // Por ejemplo, 'verde' se asocia con el color verde en hexadecimal
  naranja: '#FFA500', // 'naranja' se asocia con el color naranja en hexadecimal
  rojo: '#FF0000', // 'rojo' se asocia con el color rojo en hexadecimal
  amarillo: '#f8f32b',
};

