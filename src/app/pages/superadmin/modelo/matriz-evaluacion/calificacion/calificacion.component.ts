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
  cualitativa: Cualitativa = new Cualitativa();
  indicador: Indicador = new Indicador();
  evaluarCualitativa: EvaluarCualitativa = new EvaluarCualitativa();

  public columnNames2: ColumnNames = {
    abreviatura: 'Abreviatura'
  };
  columnsToDisplay2 = ['abreviatura'];
  columnsToDisplayWithExpand2 = [...this.columnsToDisplay2, 'valor'];
  y: number = 0;

  igualar: number = 0;
  constructor(private formulaEvaluarService: FormulaEvaluarService, public dialogRef: MatDialogRef<CalificacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private calificacionService: CalificacionService, private evaluarCualitativaService: EvaluarCualitativaService, private indicadorServie: IndicadoresService, private evaluarCuantitativaService: EvaluarCuantitativaService) { }
  ngOnInit(): void {
    this.obtener(this.data.valor);
  }

  obtener(valor: any) {
    if (valor == 'cualitativa') {
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
  }

  seleccionar(valor: any) {
    this.dato = valor.valor;
    this.cualitativa = valor;
    console.log(this.cualitativa);
  }

  guardar() {
    if (this.data.valor === 'cualitativa') {
      this.indicador.id_indicador = this.data.id;
      this.indicador.valor_obtenido = this.dato;
      this.indicador.porc_obtenido = this.dato * 100;
      this.indicador.porc_utilida_obtenida = parseFloat((((this.dato * 100) * this.data.peso) / 100).toFixed(3));

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
    } else if (this.data.valor === 'cuantitativa') {
      this.comparar();
    }
  }

  async comparar() {
    console.log(this.igualar, "igualar");
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
    if (this.igualar == 1) {
      console.log("entro");
      let resp = parseFloat(((y * 100) / x).toFixed(2));
      if (resp > 100) {
        resp = 100;
      }
      this.indicador.porc_obtenido = resp;
      this.indicador.porc_utilida_obtenida = parseFloat((((resp) * this.data.peso) / 100).toFixed(3));
      this.indicadorServie.ponderarIndicador(this.data.id, this.indicador).subscribe({
        next: (data) => {
          this.dialogRef.close({event: 'success'});
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
      this.indicadorServie.ponderarIndicador(this.data.id, this.indicador).subscribe({
        next: (data) => {
          this.dialogRef.close({event: 'success'});
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
}
