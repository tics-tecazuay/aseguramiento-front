import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { ActividadesCalendar } from 'src/app/models/Asignacion-Evidencia';
import { AsignaEvidenciaService } from 'src/app/services/asigna-evidencia.service';
import { LoginService } from 'src/app/services/login.service';
import { EvidenciaService } from 'src/app/services/evidencia.service';
import { ActiDiagramaPieProjection } from 'src/app/models/Evidencia';
import { EvidenciaProjection } from 'src/app/interface/EvidenciaProjection';
import { DetalleEvaluacionService } from 'src/app/services/detalle-evaluacion.service';
import { CriteriosService } from 'src/app/services/criterios.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { detalleEvaluacion } from 'src/app/models/DetalleEvaluacion';
import { Modelo } from 'src/app/models/Modelo';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  eventos: any[] = [];
  idUserLogged!: number;
  isLoggedIn = false;
  user: any = null;
  valoresporcentajes: number[] = [];
  conteoActividades: { estado: string, conteo: number }[] = [];
  porcentajes!: ActiDiagramaPieProjection;
  valoresevid = false;
  //CODIGO TABLA
  evidencias: EvidenciaProjection[] = []; // Declaración de la propiedad
  isLoggedIn2: boolean;
  user2: any;
  verificar = false;
  titulo = "";
  ocultar = false;
  botonDeshabilitado: boolean | undefined;
  dataSource = new MatTableDataSource<EvidenciaProjection>();
  displayedModel: string[] = ['ID', 'Criterio', 'Subcriterio', 'Indicador', 'Descripcion'];
  modeloVigente!: Modelo;
  isLoading = false;
  actividad!: EvidenciaProjection[];

  constructor(
    private services: AsignaEvidenciaService,
    private servicesEvidencia: EvidenciaService,
    public login: LoginService,
    private detaeva: DetalleEvaluacionService,
    private httpCriterios: CriteriosService,
    private modeloService: ModeloService, private router: Router,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.isLoggedIn2 = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.paginatorIntl.nextPageLabel = 'Siguiente';
    this.paginatorIntl.lastPageLabel = 'Última';
    this.paginatorIntl.itemsPerPageLabel = 'Ítems por página';
    this.paginatorIntl.previousPageLabel = 'Anterior';
    this.paginatorIntl.firstPageLabel = 'Primera';
    this.paginatorIntl.getRangeLabel = (page, pageSize, length) => {
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
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.isLoading = true;
    this.login.loginStatusSubjec.asObservable().subscribe((data) => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });
    this.Inicio();
    localStorage.removeItem("eviden");
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();  
    this.idUserLogged = this.user.id;
    this.services
      .getActiCalendar(this.idUserLogged, this.modeloVigente.id_modelo)
      .subscribe((data: ActividadesCalendar[]) => {
        // Envio los datos
        console.log(data);
        this.eventos = data.map((evento) => ({
          title: evento.descripcion,
          start: new Date(evento.fecha_inicio),
          end: new Date(evento.fecha_fin),
          color: colorCalendario(),
        }));
        this.calendarOptions.events = this.eventos;
      });
    this.servicesEvidencia.getPorcentajesEstadosPorResponsable(this.idUserLogged, this.modeloVigente.id_modelo).subscribe((data: ActiDiagramaPieProjection) => {
      console.log('DATAAAAAAA DEL GRAFICO',data);
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
      this.pieChartData = {
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

  //CODIGO PARA LA TABLA DE ACTIVIDADES

  Inicio() {
    this.isLoading = true;
    this.modeloVigente = JSON.parse(localStorage.getItem('modelo') || '{}');
    this.Listado();
  }

  spans: any[] = [];

  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.evidencias.length;) {
      let currentValue = accessor(this.evidencias[i]);
      let count = 1;

      for (let j = i + 1; j < this.evidencias.length; j++) {
        if (currentValue !== accessor(this.evidencias[j])) {
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

  Listado(): void {
    this.servicesEvidencia.geteviuserpen(this.user.username, this.modeloVigente.id_modelo).subscribe((data: any[]) => {
      if (data.length != 0) {
        this.verificar = true;
        this.titulo = 'EVIDENCIAS PENDIENTES POR SUBIR';
        this.evidencias = data;

        this.cacheSpan('Criterio', (d) => d.criterio);
        this.cacheSpan('Subcriterio', (d) => d.criterio + d.subcriterio);
        this.cacheSpan('Indicador', (d) => d.criterio + d.subcriterio + d.indicador);
        this.cacheSpan('Descripcion', (d) => d.criterio + d.subcriterio + d.indicador + d.descripcion);

        // data.forEach(evidencia => {
        //   this.detaeva.getObservaciones(evidencia.id_evidencia, this.id_modelo).subscribe(
        //     (observac: detalleEvaluacion[]) => {
        //       evidencia.observacion = observac.map((c) => c.observacion);
        //     }
        //   );
        // });

        this.dataSource.data = this.evidencias;
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.titulo = 'NO TIENES EVIDENCIAS PENDIENTES POR SUBIR';
        this.isLoading = false;
      }
    });
  }

  verDetalles(evidencia: any) {
    this.router.navigate(['/res/ActividadesResponsable'], { state: { data: evidencia.id_evidencia } });
  }

  //Calendario de actividades
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: this.eventos,
    eventContent: this.personalizarEvent.bind(this),
    locale: esLocale,
  };

  personalizarEvent(info: any) {
    const fechafin = new Date(info.event.end).toLocaleDateString('es', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const fechai = new Date(info.event.start).toLocaleDateString('es', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return {
      html: `<b>${info.event.title}</b><br>Inicio: ${fechai} - Fin: ${fechafin}`,
    };
  }

  //Grafica de pastel
  public pieChartOptions: ChartConfiguration['options'] = {
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
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
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
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DataLabelsPlugin];
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





