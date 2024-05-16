import { EvidenciaService } from './../../../../../services/evidencia.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Cualitativa } from 'src/app/models/Cualitativa';
import { EvaluarCualitativaService } from 'src/app/services/evaluar-cualitativa.service';
import { EvaluarCualitativa } from 'src/app/models/EvaluarCualitativa';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { Indicador } from 'src/app/models/Indicador';
import Swal from 'sweetalert2';
import { EvaluarCuantitativaService } from 'src/app/services/evaluar-cuantitativa.service';
import { FormulaEvaluarService } from 'src/app/services/formula/formulaevaluar.service';
import { CalificacionService } from 'src/app/services/calificacion.service';
import { ValorObtenidoInd } from 'src/app/interface/ValorObtenidoInd';
import { CalificarIndicador } from 'src/app/models/CalificarIndicador';
import { Modelo } from 'src/app/models/Modelo';
import { CalificarIndicadorService } from 'src/app/services/calificar-indicador.service';

type ColumnNames = {
  [key: string]: string;
}
type ColumnNames2 = {
  [key: string]: string;
}

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CalificacionComponent implements OnInit {
  public columnNames: ColumnNames = {
    escala: 'Escala',
    valor: 'Valor'
  };
  dataSource: any;
  columnsToDisplay = ['escala', 'valor'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay];
  expandedElement: any;
  dato: any;
  indicadorch:string='CARGA HORARIA SEMANAL DE LOS PROFESORES TC';
  cualitativa: Cualitativa = new Cualitativa();
  indicador: Indicador = new Indicador();
  indicadorBD: Indicador = new Indicador();
  calificarIndicadorBD: CalificarIndicador = new CalificarIndicador();
  evaluarCualitativa: EvaluarCualitativa = new EvaluarCualitativa();
  valorestotalesindicador!: ValorObtenidoInd;
  calvalorcualievid: number = 0;
  calificarIndicador: CalificarIndicador = new CalificarIndicador();
  modeloVigente!: Modelo;

  public columnNames2: ColumnNames = {
    abreviatura: 'Abreviatura'
  };
  columnsToDisplay2 = ['abreviatura'];
  columnsToDisplayWithExpand2 = [...this.columnsToDisplay2, 'valor'];
  y: number = 0;

  igualar: number = 0;
  constructor(private formulaEvaluarService: FormulaEvaluarService, 
    public dialogRef: MatDialogRef<CalificacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private calificacionService: CalificacionService, 
    private evaluarCualitativaService: EvaluarCualitativaService, 
    private indicadorServie: IndicadoresService, 
    private evaluarCuantitativaService: EvaluarCuantitativaService, 
    private evidenciaService: EvidenciaService,
    private calificarIndicadorService: CalificarIndicadorService) { }
  
    ngOnInit(): void {
    this.obtener(this.data.valor);
    this.modeloVigente = JSON.parse(localStorage.getItem('modelo') || '{}');
    }

  obtener(valor: any) {
    if (valor == 'cualitativa') {
      this.calificacionService.obtenerCalificacion().subscribe(
        (data) => {
          this.dataSource = data;
        });
    } else if (valor == 'cualitativaevid') {
      this.calificacionService.obtenerCalificacion().subscribe(
        (data) => {
          this.dataSource = data;
        });
    } else if (valor == 'cuantitativa') {
      this.evaluarCuantitativaService.listarEvaluarCuantitativaPorIndicador(this.data.id).subscribe(
        (data) => {
          this.dataSource = data;
          console.log(data);
        });
    }
    else if (valor == 'cuantitativaevid') {
      this.evaluarCuantitativaService.listarEvaluarCuantitativaPorIndicador(this.data.id).subscribe(
        (data) => {
          this.dataSource = data;
          console.log(data);
        });
    }
  }

  seleccionar(valor: any) {
    this.dato = valor.valor;
    this.cualitativa = valor;
    console.log(this.cualitativa);
  }

  guardar() {
    if (this.data.valor === 'cualitativa') {
      //Actualizar los valores de las evidencias del indicador a 0
      this.evidenciaService.editarValoresEvidaCero(this.data.id).subscribe({
        next: (data) => {
          console.log(data);
        }
      });
      //Guardar para indicador cualitativo
      this.indicador.id_indicador = this.data.id;
      this.indicador.valor_obtenido = this.dato;
      this.indicador.porc_obtenido = this.dato * 100;
      this.indicador.porc_utilida_obtenida = parseFloat((((this.dato * 100) * this.data.peso) / 100).toFixed(3));

      //Guardar para calificar indicador cualitativo
      this.calificarIndicador.id_modelo = this.modeloVigente.id_modelo;
      this.calificarIndicador.indicador = this.indicador;
      this.calificarIndicador.valor_obtenido = this.dato;
      this.calificarIndicador.porc_obtenido = this.dato * 100;
      this.calificarIndicador.porc_utilida_obtenida = parseFloat((((this.dato * 100) * this.data.peso) / 100).toFixed(3));
      console.log('CALIFICACION CREADA: ',this.calificarIndicador);
      //Peticion para crear la calificacion del indicador
      this.calificarIndicadorService.crearCalificarIndicador(this.calificarIndicador).subscribe({
        next: (data) => {
          console.log(data);
          console.log('SE CREO CORRECTAMENTE LA CALIFICACION DEL INDICADOR');
        }
      });

      this.evaluarCualitativa.indicador = this.indicador;
      this.evaluarCualitativa.cualitativa = this.cualitativa;
      this.evaluarCualitativaService.createEvaluarCualitativa(this.evaluarCualitativa).subscribe({
        next: (data) => {
          console.log(data);
          this.indicadorServie.ponderarIndicador(this.data.id, this.indicador).subscribe({
            next: (data) => {
              this.dialogRef.close({ event: 'success' });
            }
          });
        }
      });
    } else if (this.data.valor === 'cualitativaevid') {
      console.log('ENTRO A CUALITATIVA EVIDENCIA');
      //Obtener el valor obtenido del indicador por id para revisar si es que ya existe una evaluacion con esa evidecia solo deberia
      this.indicadorServie.getIndicadorById(this.data.id).subscribe({
        next: (data) => {
          this.indicadorBD = data;
        }
      });
      //Obtener la calificacion del indicador de la base de datos
      this.calificarIndicadorService.obtenerCalificacionPorIndicador(this.data.id, this.modeloVigente.id_modelo).subscribe({
        next: (data) => {
          this.calificarIndicadorBD = data;
          console.log('CALIFICACION OBTENIDA: ', this.calificarIndicadorBD);
        }
      });

      //Calculo para obtener el valor real del peso de la evidencia con el valor de la calificacion cualitiativa
      this.calvalorcualievid = this.data.peso_evid * this.cualitativa.valor;
      //Actualizar la evidencia con el valor obetenido por evidencia (Se calcula el peso obt por evid y por el valor de calificacion cualitativa)
      this.evidenciaService.editarValorEvid(this.data.id_evidencia, this.calvalorcualievid).subscribe({
        next: (data) => {
          console.log(data);
          //this.obtenerValoresIndicador(this.data.id);
          this.evidenciaService.getValoresObtenidosEvidPorIndicador(this.indicadorBD.id_indicador).subscribe({
            next: (data) => {
              this.valorestotalesindicador = data;
              console.log('ID INDICADOR: ', this.data.id);
              console.log('VALORES TOTALES: ', this.valorestotalesindicador);
              //Obtener el valor total actualizado por indicador de la suma de evidencias para actualizar el indicaodr con ese valor
              //Actualizar indicador con los valores calculados con el valor obtenido total de las evidencias
              this.indicadorBD.valor_obtenido = this.valorestotalesindicador.valor_obtenido;
              this.indicadorBD.porc_obtenido = parseFloat(((this.valorestotalesindicador.valor_obtenido / this.indicadorBD.peso) * 100).toFixed(3));
              this.indicadorBD.porc_utilida_obtenida = this.valorestotalesindicador.valor_obtenido;
              console.log('PORCENTAJE OBTENIDO CALCULO: ', this.indicadorBD.porc_obtenido);
              console.log('PORCENTAJE OBTENIDO: ', this.indicador.porc_obtenido);
              console.log('INDICADOR: ', this.indicadorBD);

              //Guardar para calificar indicador cualitativo
              this.calificarIndicadorBD.valor_obtenido = this.valorestotalesindicador.valor_obtenido;
              this.calificarIndicadorBD.porc_obtenido = parseFloat(((this.valorestotalesindicador.valor_obtenido / this.indicadorBD.peso) * 100).toFixed(3));
              this.calificarIndicadorBD.porc_utilida_obtenida = this.valorestotalesindicador.valor_obtenido;
              console.log('CALIFICACION ACTUALIZADA: ',this.calificarIndicadorBD);
              //Peticion para actualizar la calificacion del indicador
              this.calificarIndicadorService.actualizarCalificacionIndicador(this.calificarIndicadorBD.id_calificar_indicador,this.calificarIndicadorBD).subscribe({
                next: (data) => {
                  console.log(data);
                  console.log('SE CREO CORRECTAMENTE LA ACTUALIZACION DE LA CALIFICACION DEL INDICADOR');
                }
              });

              //Solo se debe actualizar la cualitativa (El valor que califica la evidencia max y mins )
              this.evaluarCualitativa.indicador = this.indicadorBD;
              this.evaluarCualitativa.cualitativa = this.cualitativa;
              console.log('EVALUACION: ', this.evaluarCualitativa);
              //Caso contrario si hay entonces solo se actualiza la cualitativa
              this.evaluarCualitativaService.createEvaluarCualitativa(this.evaluarCualitativa).subscribe({
                next: (data) => {
                  console.log(data);
                  console.log('ENTRO A CREAR');
                  this.indicadorServie.ponderarIndicador(this.data.id, this.indicadorBD).subscribe({
                    next: (data) => {
                      this.dialogRef.close({ event: 'success' });
                    }
                  });
                }
              });
            }
          });

        }
      });

    } else if (this.data.valor === 'cuantitativa') {
      this.comparar();
    } else if (this.data.valor === 'cuantitativaevid') {
      this.compararRep();
    }
  }
  obtenerValoresIndicador(id_indicador: number) {
    this.evidenciaService.getValoresObtenidosEvidPorIndicador(id_indicador).subscribe({
      next: (data) => {
        this.valorestotalesindicador = data;
        console.log('ID INDICADOR: ', id_indicador);
        console.log('VALORES TOTALES: ', this.valorestotalesindicador);
      }
    });
  }
  async comparar() {
    console.log(this.igualar, "igualar");
    //Actualizar el valor de las variables con el valor obtenido de la interfaz
    this.dataSource.forEach(async (element: any) => {
      this.evaluarCuantitativaService.actualizar(element.id_evaluar_cuantitativa, element).subscribe({
        next: async (data) => {
        }
      });
    });
    let x = this.dataSource[0].encabezado_evaluar.indicador.estandar
    let y = await this.formulaEvaluarService.evaluateEquation(this.dataSource[0].encabezado_evaluar.id_encabezado_evaluar)
    this.indicador.id_indicador = this.data.id;
    this.indicador.valor_obtenido = parseFloat(y.toFixed(2));
    // Guardar el valor obtenido en el calificar indicador
    this.calificarIndicador.id_modelo = this.modeloVigente.id_modelo;
    this.calificarIndicador.valor_obtenido = parseFloat(y.toFixed(2));

    if (this.igualar == 1) {
      console.log("entro");
      let resp = parseFloat(((y * 100) / x).toFixed(2));
      if (resp > 100) {
        resp = 100;
      }
      this.indicador.porc_obtenido = resp;
      this.indicador.porc_utilida_obtenida = parseFloat(((resp * this.data.peso) / 100).toFixed(3));

       // Guardar mas valores en el calificar indicador
       this.calificarIndicador.porc_obtenido = resp;
       this.calificarIndicador.porc_utilida_obtenida = parseFloat(((resp * this.data.peso) / 100).toFixed(3));
       //Ultimo luego de formar el indicador completamente
       this.calificarIndicador.indicador = this.indicador;
       //Peticion para crear la calificacion del indicador
       this.calificarIndicadorService.crearCalificarIndicador(this.calificarIndicador).subscribe({
         next: (data) => {
           console.log(data);
           console.log('SE CREO CORRECTAMENTE LA CALIFICACION DEL INDICADOR');
         }
       });

      this.indicadorServie.ponderarIndicador(this.data.id, this.indicador).subscribe({
        next: (data) => {
          this.dialogRef.close({ event: 'success' });
        }
      });
    } else if (this.igualar == 2) {
      let resp = 0
      if (y >= (x * 2)) {
        resp = 0;
      } else if (y <= x) {
        if (y <= 0) {
          resp = 0;
        } else {
          resp = 100;
        }
      } else if (y > x) {
        resp = ((((x * 2) - y) * 100) / x);
      }

      this.indicador.porc_obtenido = parseFloat(resp.toFixed(2));
      this.indicador.porc_utilida_obtenida = parseFloat((((resp) * this.data.peso) / 100).toFixed(3));
      
      // Guardar mas valores en el calificar indicador
      this.calificarIndicador.porc_obtenido = parseFloat(resp.toFixed(2));
      this.calificarIndicador.porc_utilida_obtenida = parseFloat(((resp * this.data.peso) / 100).toFixed(3));
      //Ultimo luego de formar el indicador completamente
      this.calificarIndicador.indicador = this.indicador;
      //Peticion para crear la calificacion del indicador
      this.calificarIndicadorService.crearCalificarIndicador(this.calificarIndicador).subscribe({
        next: (data) => {
          console.log(data);
          console.log('SE CREO CORRECTAMENTE LA CALIFICACION DEL INDICADOR');
        }
      });

      this.indicadorServie.ponderarIndicador(this.data.id, this.indicador).subscribe({
        next: (data) => {
          this.dialogRef.close({ event: 'success' });
        }
      });
    } else if (this.igualar == 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe escoger una opcion para evaluar el resultado',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
  }
  async compararRep() {
    console.log(this.igualar, "igualar");
    //Actualizar el valor de las variables con el valor obtenido de la interfaz
    this.dataSource.forEach(async (element: any) => {
      this.evaluarCuantitativaService.actualizar(element.id_evaluar_cuantitativa, element).subscribe({
        next: async (data) => {
        }
      });
    });
    
    let x = this.dataSource[0].encabezado_evaluar.indicador.estandar
    let y = await this.formulaEvaluarService.evaluateEquation(this.dataSource[0].encabezado_evaluar.id_encabezado_evaluar)
    let uti= 1;
    let resp = 0;
    let vm=0;
    let um=0;
    // Guardar el valor obtenido en el indicador 
    this.indicador.id_indicador = this.data.id;
    this.indicador.valor_obtenido = parseFloat(y.toFixed(2));
    // Guardar el valor obtenido en el calificar indicador
    this.calificarIndicador.id_modelo = this.modeloVigente.id_modelo;
    this.calificarIndicador.valor_obtenido = parseFloat(y.toFixed(2));
    
    
    if (this.igualar == 1) {
      console.log("entro");
      if(this.dataSource[0].encabezado_evaluar.indicador.nombre==this.indicadorch){
        resp = this.calcularValorCargaHoraria(y);
      }else{
        resp = this.calcularValor(y,vm,um,x,uti);
      }
      if (resp > 100) {
        resp = 100;
      }
      // Guardar mas valores en el indicador 
      this.indicador.porc_obtenido = resp*100;
      this.indicador.porc_utilida_obtenida = parseFloat(((resp * this.data.peso) / 100).toFixed(3));

      // Guardar mas valores en el calificar indicador
      this.calificarIndicador.porc_obtenido = resp*100;
      this.calificarIndicador.porc_utilida_obtenida = parseFloat(((resp * this.data.peso) / 100).toFixed(3));
      //Ultimo luego de formar el indicador completamente
      this.calificarIndicador.indicador = this.indicador;
      //Peticion para crear la calificacion del indicador
      this.calificarIndicadorService.crearCalificarIndicador(this.calificarIndicador).subscribe({
        next: (data) => {
          console.log(data);
          console.log('SE CREO CORRECTAMENTE LA CALIFICACION DEL INDICADOR');
        }
      });
      this.indicadorServie.ponderarIndicador(this.data.id, this.indicador).subscribe({
        next: (data) => {
          this.dialogRef.close({ event: 'success' });
        }
      });
    } else if (this.igualar == 2) {
      let resp = 0
      if (y >= (x * 2)) {
        resp = 0;
      } else if (y <= x) {
        if (y <= 0) {
          resp = 0;
        } else {
          resp = 100;
        }
      } else if (y > x) {
        resp = ((((x * 2) - y) * 100) / x);
      }
      // Guardar mas valores en el indicador 
      this.indicador.porc_obtenido = parseFloat(resp.toFixed(2));
      this.indicador.porc_utilida_obtenida = parseFloat((((resp) * this.data.peso) / 100).toFixed(3));
      // Guardar mas valores en el calificar indicador
      this.calificarIndicador.porc_obtenido = parseFloat(resp.toFixed(2));
      this.calificarIndicador.porc_utilida_obtenida = parseFloat((((resp) * this.data.peso) / 100).toFixed(3));
      //Ultimo luego de formar el indicador completamente
      this.calificarIndicador.indicador = this.indicador;
      //Peticion para crear la calificacion del indicador
      this.calificarIndicadorService.crearCalificarIndicador(this.calificarIndicador).subscribe({
        next: (data) => {
          console.log(data);
          console.log('SE CREO CORRECTAMENTE LA CALIFICACION DEL INDICADOR');
        }
      });
      this.indicadorServie.ponderarIndicador(this.data.id, this.indicador).subscribe({
        next: (data) => {
          this.dialogRef.close({ event: 'success' });
        }
      });
    } else if (this.igualar == 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe escoger una opcion para evaluar el resultado',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
  }
   calcularValor(K18: number, G18: number, H18: number, I18: number, J18: number): number {
    if (K18 === 0) {
        return 0;
    } else if (K18 < G18) {
        return H18;
    } else if (K18 > I18) {
        return J18;
    } else if (J18 === 1) {
        return (K18 - G18) / (I18 - G18);
    } else {
        return (K18 - I18) / (G18 - I18);
    }
}
calcularValorCargaHoraria(K24: number): number {
  if (K24 <= 0) {
      return 0;
  } else if (K24 < 2) {
      return 0.5;
  } else if (K24 < 3) {
      return 0.9;
  } else if (K24 <= 18) {
      return 1;
  } else if (K24 <= 17) {
      return 0.95;
  } else if (K24 <= 18) {
      return 0.9;
  } else if (K24 <= 22.5) {
      return 0.7;
  } else if (K24 <= 27) {
      return 0.5;
  } else if (K24 <= 31.5) {
      return 0.3;
  } else if (K24 <= 36) {
      return 0.1;
  } else if (K24 >= 40) {
      return 0;
  } else {
      return 0; // En caso de que ninguno de los casos anteriores se cumpla
  }
}
}

