import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Criterio } from 'src/app/models/Criterio';
import { CriteriosService } from 'src/app/services/criterios.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { SubcriteriosService } from 'src/app/services/subcriterios.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subcriterio } from 'src/app/models/Subcriterio';
import { Indicador } from 'src/app/models/Indicador';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { DialogoModeloComponent } from '../dialogo-modelo/dialogo-modelo.component';
import { Router } from '@angular/router';


type ColumnNames = {
  [key: string]: string;
}

type ColumnNamesSub = {
  [key: string]: string;
}

type ColumnNamesInd = {
  [key: string]: string;
}

export interface IndicadorElement {
  id_indicador: number;
  nombre: string;
  selected: boolean;
}

let ELEMENT_DATA: IndicadorElement[] = [];
let ELEMENT_SELECTED: IndicadorElement[] = [];

@Component({
  selector: 'app-dialogo-criterio',
  templateUrl: './dialogo-criterio.component.html',
  styleUrls: ['./dialogo-criterio.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DialogoCriterioComponent implements OnInit {

  public columnNames: ColumnNames = {
    nombre: 'CRITERIOS'
  };

  public columnNamesSub: ColumnNamesSub = {
    nombre: 'SUBCRITERIOS'
  };

  public columnNamesInd: ColumnNamesInd = {
    nombre: 'INDICADORES'
  };

  dataSource: any;
  columnsToDisplay = ['nombre'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand']
  criterio: Criterio = new Criterio();
  expandedElement: Criterio | null = new Criterio;


  dataSource2: any;
  columnsToDisplay2 = ['nombre'];
  columnsToDisplayWithExpand2 = [...this.columnsToDisplay2, 'expand']
  subcriterio: Subcriterio = new Subcriterio();
  expandedElement2: Subcriterio | null = new Subcriterio;

  dataSource3: any;
  columnsToDisplay3 = ['nombre'];
  columnsToDisplayWithExpand3 = [...this.columnsToDisplay3, 'expand']
  indicador: Indicador = new Indicador();
  expandedElement3: Indicador = new Indicador;


  selectAll: boolean = false;


  constructor(private router: Router, private dialog: MatDialog, public dialogRef: MatDialogRef<DialogoCriterioComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private sharedDataService: SharedDataService, private _formBuilder: FormBuilder, private criterioService: CriteriosService, private subcriterioService: SubcriteriosService, private indicadorService: IndicadoresService) {

  }

  ngOnInit(): void {
    this.listarCriterios();
    this.listarSubcriterios();
    console.log(ELEMENT_SELECTED);
  }

  //consumir servicio de listar criterios
  listarCriterios() {
    this.criterioService.listarCriterio()
      .subscribe(data => {
        this.dataSource = data;
      })
  }

  //consumir servicio de listar subcriterios
  listarSubcriterios() {
    this.subcriterioService.listarSubcriterio()
      .subscribe(data => {
        this.dataSource2 = data;
      })
  }



  boton(valor: number) {
    this.criterio.id_criterio = valor;
    //consumir servicio de listar subcriterios por criterio
    this.subcriterioService.listarSubcriterioPorCriterio(this.criterio.id_criterio)
      .subscribe(data => {
        this.dataSource2 = data;
      })
  }

  boton2(valor: number) {
    this.subcriterio.id_subcriterio = valor;


    this.indicadorService.listarIndicadorPorSubcriterio(this.subcriterio.id_subcriterio)
      .subscribe(data => {
        ELEMENT_DATA = [];
        data.forEach((element: any) => {
          ELEMENT_DATA.push({ id_indicador: element.id_indicador, nombre: element.nombre, selected: false });
        });
        this.dataSource3 = ELEMENT_DATA;
        this.dataSource3.forEach((e: IndicadorElement) => {
          ELEMENT_SELECTED.forEach((x: IndicadorElement) => {
            if (e.id_indicador == x.id_indicador) {
              e.selected = x.selected;
            }
          });
        });
      });


  }

  toggleSelectAll(element: IndicadorElement) {
    ELEMENT_SELECTED.forEach((e: IndicadorElement) => {
      //comprobar si el elemento ya existe en el array
      if (e.id_indicador == element.id_indicador) {
        //si existe se elimina
        ELEMENT_SELECTED.splice(ELEMENT_SELECTED.indexOf(e), 1);
      }
    });
    if (element.selected) {
      ELEMENT_SELECTED.push(element);
    }
    this.dataSource3.forEach((e: IndicadorElement) => {
      ELEMENT_SELECTED.forEach((x: IndicadorElement) => {
        if (e.id_indicador == x.id_indicador) {
          e.selected = x.selected;
        }
      });
    });
  }

  guardar() {
    this.sharedDataService.agregarDatos(ELEMENT_SELECTED);
    console.log(ELEMENT_SELECTED);
  }
}
