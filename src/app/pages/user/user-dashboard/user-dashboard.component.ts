import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { IndicadorProjection } from 'src/app/interface/IndicadorProjection';
import { criteriosdesprojection } from 'src/app/interface/criteriosdesprojection';
import { CriteriosService } from 'src/app/services/criterios.service';
import { LoginService } from 'src/app/services/login.service';
import { ModeloService } from 'src/app/services/modelo.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { ValoresProjection } from 'src/app/interface/ValoresProjection';
import { CalificacionComponent } from '../../superadmin/modelo/matriz-evaluacion/calificacion/calificacion.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})

export class UserDashboardComponent implements OnInit {
  time: string = "";
  day: string = "";
  coloresAsignados: { [key: string]: string } = {};
  isLoggedIn = false;
  todosSeleccionados = false;
  verdash = false;
  ocultar = false;
  verTipo = true;
  rowSpanValue: number = 0;
  idmodel!: number;
  id_criterio!: number;
  spans3: any[] = [];
  user: any = null;
  rol: any = null;
  seleccionados: { [key: string]: boolean } = {};
  verEvidencia = false;
  verIndicador = true;
  verPeso = true;
  verObtenido = true;
  verUtilidad = false;
  verArchivo = false;
  verValor = true;
  verSubcriterio = true;
  verCriterio = false;
  crite: any[] = [];
  datos: any[] = [];
  listain: IndicadorProjection[] = [];
  displayedColumns3: string[] = ['Criterio', 'Subcriterio', 'Indicador', 'Evidencia', 'Peso', 'Obtenido', 'Utilidad', 'Valor', 'Archivos', 'Idind', 'Tipo', 'Calificar'];
  datacrite: any[] = [];
  cali = true;
  borderStyles: string[] = [];
  listaIndicadores: IndicadorProjection[] = [];
  valoresp: ValoresProjection[] = [];
  id!: number;
  coloresTarjetas: string[] = [];

  constructor(public login: LoginService, private service: ModeloService, private dialog: MatDialog,
    private httpCriterios: CriteriosService) { }

  ngOnInit() {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.id = this.user.id;
    this.login.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.login.isLoggedIn();
        this.user = this.login.getUser();
      }
    )
    setInterval(() => this.updateClock(), 1000);
    this.rol = this.login.getUserRole();
    console.log("ROL " + this.rol);
    this.modeloMax();
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        ticks: {

          autoSkip: false, 
          maxRotation: 45, 
          minRotation: 45, 
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
      { data: [], label: 'V/Obtenido', backgroundColor: 'rgba(56,116,188,255)' },
      { data: [], label: 'V/por obtener', backgroundColor: 'rgba(184,54,51,255)' },
    ],
  };

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

  cargarDatos(): void {
    if (this.rol === "ADMIN") {
      this.valoresadmin();
    } else if (this.rol === "RESPONSABLE") {
      this.valoresresp();
      this.cali = false;
    }
  }

  valoresadmin() {
    this.httpCriterios.getvalorad(this.idmodel, this.id).subscribe((valores: ValoresProjection[]) => {
      this.valoresp = valores;
      console.log("Valores de tabla" + JSON.stringify(this.valoresp))
      this.barChartData.labels = this.valoresp.map(val => val.nomcriterio);
      this.barChartData.datasets[0].data = this.valoresp.map(val => val.vlObtenido);
      this.barChartData.datasets[1].data = this.valoresp.map(val => val.vlobtener);
      this.barChartData = { ...this.barChartData };
      if (this.valoresp.length == 0) {
        this.valoresresp();
      }
    });

  }
  valoresresp() {
    this.httpCriterios.getvaloresponsable(this.idmodel, this.id).subscribe((valores: ValoresProjection[]) => {
      this.valoresp = valores;
      console.log("Valores de tabla" + JSON.stringify(this.valoresp))
      this.barChartData.labels = this.valoresp.map(val => val.nomcriterio);
      this.barChartData.datasets[0].data = this.valoresp.map(val => val.vlObtenido);
      this.barChartData.datasets[1].data = this.valoresp.map(val => val.vlobtener);
      this.barChartData = { ...this.barChartData };
    });
  }

  modeloMax() {
    this.service.getModeMaximo().subscribe((data) => {
      this.idmodel = data.id_modelo;
      this.listardatos();
      this.cargarDatos();
      this.listaind();
    })
  }

  listaind() {
    if (this.rol === "ADMIN") {
      this.indicadoresadmin();
    } else if (this.rol === "RESPONSABLE") {
      this.indicadoresresp();
    }
  }

  indicadoresadmin() {
    this.httpCriterios.getIndicadorad(this.idmodel, this.id).subscribe(
      (data: IndicadorProjection[]) => {
        this.listain = data;
        this.listain.forEach((item) => {
          this.coloresTarjetas.push(this.getRandomColor());
          this.borderStyles.push(this.getBorderColor(item.faltante - item.total));
        });

      });

  }

  indicadoresresp() {
    this.httpCriterios.getIndicadorresponsable(this.idmodel, this.id).subscribe(
      (data: IndicadorProjection[]) => {
        this.listain = data;
        this.listain.forEach((item) => {
          this.coloresTarjetas.push(this.getRandomColor());
          this.borderStyles.push(this.getBorderColor(item.faltante - item.total));
        });
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
    const borderWidth = `${total * 100}px`;
    const borderColor = this.getRandomColor();
    return `${borderWidth} solid ${borderColor}`;
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

  async descargarArchivosSeleccionados() {
    const archivosSeleccionados = this.datacrite.filter(element => element.isSelected);
    if (archivosSeleccionados.length === 0) {
      await Swal.fire('Error', 'Por favor, seleccione al menos un archivo para descargar.', 'error');
      return;
    }
    const downloadPromises = archivosSeleccionados.map(element => {
      return this.descargarArchivo(element.archivo_enlace, this.obtenerNombreArchivo2(element.archivo_enlace));
    });

    try {
      await Promise.all(downloadPromises);
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

  obtenerNombreArchivo2(url: string): string {
    if (url) {
      const nombreArchivo = url.substring(url.lastIndexOf('/') + 1);
      return nombreArchivo;
    } else {
      return '';
    }
  }

  seleccionarTodosArchivos() {
    for (const element of this.datacrite) {
      element.isSelected = this.todosSeleccionados;
    }

  }

  calificar(valor: any, id: any, peso: any): void {
    console.log("tipo " + valor + " id ind " + id + " peso " + peso);
    const dialogRef = this.dialog.open(CalificacionComponent, {
      data: { valor, id, peso },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.event == 'success') {
        console.log(result);
        this.listardatos();
        this.cargarDatos();
        this.listaind();
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

  listardatos() {
    if (this.rol === "ADMIN") {
      this.veradmin();
    } else if (this.rol === "RESPONSABLE") {
      this.verresponsable();
    } else if (this.rol === "AUTORIDAD") {
      this.verdash = false;
    }
  }

  veradmin() {
    this.cali = true;
    this.service.getcriterioadmin(this.idmodel, this.id).subscribe((data: criteriosdesprojection[]) => {
      if (data.length != 0) {
        this.verdash = true;
        this.cali = true;
        this.datacrite = data;
        this.datacrite.forEach(item => {
          if (typeof this.seleccionados[item.criterionomj] === 'undefined') {
            this.seleccionados[item.criterionomj] = false;
          }
        });

        this.cacheSpan3('Criterio', (d) => d.criterionomj);
        this.cacheSpan3('Subcriterio', (d) => d.criterionomj + d.subcrierioj);
        this.cacheSpan3('Indicador', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej);
        this.cacheSpan3('Peso', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes);
        this.cacheSpan3('Obtenido', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt);
        this.cacheSpan3('Utilidad', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti);
        this.cacheSpan3('Valor', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti + d.val);
        this.cacheSpan3('Evidencia', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti + d.val + d.descrip);
        this.cacheSpan3('Archivos', (d) => d.criterionomj + d.subcrierioj + d.ind_nombrej + d.pes + d.obt + d.uti + d.val + d.descrip + d.archivo_enlace);
        setTimeout(() => {
          this.aplicar();
        }, 0);

      }
    });
  }
  verresponsable() {
    location.replace('/res/dashboard');
  }

  aplicar() {
    this.datacrite.forEach(element => {
      element.randomCelda = this.generarC();
    });
    this.datacrite.forEach(element => {
      element.indicol = this.generarColor3();
    });
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

  generarC(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.3)`;
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

  updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    let ante = 'AM';
    if (hours >= 12) {
      ante = 'PM';
      hours -= 12;
    }
    if (hours === 0) {
      hours = 12;
    }
    this.time = `${hours}:${minutes.toString().padStart(2, '0')} ${ante}`;
    this.day = `${now.toLocaleDateString('es-EC', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })}`;
  }
}