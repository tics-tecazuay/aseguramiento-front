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
import { Ponderacion } from 'src/app/models/Ponderacion';
import Swal from 'sweetalert2';
import { PonderacionService } from 'src/app/services/ponderacion.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';



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
  indicadorClase: Indicador = new Indicador();
  indicadores: any[] = [];
  datos: any[] = [];
  title = 'ng-chart';
  porcentaje!: number;
  indicador: any;
  ponderacionClase: Ponderacion = new Ponderacion();
  ponderacion: any;
  guardarponde: any;
  ponderacionv: any;
  //Variable para ponderacion
  fecha!: Date;
  peso: number = 0;
  porc_obtenido: number = 0;
  porc_utilida_obtenida: number = 0;
  valor_obtenido: number = 0;
  indicador1!: Indicador;
  modelo1!: Modelo;
  fechaActual!: Date;
  fechaSeleccionada: any;
  conf: any;
  contador: number = 1;
  idmax: number = 0;

  dataSource = new MatTableDataSource<any>();
  filterPost = '';
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
    //this.listPonderacion();

    this.indicadorservice.getIndicadores().subscribe(data => {
      this.indicadores = data;
    });
  }


//

  recibeIndicador() {
    // Capturar el ID del indicador del modelo
    this.asignacionIndicadorService.getAsignacionIndicadorByIdModelo(Number(this.model.id_modelo)).subscribe(info => {
      let cont = history.state.contador;
      let fecha=history.state.fecha;
      
      this.indicadorservice.getIndicadors().subscribe(result => {
        this.dataSource.data = [];
        this.asignacion = info;
        if (this.conf == 1) {
          this.dataSource.data = result.filter((indicador: any) => {
            return info.some((asignacion: any) => {
              return indicador.id_indicador === asignacion.indicador.id_indicador;

            });

          });
          this.servicePonderacion.listarPonderacionPorFecha(fecha, Number(cont)).subscribe(data => {
            this.dataSource.data.forEach((indicador: any) => {
              data.forEach((ponderacion: any) => {
                if (indicador.id_indicador == ponderacion.indicador.id_indicador) {
                  indicador.nombre = ponderacion.indicador.nombre;
                  indicador.peso = ponderacion.peso;
                  indicador.porc_obtenido = ponderacion.porc_obtenido;
                  indicador.porc_utilida_obtenida = ponderacion.porc_utilida_obtenida;
                  indicador.valor_obtenido = ponderacion.valor_obtenido;
                }

              });

            });

            this.coloresTabla();

          });
          // console.log("Data source: 1"+JSON.stringify(this.dataSource.data));
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


  //metodo para guardar en ponderacion

  guardarDatosEnAPI(event: Event): void {
    event.preventDefault();
    const dataParaGuardar: Ponderacion[] = [];
    let idModelo = localStorage.getItem("id");
    this.dataSource.data.forEach((column: any) => {
      const indicadorEncontrado = this.indicadores.find((indicador: any) => indicador.nombre === column.nombre);
      const fila: Ponderacion = {

        indicador: {
          id_indicador: Number(indicadorEncontrado.id_indicador), nombre: '', descripcion: '', peso: 0, tipo: '',
          estandar: 0, valor_obtenido: 0, porc_obtenido: 0, porc_utilida_obtenida: 0, subcriterio: null, visible: true
        },
        peso: column.peso || 0,
        porc_obtenido: column.porc_obtenido || 0,
        porc_utilida_obtenida: column.porc_utilida_obtenida || 0,
        valor_obtenido: column.valor_obtenido || 0,
        id_ponderacion: 0,
        fecha: new Date(),
        visible: true,
        modelo: {
          id_modelo: Number(idModelo), nombre: '', fecha_inicio: this.fecha, fecha_fin: this.fecha, fecha_final_act: this.fecha,
          visible: true, usuario: null
        },
        contador: this.idmax,
      };

      dataParaGuardar.push(fila);
      this.datos = dataParaGuardar;
    });
    // console.log("Datos a guardar" + dataParaGuardar);
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
      const criterioNombre = indicador.subcriterio.criterio?.nombre;
      if (criterioNombre) {
        if (promediosPorCriterio[criterioNombre]) {
          promediosPorCriterio[criterioNombre] += indicador.porc_obtenido;
          conteoIndicadoresPorCriterio[criterioNombre] += 1;
        } else {
          promediosPorCriterio[criterioNombre] = indicador.porc_obtenido;
          conteoIndicadoresPorCriterio[criterioNombre] = 1;
        }
      }
    });

    Object.keys(promediosPorCriterio).forEach((criterio: string) => {
      const indicadoresCount = conteoIndicadoresPorCriterio[criterio];
      const promedioCriterio = promediosPorCriterio[criterio] / indicadoresCount;
      promediosPorCriterio[criterio] = promedioCriterio;
    });
    // console.log(promediosPorCriterio);

    // console.log(conteoIndicadoresPorCriterio);
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
              this.dataSource.data.filter((indicador: any) => indicador.porc_obtenido <= 25).length,
              this.dataSource.data.filter((indicador: any) => indicador.porc_obtenido > 25 && indicador.porc_obtenido <= 50).length,
              this.dataSource.data.filter((indicador: any) => indicador.porc_obtenido > 50 && indicador.porc_obtenido < 75).length,
              this.dataSource.data.filter((indicador: any) => indicador.porc_obtenido >= 75).length
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
      const criterioNombre = indicador.subcriterio.criterio?.nombre;
      if (criterioNombre) {
        if (promediosPorCriterio[criterioNombre]) {
          promediosPorCriterio[criterioNombre] += indicador.porc_obtenido;
          conteoIndicadoresPorCriterio[criterioNombre] += 1;
        } else {
          promediosPorCriterio[criterioNombre] = indicador.porc_obtenido;
          conteoIndicadoresPorCriterio[criterioNombre] = 1;
        }
      }
    });

    Object.keys(promediosPorCriterio).forEach((criterio: string) => {
      const indicadoresCount = conteoIndicadoresPorCriterio[criterio];
      const promedioCriterio = promediosPorCriterio[criterio] / indicadoresCount;
      promediosPorCriterio[criterio] = promedioCriterio;
    });
    const labels = this.dataSource.data.map((indicador: any) => indicador.subcriterio.criterio?.nombre);

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

      if (indicador.porc_obtenido > 75 && indicador.porc_obtenido <= 100) {
        indicador.color = 'verde'; // Indicador con porcentaje mayor a 50% será de color verde
      }
      else if (indicador.porc_obtenido > 50 && indicador.porc_obtenido <= 75) {
        indicador.color = 'amarillo'; // Indicador con porcentaje mayor a 50% será de color verde
      }
      else if (indicador.porc_obtenido > 25 && indicador.porc_obtenido <= 50) {
        indicador.color = 'naranja'; // Indicador con porcentaje mayor a 50% será de color verde
      } else if (indicador.porc_obtenido <= 25) {
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

  //lista de ponderacion 

  listPonderacion() {
    this.servicePonderacion.listarPonderacion().subscribe(data => {
      this.dataSource.data = data;
    });

  }


  crearPonderacion(ponderacionClase: Ponderacion) {
    this.servicePonderacion.guardarPonderacion(ponderacionClase)
      .subscribe(
        (data: any) => {
          // console.log('Ponderacion creada con éxito:', data);
          Swal.fire(
            'Ponderacion Registrada!',
            'success'
          );
          this.listarPonderacion();
        },
        (error: any) => {
          console.error('Error al crear la ponderación:', error);
        }
      );
    //this.router.navigate(['/sup/ponderacion']);
  }
  

  listarPonderacion() {
    this.servicePonderacion.listarPonderacion().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  //Para las tablas html no tocar ********************************************************************************
  // ...

  getRowCountCriterio(criterio: string, index: number): number {
    let count = 1;
    for (let i = index + 1; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].subcriterio.criterio.nombre === criterio) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }

  getRowCountSubcriterio(subcriterio: string, index: number): number {
    let count = 1;
    for (let i = index + 1; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].subcriterio.nombre === subcriterio) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }


  //Suma de todos los pesos

  sumaTotalPesos: number = 0;

  calcularTSumaPesos(): void {
    this.sumaTotalPesos = this.dataSource.data.reduce((suma: any, indicador: any) => suma + indicador.peso, 0);
    // console.log(this.sumaTotalPesos + ' : el total es')
  }

  //Calcular las uttilidades
  sumaUtilidad: number = 0;

  calcularUtilidad(): void {
    this.sumaUtilidad = this.dataSource.data.reduce((suma: any, indicador: any) => suma + indicador.porc_utilida_obtenida, 0);
    // console.log(this.sumaUtilidad + ' : el total es')
  }

  getRowSpanCriterio(nombreCriterio: string): number {
    let count = 1;
    for (const column of this.dataSource.data) {
      if (column.subcriterio.criterio.nombre === nombreCriterio) {
        count++;
      }
    }
    return count;
  }

  getRowSpanSubcriterio(nombreSubcriterio: string): number {
    let count = 1;
    for (const column of this.dataSource.data) {
      if (column.subcriterio.nombre === nombreSubcriterio) {
        count++;
      }
    }
    return count;
  }

  shouldAddBorderTop(index: number): boolean {
    if (index === 0) {
      return false;
    }

    const currentSubcriterio = this.dataSource.data[index].subcriterio;
    const previousSubcriterio = this.dataSource.data[index - 1].subcriterio;

    return currentSubcriterio.nombre !== previousSubcriterio.nombre ||
      currentSubcriterio.criterio.nombre !== previousSubcriterio.criterio.nombre;
  }


  shouldShowCriterioName(index: number): boolean {
    if (index === 0) {
      return true;
    }

    const currentCriterioNombre = this.dataSource.data[index].subcriterio.criterio.nombre;
    const previousCriterioNombre = this.dataSource.data[index - 1].subcriterio.criterio.nombre;

    return currentCriterioNombre !== previousCriterioNombre;
  }

  getRowCountCriterioName(index: number): number {
    let count = 1;

    for (let i = index + 1; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].subcriterio.criterio.nombre === this.dataSource.data[index].subcriterio.criterio.nombre) {
        count++;
      } else {
        break;
      }
    }

    return count;
  }

  getRowCountSubcriterioName(index: number): number {
    let count = 1;

    for (let i = index + 1; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].subcriterio.nombre === this.dataSource.data[index].subcriterio.nombre) {
        count++;
      } else {
        break;
      }
    }

    return count;
  }



  irinicio() {

    // código del método del botón
    this.router.navigate(['/sup/modelo/modelo']);

  }

}