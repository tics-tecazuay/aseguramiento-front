import { MatTableDataSource } from '@angular/material/table';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Modelo } from 'src/app/models/Modelo';
import { AsignacionIndicadorService } from 'src/app/services/asignacion-indicador.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { Chart } from 'chart.js';
import { Indicador } from 'src/app/models/Indicador';
import { Ponderacion, PonderacionPDTO } from 'src/app/models/Ponderacion';
import Swal from 'sweetalert2';
import { PonderacionService } from 'src/app/services/ponderacion.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { PonderacionProjection } from 'src/app/interface/PonderacionProjection';

@Component({
  selector: 'app-ponderacion-modelo',
  templateUrl: './ponderacion-modelo.component.html',
  styleUrls: ['./ponderacion-modelo.component.css']
})
export class PonderacionModeloComponent implements OnInit {
  @ViewChild("chart")
  chart: any;
  model: Modelo = new Modelo();
  asignacion: any;
  spans: any[] = [];
  indicadores: any[] = [];
  datos: any[] = [];
  title = 'ng-chart';
  porcentaje!: number;
  ponderacionSave: PonderacionPDTO = {} as PonderacionPDTO;
  indicador: any;
  ponderacionClase: Ponderacion = new Ponderacion();
  ponderacion: any;
  guardarponde: any;
  //Variable para ponderacion
  fecha!: Date;
  peso: number = 0;
  porc_obtenido: number = 0;
  porc_utilida_obtenida: number = 0;
  valor_obtenido: number = 0;
  fechaActual!: Date;
  conf: any;
  contador: number = 1;
  idmax: number = 0;
  dataSource = new MatTableDataSource<PonderacionProjection>();
  columnasUsuario: string[] = ['criterio_nombre', 'subcriterio_nombre', 'indicador_nombre', 'peso', 'porc_valor', 'porc_utilidad', 'valor_obt'];
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

  @ViewChild('miTabla', { static: true }) miTabla!: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  constructor(
    private indicadorservice: IndicadoresService,
    private router: Router, private fb: FormBuilder,
    public modeloService: ModeloService, private paginatorIntl: MatPaginatorIntl,
    public asignacionIndicadorService: AsignacionIndicadorService,
    private servicePonderacion: PonderacionService
  ) {
    this.paginatorIntl.nextPageLabel = this.nextPageLabel;
    this.paginatorIntl.lastPageLabel = this.lastPageLabel;
    this.paginatorIntl.firstPageLabel = this.firstPageLabel;
    this.paginatorIntl.previousPageLabel = this.previousPageLabel;
    this.paginatorIntl.itemsPerPageLabel = this.itemsPerPageLabel;
    this.paginatorIntl.getRangeLabel = this.rango;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator || null;
  }

  ocultarBoton: boolean = false;
  ngOnInit(): void {
    this.fechaActual = history.state.fecha;
    this.conf = history.state.conf;
    this.model = history.state.modelo;
    if (this.conf == 1) {
      this.ocultarBoton = true;
    } else {
      this.ocultarBoton = false;
    }

    this.servicePonderacion.idmax(Number(this.model.id_modelo)).subscribe(
      (response: any) => {
        if (response.length > 0) {
          const contadorMaximo = response[0].contador;
          if (contadorMaximo !== null) {
            this.idmax = contadorMaximo + 1;
          } else {

            this.idmax = 1;
          }
        } else {
          this.idmax = 1;
        }
      },
      (error: any) => {
        console.error(error);
      }
    );

    this.recibeIndicador();
  }

  //Contador para combinar celdas
  cacheSpan(key: string, accessor: (d: any) => any) {
    for (let i = 0; i < this.indicadores.length;) {
      let currentValue = accessor(this.indicadores[i]);
      let count = 1;

      for (let j = i + 1; j < this.indicadores.length; j++) {
        if (currentValue !== accessor(this.indicadores[j])) {
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

  // Función para formatear la fecha en el formato YYYY-MM-DD
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    let day: string | number = date.getDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  }

  recibeIndicador() {
    this.asignacionIndicadorService.getAsignacionIndicadorByIdModelo(Number(this.model.id_modelo)).subscribe(info => {
      let cont = history.state.contador;
      let fecha = history.state.fecha;

      this.indicadorservice.getIndicadoresModelo(Number(this.model.id_modelo)).subscribe(result => {
        this.indicadores = result;
        this.dataSource.data = [];
        this.asignacion = info;
        //console.log("indicadores... " + JSON.stringify(this.indicadores))
        this.cacheSpan('criterio_nombre', (d) => d.nombrecriterio);
        this.cacheSpan('subcriterio_nombre', (d) => d.nombrecriterio + d.nombresubcriterio);
        this.cacheSpan('indicador_nombre', (d) => d.nombrecriterio + d.nombresubcriterio + d.nombreindicador);
        if (this.conf == 1) {
          this.dataSource.data = result.filter((indicador: any) => {
            return info.some((asignacion: any) => {
              return indicador.id_indicador === asignacion.indicador.id_indicador;

            });

          });
          const fechaFormateada = this.formatDate(fecha);
          this.servicePonderacion.listarPonderacionPorFecha(fechaFormateada, Number(cont)).subscribe(data => {
            this.dataSource.data.forEach((indicador: any) => {
              data.forEach((ponderacion: any) => {
                if (indicador.idindicador == ponderacion.idindicador) {
                  indicador.nombreindicador = ponderacion.nombreindicador;
                  indicador.peso = ponderacion.peso;
                  indicador.porcentajeobtenido = ponderacion.porcentajeobtenido;
                  indicador.porcentajeutilidad = ponderacion.porcentajeutilidad;
                  indicador.valorobtenido = ponderacion.valorobtenido;

                }

              });

            });
            //console.log("ponderacion por fecha " + JSON.stringify(this.dataSource.data));
            this.coloresTabla();
          });
          this.createChart();
          this.GraficaPastel();
          this.calculatePromedioPorCriterio();
          this.calcularTSumaPesos();
          this.calcularUtilidad();
          this.coloresTabla();
        } else {
          this.dataSource.data = result.filter((indicador: any) => {
            return info.some((asignacion: any) => {
              return indicador.id_indicador === asignacion.indicador.id_indicador;
            });
          });
          this.createChart();
          this.GraficaPastel();
          this.calculatePromedioPorCriterio();
          this.calcularTSumaPesos();
          this.calcularUtilidad();
          this.coloresTabla();
        }
      });
    });
  }

  recibeIndicador2() {
    this.asignacionIndicadorService.getAsignacionIndicadorByIdModelo(Number(this.model.id_modelo)).subscribe(info => {
      let cont = history.state.contador;
      let fecha = history.state.fecha;

      const fechaFormateada = this.formatDate(fecha);
      this.servicePonderacion.listarPonderacionPorFecha(fechaFormateada, Number(cont)).subscribe(data => {
        this.dataSource.data.forEach((indicador: any) => {
          data.forEach((ponderacion: any) => {
            if (indicador.idindicador == ponderacion.idindicador) {
              indicador.nombreindicador = ponderacion.nombreindicador;
              indicador.peso = ponderacion.peso;
              indicador.porcentajeobtenido = ponderacion.porcentajeobtenido;
              indicador.porcentajeutilidad = ponderacion.porcentajeutilidad;
              indicador.valorobtenido = ponderacion.valorobtenido;
            }
            this.indicadores = data;
            this.dataSource.data = [];
            this.asignacion = info;
            console.log("ponderacion por fecha... " + JSON.stringify(this.indicadores))
            this.cacheSpan('criterio_nombre', (d) => d.nombrecriterio);
            this.cacheSpan('subcriterio_nombre', (d) => d.nombrecriterio + d.nombresubcriterio);
            this.cacheSpan('indicador_nombre', (d) => d.nombrecriterio + d.nombresubcriterio + d.nombreindicador);

          });

        });
        if (this.conf == 1) {
          this.dataSource.data = data.filter((indicador: any) => {
            return info.some((asignacion: any) => {
              return indicador.id_indicador === asignacion.indicador.id_indicador;
            });
          });

          this.createChart();
          this.GraficaPastel();
          this.calculatePromedioPorCriterio();
          this.calcularTSumaPesos();
          this.calcularUtilidad();
          this.coloresTabla();
        } else {
          this.dataSource.data = data.filter((indicador: any) => {
            return info.some((asignacion: any) => {
              return indicador.id_indicador === asignacion.indicador.id_indicador;
            });
          });
          this.createChart();
          this.GraficaPastel();
          this.calculatePromedioPorCriterio();
          this.calcularTSumaPesos();
          this.calcularUtilidad();
          this.coloresTabla();
        }
      });
    });
  }

  recibeIndicador3() {
    this.asignacionIndicadorService.getAsignacionIndicadorByIdModelo(Number(this.model.id_modelo)).subscribe(info => {
      let cont = history.state.contador;
      let fecha = history.state.fecha;

      this.indicadorservice.getIndicadoresModelo(Number(this.model.id_modelo)).subscribe(result => {
        this.indicadores = result;
        this.dataSource.data = [];
        this.asignacion = info;
        console.log("indicadores... " + JSON.stringify(this.indicadores))
        this.cacheSpan('criterio_nombre', (d) => d.nombrecriterio);
        this.cacheSpan('subcriterio_nombre', (d) => d.nombrecriterio + d.nombresubcriterio);
        this.cacheSpan('indicador_nombre', (d) => d.nombrecriterio + d.nombresubcriterio + d.nombreindicador);
        if (this.conf == 1) {
          this.dataSource.data = result.filter((indicador: any) => {
            return info.some((asignacion: any) => {
              return indicador.id_indicador === asignacion.indicador.id_indicador;
            });
          });

          this.createChart();
          this.GraficaPastel();
          this.calculatePromedioPorCriterio();
          this.calcularTSumaPesos();
          this.calcularUtilidad();
          this.coloresTabla();
        } else {
          this.dataSource.data = result.filter((indicador: any) => {
            return info.some((asignacion: any) => {
              return indicador.id_indicador === asignacion.indicador.id_indicador;
            });
          });
          this.createChart();
          this.GraficaPastel();
          this.calculatePromedioPorCriterio();
          this.calcularTSumaPesos();
          this.calcularUtilidad();
          this.coloresTabla();
        }
      });
    });
  }

  guardarDatosEnAPI(event: Event): void {
    event.preventDefault();
    const dataParaGuardar: PonderacionPDTO[] = [];
    let idModelo = localStorage.getItem("id");
    this.dataSource.data.forEach((column: any) => {
      const indicadorEncontrado = this.indicadores.find((indicador: any) => indicador.nombreindicador === column.nombreindicador);
      const fila: PonderacionPDTO = {
        peso: column.peso || 0,
        porcentajeobtenido: column.porcentajeobtenido || 0,
        porcentajeutilidad: column.porcentajeutilidad || 0,
        valorobtenido: column.valorobtenido || 0,
        idindicador: indicadorEncontrado.idindicador,
        idmodelo: Number(idModelo),
        contador: this.idmax,
        fecha: new Date(),
      };

      dataParaGuardar.push(fila);

    });
    //console.table(dataParaGuardar);
    this.servicePonderacion.guardarPonderacionLista(dataParaGuardar).subscribe(
      (response: any) => {
        Swal.fire({
          title: 'Ponderacion guardada éxitosamente',
          icon: 'success',
          // ...
        });

        this.router.navigate(['/sup/modelo/detallemodelo'], { state: { modelo: this.model } });
        // Recarga la página después de guardar los datos en la API
      },
      (error: any) => {
        // Maneja el error si ocurre alguno
        console.error(error);
        Swal.fire({
          title: 'Error al guardar ponderación',
          text: 'Ha ocurrido un error al intentar guardar la ponderación.',
          icon: 'error',

        });
      }
    );
  }


  //enviamos modelo
  enviarModelo(modelo: Modelo): void {
    localStorage.setItem("id", modelo.id_modelo.toString());
    this.model = modelo;
    // this.router.navigate(['/sup/modelo/detallemodelo']);
  }

  //Calculamos el promedio de cada criterio
  calculatePromedioPorCriterio() {
    const promediosPorCriterio: { [criterio: string]: number } = {};
    const conteoIndicadoresPorCriterio: { [criterio: string]: number } = {};

    this.dataSource.data.forEach((indicador: any) => {
      const criterioNombre = indicador.nombrecriterio;
      if (criterioNombre) {
        if (promediosPorCriterio[criterioNombre]) {
          promediosPorCriterio[criterioNombre] += indicador.porcentajeobtenido;
          conteoIndicadoresPorCriterio[criterioNombre] += 1;
        } else {
          promediosPorCriterio[criterioNombre] = indicador.porcentajeobtenido;
          conteoIndicadoresPorCriterio[criterioNombre] = 1;
        }
      }
    });

    Object.keys(promediosPorCriterio).forEach((criterio: string) => {
      const indicadoresCount = conteoIndicadoresPorCriterio[criterio];
      const promedioCriterio = promediosPorCriterio[criterio] / indicadoresCount;
      promediosPorCriterio[criterio] = promedioCriterio;
    });
    console.log(promediosPorCriterio);

    console.log(conteoIndicadoresPorCriterio);
  }


  ///Grafica del pastel
  GraficaPastel() {
    this.chart = new Chart("pastel", {
      type: 'pie',
      data: {
        labels: ['Menor o igual al 25%', 'Mayor al 25% y menor o igual al 50%', 'Mayor al 50% y menor al 75%', 'Mayor al 75%'],
        datasets: [
          {
            label: "Porcentaje de logro",
            data: [
              this.dataSource.data.filter((indicador: any) => indicador.porcentajeobtenido <= 25).length,
              this.dataSource.data.filter((indicador: any) => indicador.porcentajeobtenido > 25 && indicador.porcentajeobtenido <= 50).length,
              this.dataSource.data.filter((indicador: any) => indicador.porcentajeobtenido > 50 && indicador.porcentajeobtenido < 75).length,
              this.dataSource.data.filter((indicador: any) => indicador.porcentajeobtenido >= 75).length
            ],
            backgroundColor: ['red', 'orange', 'yellow', 'green']
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  //Grafica de barras
  createChart() {
    const promediosPorCriterio: { [criterio: string]: number } = {};
    const conteoIndicadoresPorCriterio: { [criterio: string]: number } = {};

    this.dataSource.data.forEach((indicador: any) => {
      const criterioNombre = indicador.nombrecriterio;
      if (criterioNombre) {
        if (promediosPorCriterio[criterioNombre]) {
          promediosPorCriterio[criterioNombre] += indicador.porcentajeobtenido;
          conteoIndicadoresPorCriterio[criterioNombre] += 1;
        } else {
          promediosPorCriterio[criterioNombre] = indicador.porcentajeobtenido;
          conteoIndicadoresPorCriterio[criterioNombre] = 1;
        }
      }
    });

    Object.keys(promediosPorCriterio).forEach((criterio: string) => {
      const indicadoresCount = conteoIndicadoresPorCriterio[criterio];
      const promedioCriterio = promediosPorCriterio[criterio] / indicadoresCount;
      promediosPorCriterio[criterio] = promedioCriterio;
    });
    const labels = this.dataSource.data.map((indicador: any) => indicador.nombrecriterio);

    const filteredLabels = labels.filter((label: any, index: any) => labels.indexOf(label) === index).slice(0, 15);

    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: filteredLabels,
        datasets: [
          {
            label: "Promedio mayor a 75",
            data: filteredLabels.map((label: string) => {
              const promedio = promediosPorCriterio[label];
              return promedio > 75 ? promedio : null;
            }),
            backgroundColor: 'green'
          },
          {
            label: "Promedio mayoa 50 y menor igual a 75",
            data: filteredLabels.map((label: string) => {
              const promedio = promediosPorCriterio[label];
              return promedio <= 75 && promedio > 50 ? promedio : null;
            }),
            backgroundColor: 'Yellow'
          },
          {
            label: "Promedio mayor a 25 menor a 50 ",
            data: filteredLabels.map((label: string) => {
              const promedio = promediosPorCriterio[label];
              return promedio > 25 && promedio <= 50 ? promedio : null;
            }),
            backgroundColor: 'orange'
          },
          {
            label: "Promedio menor a 25%",
            data: filteredLabels.map((label: string) => {
              const promedio = promediosPorCriterio[label];
              return promedio < 25 ? promedio : null;
            }),
            backgroundColor: 'red'
          }

        ]
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
            color: 'black',
            formatter: function (value: any, context: any) {
              const promedio = context.dataset.data[context.dataIndex];
              return promedio !== null ? promedio + '%' : '';
            }
          }
        }
      }

    });

  }
  //colores de la celda de la tabla
  coloresTabla() {
    this.dataSource.data.forEach((indicador: any) => {

      if (indicador.porcentajeobtenido > 75 && indicador.porcentajeobtenido <= 100) {
        indicador.color = 'verde'; // Indicador con porcentaje mayor a 50% será de color verde
      }
      else if (indicador.porcentajeobtenido > 50 && indicador.porcentajeobtenido <= 75) {
        indicador.color = 'amarillo'; // Indicador con porcentaje mayor a 50% será de color verde
      }
      else if (indicador.porcentajeobtenido > 25 && indicador.porcentajeobtenido <= 50) {
        indicador.color = 'naranja'; // Indicador con porcentaje mayor a 50% será de color verde
      } else if (indicador.porcentajeobtenido <= 25) {
        indicador.color = 'rojo'; // Indicador con porcentaje menor a 30% será de color rojo
      } else {
        indicador.color = ''; // No se asigna ningún color a los indicadores que no cumplen las condiciones anteriores
      }
    });
  }
  //regreso al modelo
  verCriterios() {
    this.router.navigate(['/sup/modelo/detallemodelo'], { state: { modelo: this.model } });
  }
  //Suma de todos los pesos
  sumaTotalPesos: number = 0;
  calcularTSumaPesos(): void {
    this.sumaTotalPesos = this.dataSource.data.reduce((suma: any, indicador: any) => suma + indicador.peso, 0);
    console.log(this.sumaTotalPesos + ' : Suma total pesos es')
  }

  //Calcular las uttilidades
  sumaUtilidad: number = 0;
  calcularUtilidad(): void {
    this.sumaUtilidad = this.dataSource.data.reduce((suma: any, indicador: any) => suma + indicador.porcentajeutilidad, 0);
    console.log(this.sumaUtilidad + ' : Suma utilidad es')
  }
  irinicio() {
    // código del método del botón
    this.router.navigate(['/sup/modelo/modelo']);

  }
}