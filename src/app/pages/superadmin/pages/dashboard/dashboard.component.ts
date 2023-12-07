import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Actividad } from 'src/app/models/Actividad';
import { Persona2 } from 'src/app/models/Persona2';
import { ActividadService } from 'src/app/services/actividad.service';
import { Actividades } from 'src/app/models/actividades';
import { MatSelectionListChange } from '@angular/material/list';
import Swal from 'sweetalert2';

import { CriteriosService } from 'src/app/services/criterios.service';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { Modelo } from 'src/app/models/Modelo';

//Funciones
import { CalendarOptions } from '@fullcalendar/core';;
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { Notificacion } from 'src/app/models/Notificacion';
import { LoginService } from 'src/app/services/login.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { PersonaService } from 'src/app/services/persona.service';
import { ActividadesProjection } from 'src/app/interface/ActividadesProjection';
import { IndicadorProjection } from 'src/app/interface/IndicadorProjection';
import { ActivAprobadaProjection } from 'src/app/interface/ActivAprobadaProjection';
import { criteriosdesprojection } from 'src/app/interface/criteriosdesprojection';
//

import { CategoryScale, ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { ValoresProjection } from 'src/app/interface/ValoresProjection';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { IndiColProjection } from 'src/app/interface/IndiColProjection';
import { MatTableDataSource } from '@angular/material/table';
import { EvidenciasProjection } from 'src/app/interface/EvidenciasProjection';
import { MatDialog } from '@angular/material/dialog';
import { CalificacionComponent } from '../../modelo/matriz-evaluacion/calificacion/calificacion.component';

// Color aleatorio
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

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})

export class DashboardComponent2 implements OnInit {

  // displayedColumns: string[] = ['actividad', 'inicio', 'fin', 'encargado', 'enlace'];
  displayedColumns: string[] = ['actividad', 'nombre', 'subcriterio','indicadores', 'inicio', 'fin', 'encargado', 'enlace'];
  displayedColumns5: string[] = ['enca', 'crit', 'subc', 'indic', 'descr'];
  displayedColumns6: string[] = ['enca', 'crit', 'subc', 'indic', 'descr'];

  displayedColumns4: string[] = ['indicadores', 'nindi', 'porcentaje'];
  dataSource : ActivAprobadaProjection[] = [];
  isLoggedIn = false;
  user: any = null;
  texto!:string;
  id_criterio!:number;
  titulocriterio!: string;
  rol: any = null;
  randomColors: string[] = [];
  noti = new Notificacion();
  notificaciones: Notificacion[] = [];
  numNotificacionesSinLeer: number = 0;
  selectedColor: string="";
  abrir: boolean = false;
  mostrargrafico = false;
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
  titulo= 'Avance de los Criterios';
  titulo2= 'Avance de las Actividades';
  titulo3= 'Responsables';
  @Input() color: ThemePalette= "primary";
  //Seleccionar check
  seleccionados: { [key: string]: boolean } = {};
  todosSeleccionados=false;
  //
displayedColumns1: string[] = ['actividad', 'nombre', 'subcriterio', 'indicadores', 'inicio', 'fin', 'encargado', 'enlace'];
displayedColumns8: string[] = ['actividad', 'nombre', 'subcriterio', 'indicadores', 'inicio', 'fin', 'encargado', 'enlace'];
spanningColumns = ['actividad', 'inicio', 'fin', 'encargado'];
spans: any[] = [];
spans2: any[] = [];
spans3: any[] = [];
spans4: any[] = [];
spans5: any[] = [];
spans8: any[] = [];
coloresTarjetas: string[] = [];
borderStyles: string[] = [];
rowSpanValue: number = 0;
mostrarIconoCalificar: boolean = true;
vertit=true;
dataSource1: ActivAprobadaProjection[] = [];
dataSource8: ActivAprobadaProjection[] = [];
dataSource3:EvidenciasProjection[] = [];
dataSource4:EvidenciasProjection[] = [];
datacrite: any[] = [];
datacre: criteriosdesprojection= new criteriosdesprojection();
displayedColumns3: string[] = ['Criterio', 'Subcriterio', 'Indicador','Evidencia','Peso','Obtenido','Utilidad','Valor','Archivos','Idind','Tipo', 'Calificar'];
  labesCriterios: any[] = [];
  datosPOrceCriter: number[] = [];
  criteri: any;
  valores: number[] = [10,0];
  listaCriterios: any[] = [];
  valoresp:ValoresProjection[] = [];
  valoresp2:ValoresProjection[] = [];
  modeloMaximo:any;
  listaIndicadores: IndicadorProjection[] = [];
  listain: IndicadorProjection[] = [];
  persona:Persona2 = new Persona2();
  suma: { [nombre: string]: number } = {};
  //prueba
colorScheme: any;
datos: any[]=[];
width = 600;
height = 400;
showXAxis = true;
showYAxis = true;
gradient = false;
//prueba
view: [number, number] = [700, 400]; // Tamaño del gráfico (ancho x alto)
Utilidad!: number;
idmodel!:number;
items: any[] = [];
eventos: any[] = [];
crite: any[] = [];
avances: any[] = [];

  //FIN DE VISTA
  public actividad = new Actividades();
  Actividades: Actividad[] = [];
  listact: ActividadesProjection[] = [];
  listind:IndicadorProjection[] = [];
  indicol:IndiColProjection[] = [];
  tabla!: MatTableDataSource<any>;
  numac: Actividades[] = [];
  Evidencias: any[] = [];
  totalAct: number = 0;
  actApro: number = 0;
  porc:number=0;
  clic: boolean = false;
  datosUsuarios: any[] = [];
  filterPost = '';
  verEvidencia=false;
  verTipo=true;
  ocultar=false;
  verIndicador=true;
  verPeso=true;
  verObtenido=true;
  verUtilidad=false;
  verArchivo=false;
  verValor=true;
  verSubcriterio=true;
  verCriterio=false;
  coloresAsignados: { [key: string]: string } = {};
//
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
public barChartData2: ChartData<'bar'> = {
  labels: [],
    datasets: [
      { data: [], label: 'V/Obtenido', backgroundColor: 'rgba(56,116,188,255)'  },
      { data: [], label: 'V/por obtener', backgroundColor: 'rgba(184,54,51,255)' },
    ],
};
//pie grafica
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
  // console.log(event, active);
}

public chartHovered({
  event,
  active,
}: {
  event?: ChartEvent;
  active?: object[];
}): void {
  // console.log(event, active);
}

//
constructor(private services: ActividadService,private paginatorIntl: MatPaginatorIntl,
  private modelservices:ModeloService,private dialog: MatDialog,
  private eviden: EvidenciaService,private router: Router, private servper:PersonaService,
  public login: LoginService, private notificationService: NotificacionService,
  private httpCriterios: CriteriosService,private indi:IndicadoresService) {
    this.colorScheme = {
      domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5','#000080','#32CD32','#FF69B4','#FFD700'],
    };

    this.rol = this.login.getUserRole();
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.previousPageLabel=this.previousPageLabel;
    this.paginatorIntl.firstPageLabel=this.firstPageLabel;
    this.paginatorIntl.getRangeLabel=this.rango;
   }

   abrirOpcn() {
    this.abrir = !this.abrir;
  }
   onSelect(event: any) {
    // console.log(event);
  }


  ngOnInit(): void {
    this.listarActividad();
    this.modeloMax();

    this.services.get().subscribe((data: Actividades[]) => {
      // Envio los datos
      this.eventos = data.map(evento => ({
        title: evento.nombre,
        start: new Date(evento.fecha_inicio),
        end: new Date(evento.fecha_fin),
        color: colorCalendario()
      }));
      this.calendarOptions.events = this.eventos;
    });

    //Notificaciones
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    );

    this.listarnot(this.user.id);
    //cambiar color
    const storedColor = localStorage.getItem('selectedColor');
    if (storedColor) {
      this.selectedColor = storedColor;
      this.aplicarColorFondo(storedColor);
    }

  }
  //
  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.dataSource1.length;) {
      let currentValue = accessor(this.dataSource1[i]);
      let count = 1;

      for (let j = i + 1; j < this.dataSource1.length; j++) {
        if (currentValue !== accessor(this.dataSource1[j])) {
          break;
        }
        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      this.spans[i][key] = count;
      i += count;
    }
  }


  getRowSpan(col: any, index: any) {
    return this.spans[index] && this.spans[index][col];
  }

  cacheSpan2(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.dataSource.length;) {
      let currentValue = accessor(this.dataSource[i]);
      let count = 1;

      for (let j = i + 1; j < this.dataSource.length; j++) {
        // console.log('Comparing:', currentValue, accessor(this.dataSource[j]));

        if (currentValue !== accessor(this.dataSource[j])) {
          break;
        }
        count++;
      }

      if (!this.spans2[i]) {
        this.spans2[i] = {};
      }

      this.spans2[i][key] = count;
      i += count;
    }
  }

  getRowSpan2(col: any, index: any) {
    return this.spans2[index] && this.spans2[index][col];
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
//Evindecias combinar
cacheSpan4(key: string, accessor: (d: any) => any) {
  for (let i = 0; i < this.dataSource3.length;) {
    let currentValue = accessor(this.dataSource3[i]);
    let count = 1;

    for (let j = i + 1; j < this.dataSource3.length; j++) {
      if (currentValue !== accessor(this.dataSource3[j])) {
        break;
      }
      count++;
    }

    if (!this.spans4[i]) {
      this.spans4[i] = {};
    }

    this.spans4[i][key] = count;
    i += count;
  }
}


getRowSpan4(col: any, index: any) {
  return this.spans4[index] && this.spans4[index][col];
}

cacheSpan5(key: string, accessor: (d: any) => any) {
  for (let i = 0; i < this.dataSource4.length;) {
    let currentValue = accessor(this.dataSource4[i]);
    let count = 1;

    for (let j = i + 1; j < this.dataSource4.length; j++) {
      if (currentValue !== accessor(this.dataSource4[j])) {
        break;
      }
      count++;
    }

    if (!this.spans5[i]) {
      this.spans5[i] = {};
    }

    this.spans5[i][key] = count;
    i += count;
  }
}


getRowSpan5(col: any, index: any) {
  return this.spans5[index] && this.spans5[index][col];
}

cacheSpan8(key: string, accessor: (d: any) => any) {
  for (let i = 0; i < this.dataSource8.length;) {
    let currentValue = accessor(this.dataSource8[i]);
    let count = 1;

    for (let j = i + 1; j < this.dataSource8.length; j++) {
      if (currentValue !== accessor(this.dataSource8[j])) {
        break;
      }
      count++;
    }

    if (!this.spans8[i]) {
      this.spans8[i] = {};
    }

    this.spans8[i][key] = count;
    i += count;
  }
}


getRowSpan8(col: any, index: any) {
  return this.spans8[index] && this.spans8[index][col];
}
//fin evidencias combinar
  calcularRowSpanValue(index: number): void {
    this.rowSpanValue = this.getRowSpan3('Indicador', index);
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


toggleSeleccion(nombre: string) {
  this.seleccionados[nombre] = !this.seleccionados[nombre];
  this.actualizarSeleccionGeneral();
}

actualizarSeleccionGeneral() {
  this.todosSeleccionados = this.datacrite.every(item => this.seleccionados[item.criterionomj]);
}
grafCom(){
  this.mostrargrafico = !this.mostrargrafico;
  this.vertitulo();
}
vertitulo(){
  if (this.vertit) {
    this.texto="-           No ha seleccionado ningún criterio"
  }else{
    this.texto="";
  }
}
fetchAndProcessData(nombre:string) {
  this.titulocriterio=nombre;
  this.datacrite = [];
  this.spans3 =[];
  this.clic = true;
  this.vertit=false;
  this.vertitulo();
  this.mostrargrafico = true;
  this.valorescriterio(nombre);

  if(this.titulocriterio===""){
    this.titulocriterio="ORGANIZACIÓN";
    nombre="ORGANIZACIÓN";
  }
  this.httpCriterios.getIdCriterio(nombre).subscribe(data => {
    this.id_criterio = data.id_criterio;

  });
  this.modelservices.getlisdescrite(this.idmodel,nombre).subscribe((data: criteriosdesprojection[]) => {
    this.datacrite = data;
    this.datacrite.forEach(item => {
      if (typeof this.seleccionados[item.criterionomj] === 'undefined') {
        this.seleccionados[item.criterionomj] = false;
      }
    });
    // Generar la jerarquía de celdas
    //'subcriterio', 'idind','indicadores','tipo', 'inicio',
    this.cacheSpan3('Criterio', (d) => d.criterionomj);
    this.cacheSpan3('Subcriterio', (d) => d.criterionomj + d.subcrierioj);
    this.cacheSpan3('Indicador', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej);
    this.cacheSpan3('Peso', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej+d.pes);
    this.cacheSpan3('Obtenido', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej+d.pes+d.obt);
    this.cacheSpan3('Utilidad', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej+d.pes+d.obt+d.uti);
    this.cacheSpan3('Valor', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej+d.pes+d.obt+d.uti+d.val);
    this.cacheSpan3('Evidencia', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej+d.pes+d.obt+d.uti+d.val+d.descrip);
    this.cacheSpan3('Archivos', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej +d.pes+d.obt+d.uti+d.val+d.descrip+ d.archivo_enlace);
    this.cacheSpan3('Idind', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej +d.pes+d.obt+d.uti+d.val+d.descrip+ d.archivo_enlace+d.id_indicardorj);
    this.cacheSpan3('Tipo', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej +d.pes+d.obt+d.uti+d.val+d.descrip+ d.archivo_enlace+d.id_indicardorj+d.tip);
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
  // console.log("tipo "+valor+" id ind "+id+" peso "+peso);
  const dialogRef = this.dialog.open(CalificacionComponent, {
    data: { valor, id, peso },
  });
  dialogRef.afterClosed().subscribe(result => {
    // console.log(result);
    if (result.event == 'success') {
      // console.log(result);
      this.fetchAndProcessData(this.titulocriterio);
      this.listaind();
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

obtenerActividades(id_modelo:number) {
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

 //
  cambiar() {
    localStorage.setItem('selectedColor', this.selectedColor);
    this.aplicarColorFondo(this.selectedColor);
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
    if(color==="white"){
    if (enc) {
      enc.style.backgroundColor = "#eeeee4";
      enc.style.background = "#eeeee4";
    }
    if (let1) {
      let1.style.color = "black";
      let1.style.backgroundColor="#eeeee4";
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
    if(fig){
      fig.style.backgroundColor = "white";
    }
    if (notif) {
      notif.style.backgroundColor = "white";
      notif.style.color = "black";
    }
    if(txt){
      txt.style.backgroundColor = "white";
      txt.style.color = "black";
    }
    if(fig5){
      fig5.style.backgroundColor = "white";
    }
    if(indic){
      indic.style.backgroundColor = "white";
    }
    if(menu){
      menu.style.backgroundColor = "#b0bec5";
    }

    if(graf){
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
      let1.style.backgroundColor="#222b45";
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
    if(txt){
      txt.style.backgroundColor = "#0d47a1";
      txt.style.color = "white";
    }
    if(menu){
      menu.style.backgroundColor = "#BEC8DC80";
    }
    if(fig){
      fig.style.backgroundColor = "#BEC8DC80";
    }
    if(fig5){
      fig5.style.backgroundColor = "#BEC8DC80";
    }
    if(indic){
      indic.style.backgroundColor = "#BEC8DC80";
    }
    if(cal){
      cal.style.color = "white";
    }

    if(graf){
      graf.style.color = "black";
    }
    // Tema 3
  } else  if(color==="#131a22"){
    if (enc) {
      enc.style.background = "radial-gradient(circle, #6e14c4, #00b2d6)";
    }
    if (let1) {
      let1.style.color = "white";
      let1.style.backgroundColor="rgba(2, 27, 32, 0.25)";
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
    if(txt){
      txt.style.backgroundColor = "rgba(254,30,241,0.25)";
      txt.style.color = "white";
    }
    if(fig){
      fig.style.backgroundColor = "rgb(0,247,255, 0.5) ";
    }
    if(fig5){
      fig5.style.backgroundColor = "rgb(0,247,255, 0.25)";
    }
    if(indic){
      indic.style.backgroundColor = "rgb(0,247,255, 0.25)";
    }
    if(menu){
      menu.style.backgroundColor = "radial-gradient(circle, #013b3f, ##01060a)";
    }
    if(graf){
      graf.style.color = "black";
    }
  }
  }

  listarnot(id: any) {
    if (this.rol == "ADMIN" || this.rol == "SUPERADMIN") {
      // Cargar notificaciones del rol ADMIN
      this.notificationService.allnotificacion(this.rol).subscribe(
        (data: Notificacion[]) => {
          this.notificaciones = data;
          this.numNotificacionesSinLeer = this.notificaciones.filter(n => !n.visto).length;
          // Cargar notificaciones propias por id
          this.notificationService.getNotificaciones(id).subscribe(
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
      this.notificationService.getNotificaciones(id).subscribe(
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
  //Mi codigo calendario

 irmodelo() {
    this.router.navigate(['aseguramiento/sup/modelo/modelo']);
  }

  detalle() {
    this.router.navigate(['aseguramiento/sup/modelo/detallemodelo']);
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

personalizarEvent(info:  any) {
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

getColor(item: any): string {
    return cambiarColor(item.nombre);
  }
  //
  modeloMax() {
    this.httpCriterios.getModeMaximo().subscribe((data) => {
      this.modeloMaximo = data;
      this.idmodel =data.id_modelo;
      this.valorespr();
      this.coloresPro();
      this.idmodel = data.id_modelo;
      // console.log("ID Modelo:", this.idmodel);
      this.listaractividades(this.idmodel);
      this.obtenerActividades(this.idmodel);
      this.listarevaprob(this.idmodel);
      this.listarevarech(this.idmodel);
      this.httpCriterios.getCriterios().subscribe(data => {
        this.listaCriterios = data;
        this.cargarDatos();
      });
      this.listaind();
      this.idmodel = data.id_modelo;;
      // console.log("ID Modelo:", this.idmodel);

      //this.fetchAndProcessData("");
    });
  }

listarevaprob(id_modelo:number){
  this.eviden.geteviaprobada(id_modelo).subscribe((data: EvidenciasProjection[]) => {
    this.dataSource3 = data;
    // console.log("evidencia apr", JSON.stringify(this.dataSource3))
    this.cacheSpan4('enca', (d) => d.enca);
    this.cacheSpan4('crit', (d) => d.enca + d.crit);
    this.cacheSpan4('subc', (d) => d.enca + d.crit+d.subc);
    this.cacheSpan4('indic', (d) => d.enca + d.crit +d.subc+ d.indic);
    this.cacheSpan4('descr', (d) => d.enca + d.crit +d.subc+ d.indic+d.descr);

  });
}

listarevarech(id_modelo:number){
  this.eviden.getevirechazada(id_modelo).subscribe((data: EvidenciasProjection[]) => {
    this.dataSource4 = data;
    // console.log("evidencia rech", JSON.stringify(this.dataSource3))
    this.cacheSpan5('enca', (d) => d.enca);
    this.cacheSpan5('crit', (d) => d.enca + d.crit);
    this.cacheSpan5('subc', (d) => d.enca + d.crit+d.subc);
    this.cacheSpan5('indic', (d) => d.enca + d.crit +d.subc+ d.indic);
    this.cacheSpan5('descr', (d) => d.enca + d.crit +d.subc+ d.indic+d.descr);
  });
}
  listaractividades(id_modelo:number){
    this.services.getActividadrechazada(id_modelo).subscribe((data: ActivAprobadaProjection[]) => {
      this.dataSource1 = data;
      // console.log("rechazadai", JSON.stringify(this.dataSource1))
      this.cacheSpan('actividad', (d) => d.actividades);
      this.cacheSpan('inicio', (d) => d.actividades + d.inicio);
      this.cacheSpan('fin', (d) => d.actividades + d.inicio + d.fin);
      this.cacheSpan('encargado', (d) => d.actividades + d.inicio + d.fin + d.encargado);
    });

    this.services.getActividadaprobada(id_modelo).subscribe((data: ActivAprobadaProjection[]) => {
      this.dataSource = data;
      this.cacheSpan2('actividad', (y) => y.actividades);
      this.cacheSpan2('inicio', (y) => y.actividades + y.inicio);
      this.cacheSpan2('fin', (y) => y.actividades + y.inicio + y.fin);
      this.cacheSpan2('encargado', (y) => y.actividades + y.inicio + y.fin + y.encargado);
    });

    this.services.getActividadpendiente(id_modelo).subscribe((data: ActivAprobadaProjection[]) => {
      this.dataSource8 = data;
      this.cacheSpan8('actividad', (y) => y.actividades);
      this.cacheSpan8('inicio', (y) => y.actividades + y.inicio);
      this.cacheSpan8('fin', (y) => y.actividades + y.inicio + y.fin);
      this.cacheSpan8('encargado', (y) => y.actividades + y.inicio + y.fin + y.encargado);
    });
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
    this.indi.getIndicadorColProjection(this.idmodel).subscribe((data: IndiColProjection[]) => {
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

//
  valorespr(){
    this.httpCriterios.getvalores(this.idmodel).subscribe((valores: ValoresProjection[]) => {
      this.valoresp = valores;
      // console.log("Valores de tabla"+JSON.stringify(this.valoresp))
      this.barChartData.labels = this.valoresp.map(val => val.nomcriterio);
      this.barChartData.datasets[0].data = this.valoresp.map(val => val.vlObtenido);
      this.barChartData.datasets[1].data = this.valoresp.map(val => val.vlobtener);

      this.barChartData = { ...this.barChartData };
    });

  }

  valorescriterio(nombre:string){
    this.httpCriterios.getvalorescriterio(this.idmodel,nombre).subscribe((valores: ValoresProjection[]) => {
      this.valoresp2 = valores;

      // console.log("Valores de tabla"+JSON.stringify(this.valoresp2))
      this.barChartData2.labels = this.valoresp2.map(val => val.nomcriterio);
      this.barChartData2.datasets[0].data = this.valoresp2.map(val => val.vlObtenido);
      this.barChartData2.datasets[1].data = this.valoresp2.map(val => val.vlobtener);

      this.barChartData2 = { ...this.barChartData2 };
    });
  }
  listarActividad() {
    this.httpCriterios.getActividadAtrasada().subscribe(data => {
      this.Actividades = data;
    })
  }



  listarEvidencias() {
    this.eviden.getEvidencias().subscribe(data => {
      this.Evidencias = data;
    })
  }

  getRandomColor(): string {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const alpha = 0.3; // Transparencia

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  getColorA(): string {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const alpha = 0.6; // Transparencia

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  getBorderColor(total: number): string {
    const borderWidth = `${total*100}px`;
    const borderColor = this.getColorA();
    return `${borderWidth} solid ${borderColor}`;
  }
  //LISTAR Y MOSTRAR LOS GRAFICOS
  listaind(){
    this.httpCriterios.getIndicador(this.idmodel).subscribe(
      (data: IndicadorProjection[]) => {
        this.listain=data;
        // console.log("lista in "+this.listain)
      });
  }
  cargarDatos(): void {

    this.httpCriterios.getIndicador(this.idmodel).subscribe(
        (data: IndicadorProjection[]) => {
          this.listaIndicadores = data;
          this.datos = this.listaIndicadores.map(item => ({
            name: item.nombre,
            value: (item.total / item.faltante)*100
          }));
//ordenar valores
          this.listaIndicadores.sort((a, b) => b.total - a.total);
          this.crite = this.listaIndicadores.map(item => ({
          name: item.nombre,
          value: (item.total / item.faltante)*100
        }));

        this.listaIndicadores.forEach((item) => {
          this.coloresTarjetas.push(this.getRandomColor());
          this.borderStyles.push(this.getBorderColor(item.faltante-item.total));
        });

        },
        (error) => {
          console.error('Error al obtener los datos:', error);
        }
      );
  }

  //ir modelo
  calificar(element: any) {
    // console.log("MODELO: "+this.idmodel+" idcriterio :"+this.id_criterio+"Criterio pres: "+element.criterionomj);
    const datos = {
      idCriterio: this.id_criterio,
      modelo: this.idmodel
    };

    localStorage.setItem('datopasado', JSON.stringify(datos));

    this.router.navigate(['/sup/modelo/matriz-evaluacion']);
   }

  //color de barra
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


  //para traer los datos del responsable
getPersonaActividad(objeto:Actividad){
  // console.log(objeto.usuario.id)
  this.httpCriterios.getObtenerPersonaId(objeto.usuario.id).subscribe(
    data => {
      this.persona=data;
      // console.log(this.persona);
    }
  )
}

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
}
